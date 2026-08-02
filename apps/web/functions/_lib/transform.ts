import { z } from 'zod';
import type { CampaignCreateResponse, N8nCampaignCreateResponse } from '../../src/lib/types';
import { statusMap } from '../../src/lib/status';
import { HttpError } from './errors';

const technicalStatusSchema = z.enum(
  Object.keys(statusMap) as [keyof typeof statusMap, ...(keyof typeof statusMap)[]],
);

const n8nCampaignResponseSchema = z.object({
  success: z.literal(true),
  campaign_code: z.string().min(3).max(80),
  portal_token: z.string().min(8).max(256),
  portal_token_expires_at: z.string().min(1),
  status: technicalStatusSchema,
  company_name: z.string().min(1).max(150),
});

export function createPortalUrl(code: string, token: string): string {
  return `/campaign/${encodeURIComponent(code)}?token=${encodeURIComponent(token)}`;
}

export function transformCampaignResponse(input: unknown): CampaignCreateResponse {
  const parsed = n8nCampaignResponseSchema.safeParse(input);
  if (!parsed.success) {
    throw new HttpError(
      502,
      'The campaign service returned an unexpected response.',
      'invalid_upstream_response',
    );
  }
  const response = parsed.data as N8nCampaignCreateResponse;
  return {
    success: true,
    campaign: {
      code: response.campaign_code,
      status: response.status,
      company_name: response.company_name,
    },
    portal_url: createPortalUrl(response.campaign_code, response.portal_token),
    message: 'Your campaign brief was received. Keep this portal link to follow its progress.',
  };
}
