import { campaignBriefSchema } from '../../../src/lib/schemas';
import type { Env } from '../../_lib/env';
import { errorResponse, HttpError } from '../../_lib/errors';
import { forwardToN8n } from '../../_lib/n8n';
import {
  assertSameOrigin,
  createRequestId,
  parseJsonBody,
  rejectHoneypot,
} from '../../_lib/request';
import { jsonResponse } from '../../_lib/response';
import { transformCampaignResponse } from '../../_lib/transform';
import { verifyTurnstile } from '../../_lib/turnstile';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const requestId = createRequestId();
  try {
    assertSameOrigin(request);
    const raw = await parseJsonBody(request, 64 * 1024);
    const rawObject = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    rejectHoneypot(rawObject.website_confirm);
    const parsed = campaignBriefSchema.safeParse(raw);
    if (!parsed.success) {
      throw new HttpError(422, 'Some campaign brief fields need attention.', 'validation_failed');
    }
    await verifyTurnstile(parsed.data.turnstile_token, request, env);
    const { turnstile_token: _turnstile, website_confirm: _honeypot, ...brief } = parsed.data;
    void _turnstile;
    void _honeypot;
    const upstream = await forwardToN8n({
      env,
      urlKey: 'N8N_INTAKE_WEBHOOK_URL',
      requestId,
      method: 'POST',
      body: { ...brief, request_id: requestId },
    });
    return jsonResponse(transformCampaignResponse(upstream), { status: 201, requestId });
  } catch (error) {
    return errorResponse(error, requestId);
  }
};
