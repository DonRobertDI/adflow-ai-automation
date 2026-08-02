import { HttpError } from './errors';

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function assertJsonRequest(request: Request): void {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.startsWith('application/json')) {
    throw new HttpError(415, 'Send this request as JSON.', 'invalid_content_type');
  }
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  if (!origin) return;
  if (origin !== new URL(request.url).origin) {
    throw new HttpError(403, 'Cross-origin submissions are not allowed.', 'origin_not_allowed');
  }
}

export async function parseJsonBody(request: Request, maximumBytes: number): Promise<unknown> {
  assertJsonRequest(request);
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw new HttpError(413, 'The submitted information is too large.', 'payload_too_large');
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maximumBytes) {
    throw new HttpError(413, 'The submitted information is too large.', 'payload_too_large');
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new HttpError(400, 'The request body must contain valid JSON.', 'invalid_json');
  }
}

export function rejectHoneypot(value: unknown): void {
  if (typeof value === 'string' && value.trim().length > 0) {
    throw new HttpError(400, 'The submission could not be accepted.', 'invalid_submission');
  }
}

export function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
