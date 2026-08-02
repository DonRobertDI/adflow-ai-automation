import { contactFormSchema } from '../../src/lib/schemas';
import type { ContactResponse } from '../../src/lib/types';
import type { Env } from '../_lib/env';
import { errorResponse, HttpError } from '../_lib/errors';
import { forwardToN8n } from '../_lib/n8n';
import { assertSameOrigin, createRequestId, parseJsonBody, rejectHoneypot } from '../_lib/request';
import { jsonResponse } from '../_lib/response';
import { verifyTurnstile } from '../_lib/turnstile';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const requestId = createRequestId();
  try {
    assertSameOrigin(request);
    const raw = await parseJsonBody(request, 16 * 1024);
    const rawObject = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    rejectHoneypot(rawObject.website_confirm);
    const input = contactFormSchema.safeParse(raw);
    if (!input.success) {
      throw new HttpError(422, 'Some contact form fields need attention.', 'validation_failed');
    }
    await verifyTurnstile(input.data.turnstile_token, request, env);
    const { turnstile_token: _turnstile, website_confirm: _honeypot, ...message } = input.data;
    void _turnstile;
    void _honeypot;
    const upstream = await forwardToN8n<ContactResponse>({
      env,
      urlKey: 'N8N_CONTACT_WEBHOOK_URL',
      requestId,
      method: 'POST',
      body: { ...message, request_id: requestId },
    });
    return jsonResponse(upstream, { status: 201, requestId });
  } catch (error) {
    return errorResponse(error, requestId);
  }
};
