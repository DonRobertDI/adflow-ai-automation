export interface Env {
  N8N_API_KEY: string;
  N8N_INTAKE_WEBHOOK_URL: string;
  N8N_STATUS_WEBHOOK_URL: string;
  N8N_REVIEW_WEBHOOK_URL: string;
  N8N_DECISION_WEBHOOK_URL: string;
  N8N_CONTACT_WEBHOOK_URL: string;
  TURNSTILE_SECRET_KEY: string;
}

export function requireBinding(env: Env, key: keyof Env): string {
  const value = env[key]?.trim();
  if (!value || value === 'replace_me') {
    throw new Error(`Required server binding ${key} is not configured.`);
  }
  return value;
}
