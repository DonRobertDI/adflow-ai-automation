-- Enable UUID generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- CLIENTS
-- One record for each agency client.
-- =========================================================

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    website TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN (
            'active',
            'inactive',
            'archived'
        )),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- CAMPAIGNS
-- The main record for each advertising campaign.
-- =========================================================

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_code VARCHAR(60) NOT NULL UNIQUE,
    client_id UUID NOT NULL
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    -- Prevents the same form submission from being processed twice.
    source_submission_id VARCHAR(150) UNIQUE,

    product_service TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    offer TEXT NOT NULL,
    objective VARCHAR(100) NOT NULL,
    brand_tone VARCHAR(100) NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'brief_received'
        CHECK (status IN (
            'brief_received',
            'validating',
            'validation_failed',
            'generating',
            'awaiting_approval',
            'revision_requested',
            'approved',
            'rejected',
            'in_production',
            'completed',
            'automation_error',
            'archived'
        )),

    -- Stores the original form submission as structured JSON.
    brief JSONB NOT NULL DEFAULT '{}'::JSONB,

    drive_folder_id TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- CAMPAIGN VERSIONS
-- Every initial AI output and every revision is stored here.
-- We never overwrite the previous output.
-- =========================================================

CREATE TABLE IF NOT EXISTS campaign_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_id UUID NOT NULL
        REFERENCES campaigns(id)
        ON DELETE CASCADE,

    version_number INTEGER NOT NULL
        CHECK (version_number > 0),

    generation_type VARCHAR(30) NOT NULL DEFAULT 'initial'
        CHECK (generation_type IN (
            'initial',
            'revision',
            'manual'
        )),

    model_name VARCHAR(100),
    prompt_version VARCHAR(50),

    -- The full structured AI response.
    content JSONB NOT NULL DEFAULT '{}'::JSONB,

    validation_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (validation_status IN (
            'pending',
            'passed',
            'failed',
            'manual_review'
        )),

    validation_errors JSONB NOT NULL DEFAULT '[]'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (campaign_id, version_number)
);

-- =========================================================
-- APPROVALS
-- Stores human approval, rejection, or revision decisions.
-- =========================================================

CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_version_id UUID NOT NULL
        REFERENCES campaign_versions(id)
        ON DELETE CASCADE,

    decision VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (decision IN (
            'pending',
            'approved',
            'revision_requested',
            'rejected'
        )),

    reviewer_name VARCHAR(150),
    reviewer_email VARCHAR(255),
    feedback TEXT,

    -- A random token used by approval links.
    decision_token VARCHAR(150) NOT NULL UNIQUE,

    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at TIMESTAMPTZ
);

-- =========================================================
-- PRODUCTION TASKS
-- Tasks created after an ad package is approved.
-- =========================================================

CREATE TABLE IF NOT EXISTS production_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_id UUID NOT NULL
        REFERENCES campaigns(id)
        ON DELETE CASCADE,

    campaign_version_id UUID
        REFERENCES campaign_versions(id)
        ON DELETE SET NULL,

    task_type VARCHAR(60) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    external_system VARCHAR(60),
    external_task_id VARCHAR(150),
    external_task_url TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'created',
            'in_progress',
            'completed',
            'failed',
            'cancelled'
        )),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- AUTOMATION LOGS
-- Records important workflow events and failures.
-- =========================================================

CREATE TABLE IF NOT EXISTS automation_logs (
    id BIGSERIAL PRIMARY KEY,

    workflow_name VARCHAR(200) NOT NULL,
    execution_id VARCHAR(150),
    campaign_id UUID
        REFERENCES campaigns(id)
        ON DELETE SET NULL,

    level VARCHAR(20) NOT NULL DEFAULT 'info'
        CHECK (level IN (
            'debug',
            'info',
            'warning',
            'error',
            'critical'
        )),

    event_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- IDEMPOTENCY KEYS
-- Stops duplicate webhook or form submissions.
-- =========================================================

CREATE TABLE IF NOT EXISTS idempotency_keys (
    idempotency_key VARCHAR(200) PRIMARY KEY,
    workflow_name VARCHAR(200) NOT NULL,

    result_data JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- =========================================================
-- AUTOMATIC UPDATED_AT FUNCTION
-- Automatically changes updated_at whenever a row is edited.
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clients_set_updated_at ON clients;

CREATE TRIGGER clients_set_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS campaigns_set_updated_at ON campaigns;

CREATE TRIGGER campaigns_set_updated_at
BEFORE UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS production_tasks_set_updated_at
ON production_tasks;

CREATE TRIGGER production_tasks_set_updated_at
BEFORE UPDATE ON production_tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- INDEXES
-- Help PostgreSQL find commonly requested records faster.
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_campaigns_client_id
ON campaigns(client_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_status
ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_campaign_versions_campaign_id
ON campaign_versions(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_versions_validation
ON campaign_versions(validation_status);

CREATE INDEX IF NOT EXISTS idx_approvals_decision
ON approvals(decision);

CREATE INDEX IF NOT EXISTS idx_production_tasks_status
ON production_tasks(status);

CREATE INDEX IF NOT EXISTS idx_automation_logs_campaign
ON automation_logs(campaign_id);

CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at
ON automation_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_idempotency_expiration
ON idempotency_keys(expires_at);