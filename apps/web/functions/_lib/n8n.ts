import type { Env } from './env';
import { requireBinding } from './env';
import { HttpError } from './errors';

interface ForwardOptions {
  env: Env;
  urlKey: keyof Env;
  requestId: string;
  method: 'GET' | 'POST';
  body?: unknown;
  query?: Record<string, string>;
}

export async function forwardToN8n<T>(options: ForwardOptions): Promise<T> {
  const endpoint = new URL(requireBinding(options.env, options.urlKey));
  for (const [key, value] of Object.entries(options.query ?? {})) {
    endpoint.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(endpoint.toString(), {
      method: options.method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-adflow-api-key': requireBinding(options.env, 'N8N_API_KEY'),
        'x-request-id': options.requestId,
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });

    if ([401, 403, 404, 409, 410, 422, 429].includes(response.status)) {
      const safeStatus = response.status === 410 ? 401 : response.status;
      throw new HttpError(
        safeStatus,
        clientMessageForStatus(safeStatus),
        'upstream_request_rejected',
      );
    }
    if (!response.ok) {
      throw new HttpError(
        502,
        'The campaign service returned an unexpected response.',
        'upstream_error',
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new HttpError(
        502,
        'The campaign service returned an unexpected response.',
        'invalid_upstream_response',
      );
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(
      503,
      'The campaign service is temporarily unavailable. Please try again.',
      'upstream_unavailable',
    );
  } finally {
    clearTimeout(timeout);
  }
}

function clientMessageForStatus(status: number): string {
  if (status === 401 || status === 403) return 'This secure link is invalid or has expired.';
  if (status === 404) return 'The requested campaign information was not found.';
  if (status === 409)
    return 'This action has already been completed or the campaign state changed.';
  if (status === 422) return 'Some submitted fields need attention.';
  if (status === 429) return 'Too many requests were received. Please wait and try again.';
  return 'The request could not be completed.';
}
