BEGIN;

ALTER TABLE event_nodes
  ADD COLUMN IF NOT EXISTS content_sha256 text,
  ADD COLUMN IF NOT EXISTS captured_by_subject text,
  ADD COLUMN IF NOT EXISTS captured_by_email text;

UPDATE event_nodes
SET
  content_sha256 = COALESCE(content_sha256, encode(digest(raw_content, 'sha256'), 'hex')),
  captured_by_subject = COALESCE(captured_by_subject, 'legacy:uli'),
  captured_by_email = COALESCE(captured_by_email, 'legacy@local.invalid')
WHERE
  content_sha256 IS NULL
  OR captured_by_subject IS NULL
  OR captured_by_email IS NULL;

ALTER TABLE event_nodes
  ALTER COLUMN content_sha256 SET NOT NULL,
  ALTER COLUMN captured_by_subject SET NOT NULL,
  ALTER COLUMN captured_by_email SET NOT NULL;

ALTER TABLE event_nodes
  ADD CONSTRAINT event_nodes_content_hash_format_check
  CHECK (content_sha256 ~ '^[0-9a-f]{64}$') NOT VALID;

ALTER TABLE event_nodes
  VALIDATE CONSTRAINT event_nodes_content_hash_format_check;

CREATE TABLE command_idempotency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_type text NOT NULL CHECK (command_type IN ('capture_event')),
  idempotency_key text NOT NULL,
  request_hash text NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'),
  response_node_id uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  created_by_subject text NOT NULL,
  created_by_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (command_type, idempotency_key)
);

CREATE INDEX command_idempotency_subject_idx
  ON command_idempotency (created_by_subject, created_at DESC);

CREATE OR REPLACE FUNCTION prevent_event_node_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'event_nodes are append-only; create a new event instead';
END;
$$;

DROP TRIGGER IF EXISTS event_nodes_append_only ON event_nodes;
CREATE TRIGGER event_nodes_append_only
BEFORE UPDATE OR DELETE ON event_nodes
FOR EACH ROW
EXECUTE FUNCTION prevent_event_node_mutation();

COMMIT;
