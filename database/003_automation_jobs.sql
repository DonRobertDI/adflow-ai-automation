-- =========================================================
-- AUTOMATION JOBS
-- A reliable to-do queue for background automation work.
-- =========================================================

CREATE TABLE IF NOT EXISTS automation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_type VARCHAR(100) NOT NULL,

    campaign_id UUID NOT NULL
        REFERENCES campaigns(id)
        ON DELETE CASCADE,

    campaign_version_id UUID
        REFERENCES campaign_versions(id)
        ON DELETE SET NULL,

    approval_id UUID
        REFERENCES approvals(id)
        ON DELETE SET NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'queued'
        CHECK (status IN (
            'queued',
            'processing',
            'completed',
            'failed',
            'cancelled'
        )),

    payload JSONB NOT NULL DEFAULT '{}'::JSONB,

    attempts INTEGER NOT NULL DEFAULT 0
        CHECK (attempts >= 0),

    max_attempts INTEGER NOT NULL DEFAULT 3
        CHECK (max_attempts > 0),

    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent the same approval decision from creating
-- the same background job more than once.
CREATE UNIQUE INDEX IF NOT EXISTS
uq_automation_jobs_approval_type
ON automation_jobs (
    approval_id,
    job_type
)
WHERE approval_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS
idx_automation_jobs_queue
ON automation_jobs (
    status,
    available_at
);

CREATE INDEX IF NOT EXISTS
idx_automation_jobs_campaign
ON automation_jobs (
    campaign_id
);

DROP TRIGGER IF EXISTS
automation_jobs_set_updated_at
ON automation_jobs;

CREATE TRIGGER automation_jobs_set_updated_at
BEFORE UPDATE ON automation_jobs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();