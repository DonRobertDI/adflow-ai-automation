# AdFlow AI

AdFlow AI is a self-hosted n8n automation system for a fictional
Meta Ads agency.

It automates:

- Client campaign intake
- PostgreSQL data tracking
- AI campaign strategy and ad generation
- Structured JSON validation
- Human approval and revision loops
- Version-controlled campaign outputs
- Production-task creation
- GitHub Issue synchronization
- Google Drive delivery
- Workflow error reporting
- Background-job recovery
- MCP tools for AI agents

## Technology

- n8n Community Edition
- Docker Compose
- PostgreSQL
- Gemini API
- GitHub
- Google Drive
- Gmail
- JavaScript
- SQL
- MCP

## Workflow sequence

Client Brief → Validation → Database → AI Generation → Human Review
→ Revision or Approval → Production Tasks → GitHub and Drive Delivery

## Safety and reliability

The workflow does not automatically publish advertisements.
Every AI package requires human approval before entering production.

The repository contains no API keys or passwords.
All demonstration client information is fictional.

## Running locally

1. Copy `.env.example` to `.env`.
2. Replace placeholder values.
3. Start Docker Desktop.
4. Run:

   docker compose up -d

5. Open:

   http://localhost:5678