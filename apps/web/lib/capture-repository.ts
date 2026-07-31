import { neon } from "@neondatabase/serverless";
import type { AccessIdentity } from "./access";
import type { CaptureCommand, CapturedEvent } from "./capture-contract";
import { sha256Hex } from "./hash";

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database is not configured.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("The idempotency key was already used for different content.");
    this.name = "IdempotencyConflictError";
  }
}

interface EventRow {
  readonly node_id: string;
  readonly raw_content: string;
  readonly occurred_at: string | Date;
  readonly captured_at: string | Date;
  readonly content_sha256: string;
}

interface IdempotencyRow {
  readonly request_hash: string;
  readonly response_node_id: string;
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new DatabaseUnavailableError();
  return neon(databaseUrl);
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapEvent(row: EventRow, replayed: boolean): CapturedEvent {
  return {
    id: row.node_id,
    rawContent: row.raw_content,
    occurredAt: toIso(row.occurred_at),
    capturedAt: toIso(row.captured_at),
    contentSha256: row.content_sha256,
    replayed,
  };
}

async function readEventById(
  nodeId: string,
  identity: AccessIdentity,
): Promise<EventRow | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT
      e.node_id,
      e.raw_content,
      e.occurred_at,
      e.captured_at,
      e.content_sha256
    FROM event_nodes e
    WHERE e.node_id = ${nodeId}::uuid
      AND e.captured_by_subject = ${identity.subject}
    LIMIT 1
  `) as EventRow[];

  return rows[0] ?? null;
}

export async function getCapturedEvent(
  nodeId: string,
  identity: AccessIdentity,
): Promise<CapturedEvent | null> {
  const row = await readEventById(nodeId, identity);
  return row ? mapEvent(row, false) : null;
}

export async function createCapturedEvent(
  command: CaptureCommand,
  identity: AccessIdentity,
): Promise<CapturedEvent> {
  const sql = getSql();
  const nodeId = crypto.randomUUID();
  const contentSha256 = await sha256Hex(command.rawContent);
  const requestHash = await sha256Hex(
    JSON.stringify({
      rawContent: command.rawContent,
      occurredAt: command.occurredAt,
      subject: identity.subject,
    }),
  );

  const existing = (await sql`
    SELECT request_hash, response_node_id
    FROM command_idempotency
    WHERE command_type = 'capture_event'
      AND idempotency_key = ${command.idempotencyKey}
    LIMIT 1
  `) as IdempotencyRow[];

  if (existing[0]) {
    if (existing[0].request_hash !== requestHash) {
      throw new IdempotencyConflictError();
    }
    const existingEvent = await readEventById(existing[0].response_node_id, identity);
    if (!existingEvent) throw new IdempotencyConflictError();
    return mapEvent(existingEvent, true);
  }

  try {
    await sql.transaction(
      [
        sql`
          INSERT INTO graph_nodes (
            id, node_type, status, source_type, source_id, created_by
          ) VALUES (
            ${nodeId}::uuid,
            'event',
            'active',
            'user',
            ${command.idempotencyKey},
            'uli'
          )
        `,
        sql`
          INSERT INTO event_nodes (
            node_id,
            raw_content,
            occurred_at,
            content_sha256,
            captured_by_subject,
            captured_by_email
          ) VALUES (
            ${nodeId}::uuid,
            ${command.rawContent},
            ${command.occurredAt}::timestamptz,
            ${contentSha256},
            ${identity.subject},
            ${identity.email}
          )
        `,
        sql`
          INSERT INTO command_idempotency (
            command_type,
            idempotency_key,
            request_hash,
            response_node_id,
            created_by_subject,
            created_by_email
          ) VALUES (
            'capture_event',
            ${command.idempotencyKey},
            ${requestHash},
            ${nodeId}::uuid,
            ${identity.subject},
            ${identity.email}
          )
        `,
      ],
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    const raced = (await sql`
      SELECT request_hash, response_node_id
      FROM command_idempotency
      WHERE command_type = 'capture_event'
        AND idempotency_key = ${command.idempotencyKey}
      LIMIT 1
    `) as IdempotencyRow[];

    if (raced[0]?.request_hash === requestHash) {
      const racedEvent = await readEventById(raced[0].response_node_id, identity);
      if (racedEvent) return mapEvent(racedEvent, true);
    }
    throw error;
  }

  const created = await readEventById(nodeId, identity);
  if (!created) {
    throw new Error("Captured event could not be read after creation.");
  }

  return mapEvent(created, false);
}
