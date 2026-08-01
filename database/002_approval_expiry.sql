-- Add an expiration time to approval links.
ALTER TABLE approvals
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Populate the field for any existing records.
UPDATE approvals
SET expires_at = requested_at + INTERVAL '7 days'
WHERE expires_at IS NULL;

-- Automatically expire new approval links after seven days.
ALTER TABLE approvals
ALTER COLUMN expires_at
SET DEFAULT (NOW() + INTERVAL '7 days');

ALTER TABLE approvals
ALTER COLUMN expires_at
SET NOT NULL;

-- Speeds up expiration checks.
CREATE INDEX IF NOT EXISTS idx_approvals_expires_at
ON approvals(expires_at);

-- Only one pending approval request is allowed for each version.
CREATE UNIQUE INDEX IF NOT EXISTS uq_approvals_pending_version
ON approvals(campaign_version_id)
WHERE decision = 'pending';