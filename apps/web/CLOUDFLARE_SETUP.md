# Cloudflare Pages setup

This application deploys as one Cloudflare Pages project. Vite builds the static React client, and the `functions` directory deploys as same-origin Pages Functions.

## 1. Create the Pages project

Connect the `adflow-ai-automation` Git repository in **Workers & Pages → Create application → Pages → Connect to Git**.

Enter these exact deployment fields:

| Cloudflare field       | Value                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| Production branch      | Your protected production branch, normally `main`                          |
| Framework preset       | `Vite`                                                                     |
| Root directory         | `apps/web`                                                                 |
| Build command          | `npm run build`                                                            |
| Build output directory | `dist`                                                                     |
| Node.js version        | `24` through `NODE_VERSION=24` if the dashboard requires an explicit value |

Do not add a separate Functions build command. Cloudflare detects `apps/web/functions` because `apps/web` is the Pages root directory.

## 2. Public build variables

Add these under **Settings → Environment variables → Production** (and Preview if desired):

| Variable                  | Production value                                |
| ------------------------- | ----------------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY` | The public site key for the production hostname |
| `VITE_APP_NAME`           | `AdFlow Studio`                                 |
| `VITE_USE_MOCK_API`       | `false`                                         |

`VITE_` values are compiled into browser JavaScript. Never put API keys, webhook URLs, portal tokens, review tokens, or Turnstile secret keys in them.

## 3. Server-side bindings and secrets

Add the following under **Settings → Variables and Secrets** for Production and Preview. Use **Secret** for `N8N_API_KEY` and `TURNSTILE_SECRET_KEY`. Webhook URLs may be encrypted secrets as an additional precaution.

| Binding                    | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `N8N_API_KEY`              | Shared secret sent as `x-adflow-api-key` to every n8n request |
| `N8N_INTAKE_WEBHOOK_URL`   | Production campaign intake webhook                            |
| `N8N_STATUS_WEBHOOK_URL`   | Production campaign status webhook                            |
| `N8N_REVIEW_WEBHOOK_URL`   | Production review-package webhook                             |
| `N8N_DECISION_WEBHOOK_URL` | Production review-decision webhook                            |
| `N8N_CONTACT_WEBHOOK_URL`  | Production contact webhook                                    |
| `TURNSTILE_SECRET_KEY`     | Private Siteverify key                                        |

Expected local webhook placeholders are documented in `.dev.vars.example`. The existing workflow exports are preserved; configure or add the five authenticated API webhooks in n8n so they return the JSON shapes in `API_CONTRACT.md`.

Every n8n API webhook must reject requests without the expected `x-adflow-api-key`. Cloudflare also sends an `x-request-id` for correlation. Do not return raw workflow, database, Gemini, or credential errors to Pages Functions.

## 4. Turnstile

Create a Turnstile widget for the production and preview hostnames. The browser renders the public site key; Pages Functions validate every mutating request through the Siteverify endpoint using the secret key.

For local testing, Cloudflare’s documented always-pass keys are:

```dotenv
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Use these only in local or test environments. Production must use a real widget and matching production secret. See [Cloudflare’s Turnstile testing documentation](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## 5. Local integrated development

From `apps/web`:

```powershell
Copy-Item .env.example .env.local
Copy-Item .dev.vars.example .dev.vars
npm install
npm run dev:cloudflare
```

Replace only the local copies. Never edit the repository root `.env`, and never commit `.env.local` or `.dev.vars`.

`npm run dev:cloudflare` runs the equivalent of:

```bash
npm run build
npx wrangler pages dev dist
```

## 6. Security and caching verification

After deployment, verify:

1. `/_headers` applies CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS.
2. `/campaign/*`, `/review/*`, and `/api/*` return `Cache-Control: no-store` where applicable.
3. Mutating endpoints reject non-JSON content, oversized bodies, populated honeypots, cross-origin browser submissions, and invalid Turnstile tokens.
4. Browser network traffic calls only same-origin `/api/*` routes and never displays an n8n URL or `N8N_API_KEY`.
5. `VITE_USE_MOCK_API` is `false` in Production.
6. Portal and review pages receive `X-Robots-Tag: noindex, nofollow, noarchive`.

## 7. Deploy

Push the branch and let Cloudflare Pages run `npm run build`. A deployment is ready only after the Pages build succeeds and Functions report no routing errors. Test a Preview environment with non-production n8n webhooks before promoting the production deployment.
