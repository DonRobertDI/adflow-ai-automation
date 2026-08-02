# AdFlow AI Architecture

## Purpose

AdFlow AI automates campaign intake, AI-assisted advertising strategy,
human approval, revisions, production-task creation, file organization,
and campaign tracking for a fictional Meta Ads agency.

## Main workflow

1. Client submits campaign brief.
2. n8n validates and normalizes the submission.
3. PostgreSQL stores the client and campaign.
4. Gemini creates a structured campaign package.
5. n8n validates the AI output.
6. A secure review page collects human approval or revision feedback.
7. Revision requests create a new version.
8. Approval creates production tasks.
9. Tasks synchronize with GitHub Issues.
10. Google Drive stores the approved package.
11. Error and recovery workflows monitor failures.
12. MCP tools expose controlled read-only campaign operations.

## Reliability controls

- Parameterized SQL
- Idempotent campaign submissions
- Versioned AI outputs
- Human approval before production
- Unique task keys
- Background job queue
- Retry counters
- Stale-job recovery
- Centralized error logging
- Expiring review tokens
- Restricted MCP tools

## Privacy

The portfolio demonstration uses fictional client information.
No real client data should be submitted through free AI tiers.