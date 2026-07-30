BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE graph_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type text NOT NULL CHECK (node_type IN (
    'event', 'evidence', 'insight', 'reasoning_record',
    'reasoning_disagreement', 'disagreement_resolution', 'model',
    'identity_hypothesis', 'identity_version', 'narrative_thread',
    'experiment', 'question', 'dialogue', 'resource', 'person', 'place'
  )),
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN (
    'proposed', 'active', 'silent', 'deprecated', 'archived'
  )),
  source_type text NOT NULL CHECK (source_type IN ('user', 'ai', 'system', 'import')),
  source_id text,
  created_by text NOT NULL CHECK (created_by IN ('uli', 'ai', 'system')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE INDEX graph_nodes_type_status_idx ON graph_nodes (node_type, status);
CREATE INDEX graph_nodes_source_idx ON graph_nodes (source_type, source_id);

CREATE TABLE relationship_types (
  key text PRIMARY KEY,
  source_node_types text[] NOT NULL,
  target_node_types text[] NOT NULL,
  direction text NOT NULL DEFAULT 'directed' CHECK (direction = 'directed'),
  cardinality text NOT NULL CHECK (cardinality IN ('one_to_one', 'one_to_many', 'many_to_one', 'many_to_many')),
  requires_confirmation boolean NOT NULL DEFAULT false,
  confidence_allowed boolean NOT NULL DEFAULT true,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality <> '')
);

CREATE TABLE reasoning_records (
  node_id uuid PRIMARY KEY REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  schema_version text NOT NULL,
  engine_version text NOT NULL,
  prompt_version text NOT NULL,
  confidence_level text NOT NULL CHECK (confidence_level IN ('low', 'medium', 'high')),
  recommended_action text NOT NULL CHECK (recommended_action IN (
    'stay_silent', 'ask_one_question', 'continue_observing',
    'propose_model_update', 'propose_identity_hypothesis', 'propose_narrative_thread'
  )),
  summary text NOT NULL,
  raw_structured_output jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reasoning_inputs (
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  input_node_id uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (reasoning_record_node_id, input_node_id)
);

CREATE TABLE reasoning_grounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  ground_key text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('observed_fact', 'historical_pattern', 'model_boundary', 'user_correction')),
  statement text NOT NULL,
  source_node_ids uuid[] NOT NULL,
  UNIQUE (reasoning_record_node_id, ground_key)
);

CREATE TABLE reasoning_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  output_type text NOT NULL CHECK (output_type IN (
    'create_evidence', 'support_model', 'challenge_model', 'expose_boundary',
    'propose_model_update', 'ask_question', 'no_action'
  )),
  target_node_id uuid REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  statement text NOT NULL,
  confidence numeric(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE TABLE reasoning_uncertainties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  statement text NOT NULL,
  ordinal integer NOT NULL CHECK (ordinal >= 0)
);

CREATE TABLE graph_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_type_key text NOT NULL REFERENCES relationship_types(key) ON DELETE RESTRICT,
  source_node_id uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  target_node_id uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  confidence numeric(4,3) CHECK (confidence >= 0 AND confidence <= 1),
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'confirmed', 'deprecated', 'archived')),
  reasoning_record_node_id uuid REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  created_by text NOT NULL CHECK (created_by IN ('uli', 'ai', 'system')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deprecated_at timestamptz,
  CHECK (source_node_id <> target_node_id OR relationship_type_key = 'REFERENCES')
);

CREATE INDEX graph_edges_source_idx ON graph_edges (source_node_id, relationship_type_key, status);
CREATE INDEX graph_edges_target_idx ON graph_edges (target_node_id, relationship_type_key, status);
CREATE INDEX graph_edges_reasoning_idx ON graph_edges (reasoning_record_node_id);

CREATE TABLE event_nodes (
  node_id uuid PRIMARY KEY REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  raw_content text NOT NULL,
  occurred_at timestamptz NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(trim(raw_content)) > 0)
);

CREATE TABLE evidence_nodes (
  node_id uuid PRIMARY KEY REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  claim text NOT NULL,
  polarity text NOT NULL CHECK (polarity IN ('support', 'challenge', 'unknown')),
  source_event_node_id uuid NOT NULL REFERENCES event_nodes(node_id) ON DELETE RESTRICT,
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  CHECK (length(trim(claim)) > 0)
);

CREATE TABLE model_nodes (
  node_id uuid PRIMARY KEY REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  lineage_root_node_id uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK (version >= 1),
  statement text NOT NULL,
  maturity text NOT NULL CHECK (maturity IN ('emerging', 'supported', 'stable', 'under_tension')),
  previous_model_node_id uuid REFERENCES model_nodes(node_id) ON DELETE RESTRICT,
  parent_model_node_id uuid REFERENCES model_nodes(node_id) ON DELETE RESTRICT,
  confirmed_by text NOT NULL CHECK (confirmed_by = 'uli'),
  confirmed_at timestamptz NOT NULL,
  UNIQUE (lineage_root_node_id, version),
  CHECK (length(trim(statement)) > 0)
);

CREATE TABLE model_boundary_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_node_id uuid NOT NULL REFERENCES model_nodes(node_id) ON DELETE RESTRICT,
  boundary_status text NOT NULL CHECK (boundary_status IN ('verified_applicable', 'unverified', 'known_failure')),
  condition text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(trim(condition)) > 0)
);

CREATE INDEX model_boundary_model_idx ON model_boundary_conditions (model_node_id, boundary_status);

CREATE TABLE model_update_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  previous_model_node_id uuid REFERENCES model_nodes(node_id) ON DELETE RESTRICT,
  previous_statement text,
  proposed_statement text NOT NULL,
  confidence numeric(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  status text NOT NULL CHECK (status IN ('pending', 'observing', 'confirmed', 'rejected')),
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by text CHECK (decided_by = 'uli'),
  CHECK (length(trim(proposed_statement)) > 0),
  CHECK ((status IN ('pending', 'observing') AND decided_at IS NULL) OR (status IN ('confirmed', 'rejected') AND decided_at IS NOT NULL))
);

CREATE TABLE model_update_candidate_evidence (
  candidate_id uuid NOT NULL REFERENCES model_update_candidates(id) ON DELETE RESTRICT,
  evidence_node_id uuid NOT NULL REFERENCES evidence_nodes(node_id) ON DELETE RESTRICT,
  PRIMARY KEY (candidate_id, evidence_node_id)
);

CREATE TABLE model_evidence_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_node_id uuid NOT NULL REFERENCES model_nodes(node_id) ON DELETE RESTRICT,
  evidence_node_id uuid NOT NULL REFERENCES evidence_nodes(node_id) ON DELETE RESTRICT,
  polarity text NOT NULL CHECK (polarity IN ('support', 'challenge', 'unknown')),
  context_key text NOT NULL,
  strength numeric(4,3) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  reasoning_record_node_id uuid NOT NULL REFERENCES reasoning_records(node_id) ON DELETE RESTRICT,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (model_node_id, evidence_node_id)
);

CREATE INDEX model_evidence_ledger_model_idx ON model_evidence_ledger (model_node_id, polarity, context_key);

COMMIT;
