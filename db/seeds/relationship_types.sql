INSERT INTO relationship_types (
  key, source_node_types, target_node_types, cardinality,
  requires_confirmation, confidence_allowed, description
) VALUES
('TRIGGERS', ARRAY['event'], ARRAY['evidence','reasoning_record','question'], 'one_to_many', false, true, 'A source event causes a derived cognitive object to be considered.'),
('DERIVED_FROM', ARRAY['evidence','insight','model','identity_hypothesis','identity_version','narrative_thread'], ARRAY['event','evidence','reasoning_record','model','identity_hypothesis'], 'many_to_many', false, true, 'The source was derived from the target without overwriting it.'),
('SUPPORTS', ARRAY['evidence','model'], ARRAY['model','identity_hypothesis','identity_version','narrative_thread'], 'many_to_many', false, true, 'The source increases confidence in the target.'),
('CHALLENGES', ARRAY['evidence','model'], ARRAY['model','identity_hypothesis','identity_version','narrative_thread'], 'many_to_many', false, true, 'The source introduces meaningful contradictory evidence.'),
('UNEXPLAINED_BY', ARRAY['evidence'], ARRAY['model'], 'many_to_many', false, true, 'The model does not yet explain the evidence.'),
('PROPOSES', ARRAY['reasoning_record'], ARRAY['model','question','experiment','identity_hypothesis','narrative_thread'], 'one_to_many', true, true, 'A reasoning record proposes a user-reviewable object.'),
('REVISES', ARRAY['model','identity_version'], ARRAY['model','identity_version'], 'one_to_one', true, false, 'A confirmed version supersedes an earlier version while preserving lineage.'),
('GENERALIZES', ARRAY['model'], ARRAY['model'], 'one_to_many', true, true, 'A higher-order model captures a shared mechanism.'),
('SPECIALIZES', ARRAY['model'], ARRAY['model'], 'many_to_one', true, true, 'A child model describes a narrower stable mechanism.'),
('INFORMS_IDENTITY', ARRAY['model','evidence'], ARRAY['identity_hypothesis','identity_version'], 'many_to_many', true, true, 'The source informs an identity hypothesis or version.'),
('SHAPES_NARRATIVE', ARRAY['identity_version','model','evidence','insight'], ARRAY['narrative_thread'], 'many_to_many', true, true, 'The source has narrative-level significance.'),
('TESTED_BY', ARRAY['model','identity_hypothesis'], ARRAY['experiment'], 'one_to_many', true, false, 'A contextual experiment tests a model or identity hypothesis.'),
('ANSWERS', ARRAY['dialogue','insight','model'], ARRAY['question'], 'many_to_many', false, true, 'The source partially or fully answers a question.'),
('REFERENCES', ARRAY['event','evidence','insight','reasoning_record','model','identity_hypothesis','identity_version','narrative_thread','experiment','question','dialogue','resource'], ARRAY['event','evidence','insight','reasoning_record','model','identity_hypothesis','identity_version','narrative_thread','experiment','question','dialogue','resource','person','place'], 'many_to_many', false, false, 'A non-semantic reference used for traceability.'),
('RESOLVES', ARRAY['disagreement_resolution'], ARRAY['reasoning_disagreement'], 'one_to_one', true, true, 'A resolution closes a disagreement without deleting history.')
ON CONFLICT (key) DO NOTHING;
