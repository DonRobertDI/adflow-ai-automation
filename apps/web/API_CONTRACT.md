# AdFlow Studio API contract

All browser requests use same-origin `/api/*` routes. Cloudflare Pages Functions authenticate n8n with `x-adflow-api-key`, attach `x-request-id`, enforce fetch timeouts, and return JSON with `Cache-Control: no-store`.

Error responses never expose raw n8n, SQL, Gemini, or internal stack messages:

```json
{
  "success": false,
  "error": "validation_failed",
  "message": "Some submitted fields need attention.",
  "request_id": "uuid"
}
```

## POST `/api/campaigns`

Accepts `application/json` only, maximum 64 KiB. Validates same origin, honeypot, the complete Zod campaign schema, and Turnstile.

```json
{
  "submission_id": "uuid",
  "client_name": "Alex Morgan",
  "company_name": "FreshWeek Meals",
  "client_email": "alex@example.com",
  "website": "https://example.com",
  "product_service": "Prepared weekly meals",
  "product_features": "Prepared meals and scheduled delivery",
  "offer": "15% off the first weekly order",
  "price_range": "$50–$100 per week",
  "call_to_action": "Order Now",
  "target_audience": "Busy professionals",
  "main_customer_problem": "Limited time for meal planning",
  "desired_outcome": "A simpler weekday meal routine",
  "location_served": "Metro Manila",
  "campaign_objective": "Sales",
  "brand_tone": "Friendly",
  "preferred_platforms": ["Facebook Feed", "Instagram Reels"],
  "competitor_examples": "",
  "claims_to_avoid": "No unsupported health claims",
  "additional_notes": "",
  "consent": true,
  "turnstile_token": "token",
  "website_confirm": ""
}
```

The n8n response must be:

```json
{
  "success": true,
  "campaign_code": "CMP-2026-001",
  "portal_token": "opaque-token",
  "portal_token_expires_at": "2026-11-01T00:00:00.000Z",
  "status": "brief_received",
  "company_name": "FreshWeek Meals"
}
```

Pages Functions transform it to:

```json
{
  "success": true,
  "campaign": {
    "code": "CMP-2026-001",
    "status": "brief_received",
    "company_name": "FreshWeek Meals"
  },
  "portal_url": "/campaign/CMP-2026-001?token=opaque-token",
  "message": "Your campaign brief was received. Keep this portal link to follow its progress."
}
```

The portal token is never returned as a separate property.

## GET `/api/campaigns/:campaignCode/status?token=...`

The Function forwards `campaign_code` and `token` as query parameters. The expected n8n response is:

```json
{
  "success": true,
  "campaign": {
    "code": "CMP-2026-001",
    "company_name": "FreshWeek Meals",
    "status": "awaiting_approval",
    "created_at": "2026-08-01T00:00:00.000Z",
    "updated_at": "2026-08-02T00:00:00.000Z",
    "version_count": 1
  },
  "timeline": [
    {
      "status": "brief_received",
      "occurred_at": "2026-08-01T00:00:00.000Z"
    }
  ],
  "delivery": {
    "ready": false,
    "pdf_url": null,
    "folder_url": null
  }
}
```

Supported statuses are `brief_received`, `validating`, `validation_failed`, `generating`, `awaiting_approval`, `revision_requested`, `approved`, `in_production`, `completed`, `automation_error`, `rejected`, and `archived`. The React client maps these to client-safe labels and never renders a raw technical error.

## GET `/api/reviews/:token`

Expected response:

```json
{
  "success": true,
  "review_status": "pending",
  "status_message": "This version is ready for a human decision.",
  "campaign": {
    "code": "CMP-2026-001",
    "company_name": "FreshWeek Meals",
    "objective": "Sales",
    "brand_tone": "Friendly"
  },
  "version": {
    "number": 2,
    "created_at": "2026-08-02T00:00:00.000Z"
  },
  "content": {
    "campaign_summary": "...",
    "strategic_foundation": {
      "audience_summary": "...",
      "primary_problem": "...",
      "desired_outcome": "...",
      "offer_positioning": "..."
    },
    "ad_angles": [],
    "hooks": [],
    "ads": [],
    "image_prompts": [],
    "video_concepts": [],
    "compliance_review": {
      "unsupported_claims": [],
      "sensitive_or_policy_risks": [],
      "notes_for_human_reviewer": []
    }
  }
}
```

The content object follows the structured Gemini package already used by the n8n generation and revision workflows. React renders text nodes only; it does not use `dangerouslySetInnerHTML`.

## POST `/api/reviews/:token/decision`

Accepts `application/json` only, maximum 16 KiB. Turnstile is sent in the `x-turnstile-token` request header so the documented JSON body stays unchanged:

```json
{
  "reviewer_name": "Jamie Reviewer",
  "reviewer_email": "jamie@example.com",
  "decision": "revision_requested",
  "feedback": "Clarify the offer terms before approval."
}
```

`decision` must be `approved`, `revision_requested`, or `rejected`. Feedback of at least five characters is required for revision and rejection.

Expected response:

```json
{
  "success": true,
  "processed": true,
  "decision": "revision_requested",
  "campaign_code": "CMP-2026-001",
  "campaign_status": "revision_requested",
  "message": "The revision request was recorded."
}
```

Decision submissions are never retried automatically.

## POST `/api/contact`

Accepts `application/json` only, maximum 16 KiB. Validates same origin, honeypot, and Turnstile.

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "company": "FreshWeek Meals",
  "message": "I have a question about campaign scope.",
  "turnstile_token": "token",
  "website_confirm": ""
}
```

Expected response:

```json
{
  "success": true,
  "message": "Your message was received."
}
```
