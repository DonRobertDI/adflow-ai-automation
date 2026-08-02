import { accessTokenSchema } from '../../../src/lib/schemas';
import type { CampaignReviewResponse } from '../../../src/lib/types';
import type { Env } from '../../_lib/env';
import { errorResponse, HttpError } from '../../_lib/errors';
import { forwardToN8n } from '../../_lib/n8n';
import { createRequestId, firstParam } from '../../_lib/request';
import { jsonResponse } from '../../_lib/response';

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const requestId = createRequestId();
  try {
    const token = accessTokenSchema.safeParse(firstParam(params.token));
    if (!token.success) {
      throw new HttpError(
        401,
        'This secure review link is invalid or has expired.',
        'invalid_review_link',
      );
    }
    const upstream = await forwardToN8n<CampaignReviewResponse>({
      env,
      urlKey: 'N8N_REVIEW_WEBHOOK_URL',
      requestId,
      method: 'GET',
      query: { token: token.data },
    });
    return jsonResponse(upstream, { requestId });
  } catch (error) {
    return errorResponse(error, requestId);
  }
};
