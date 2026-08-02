ALTER TABLE production_tasks
ADD COLUMN IF NOT EXISTS task_key VARCHAR(180);

ALTER TABLE production_tasks
ADD COLUMN IF NOT EXISTS metadata JSONB
NOT NULL DEFAULT '{}'::JSONB;

ALTER TABLE production_tasks
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- Only relevant if legacy rows already exist.
UPDATE production_tasks
SET task_key = 'LEGACY-' || id::TEXT
WHERE task_key IS NULL;

ALTER TABLE production_tasks
ALTER COLUMN task_key SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS
uq_production_tasks_task_key
ON production_tasks(task_key);

CREATE INDEX IF NOT EXISTS
idx_production_tasks_campaign_version
ON production_tasks(campaign_version_id);