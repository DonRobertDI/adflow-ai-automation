import type { Env } from './env';
import { requireBinding } from './env';
import { HttpError } from './errors';

interface SiteverifyResponse {
  success?: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstile(token: string, request: Request, env: Env): Promise<void> {
  if (!token) {
    throw new HttpError(422, 'Complete the security check.', 'turnstile_required');
  }

  const form = new FormData();
  form.set('secret', requireBinding(env, 'TURNSTILE_SECRET_KEY'));
  form.set('response', token);
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) form.set('remoteip', remoteIp);
  form.set('idempotency_key', crypto.randomUUID());

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new HttpError(
        503,
        'The security check is temporarily unavailable.',
        'turnstile_unavailable',
      );
    }
    const result = (await response.json()) as SiteverifyResponse;
    if (!result.success) {
      throw new HttpError(
        422,
        'The security check was not accepted. Please try again.',
        'turnstile_failed',
      );
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(
      503,
      'The security check is temporarily unavailable.',
      'turnstile_unavailable',
    );
  } finally {
    clearTimeout(timeout);
  }
}
