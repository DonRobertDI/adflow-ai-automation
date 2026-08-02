import { accessTokenSchema, campaignCodeSchema } from '../../../../src/lib/schemas';
import type { CampaignStatusResponse } from '../../../../src/lib/types';
import type { Env } from '../../../_lib/env';
import { errorResponse, HttpError } from '../../../_lib/errors';
import { forwardToN8n } from '../../../_lib/n8n';
import { createRequestId, firstParam } from '../../../_lib/request';
import { jsonResponse } from '../../../_lib/response';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const requestId = createRequestId();
  try {
    const code = campaignCodeSchema.safeParse(firstParam(params.campaignCode));
    const token = accessTokenSchema.safeParse(new URL(request.url).searchParams.get('token') ?? '');
    if (!code.success || !token.success) {
      throw new HttpError(
        401,
        'This secure portal link is invalid or has expired.',
        'invalid_access_link',
      );
    }
    const upstream = await forwardToN8n<CampaignStatusResponse>({
      env,
      urlKey: 'N8N_STATUS_WEBHOOK_URL',
      requestId,
      method: 'GET',
      query: { campaign_code: code.data, token: token.data },
    });
    return jsonResponse(upstream, { requestId });
  } catch (error) {
    return errorResponse(error, requestId);
  }
};
