import { accessTokenSchema, decisionSchema } from '../../../../src/lib/schemas';
import type { DecisionResponse } from '../../../../src/lib/types';
import type { Env } from '../../../_lib/env';
import { errorResponse, HttpError } from '../../../_lib/errors';
import { forwardToN8n } from '../../../_lib/n8n';
import {
  assertSameOrigin,
  createRequestId,
  firstParam,
  parseJsonBody,
  rejectHoneypot,
} from '../../../_lib/request';
import { jsonResponse } from '../../../_lib/response';
import { verifyTurnstile } from '../../../_lib/turnstile';

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const requestId = createRequestId();
  try {
    assertSameOrigin(request);
    const token = accessTokenSchema.safeParse(firstParam(params.token));
    if (!token.success) {
      throw new HttpError(
        401,
        'This secure review link is invalid or has expired.',
        'invalid_review_link',
      );
    }
    const raw = await parseJsonBody(request, 16 * 1024);
    const rawObject = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    rejectHoneypot(rawObject.website_confirm);
    const input = decisionSchema.safeParse(raw);
    if (!input.success) {
      throw new HttpError(422, 'Some review fields need attention.', 'validation_failed');
    }
    await verifyTurnstile(request.headers.get('x-turnstile-token') ?? '', request, env);
    const upstream = await forwardToN8n<DecisionResponse>({
      env,
      urlKey: 'N8N_DECISION_WEBHOOK_URL',
      requestId,
      method: 'POST',
      body: { token: token.data, ...input.data, request_id: requestId },
    });
    return jsonResponse(upstream, { requestId });
  } catch (error) {
    return errorResponse(error, requestId);
  }
};
