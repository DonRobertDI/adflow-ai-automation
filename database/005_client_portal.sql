-- =========================================================
-- CLIENT PORTAL AND DELIVERY
-- =========================================================

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS portal_token VARCHAR(128);

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS portal_token_expires_at TIMESTAMPTZ;

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS pdf_file_id TEXT;

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS pdf_file_name TEXT;

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS pdf_drive_url TEXT;

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS delivery_ready_at TIMESTAMPTZ;

-- Backfill existing demonstration campaigns.
UPDATE campaigns
SET portal_token = encode(gen_random_bytes(32), 'hex')
WHERE portal_token IS NULL;

UPDATE campaigns
SET portal_token_expires_at =
    created_at + INTERVAL '90 days'
WHERE portal_token_expires_at IS NULL;

ALTER TABLE campaigns
ALTER COLUMN portal_token
SET DEFAULT encode(gen_random_bytes(32), 'hex');

ALTER TABLE campaigns
ALTER COLUMN portal_token
SET NOT NULL;

ALTER TABLE campaigns
ALTER COLUMN portal_token_expires_at
SET DEFAULT (NOW() + INTERVAL '90 days');

ALTER TABLE campaigns
ALTER COLUMN portal_token_expires_at
SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS
uq_campaigns_portal_token
ON campaigns(portal_token);

CREATE INDEX IF NOT EXISTS
idx_campaigns_portal_expiry
ON campaigns(portal_token_expires_at);

CREATE INDEX IF NOT EXISTS
idx_campaigns_delivery_ready
ON campaigns(delivery_ready_at);