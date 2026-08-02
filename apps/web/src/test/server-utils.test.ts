import { describe, expect, it } from 'vitest';
import { HttpError, normalizeError } from '../../functions/_lib/errors';
import { createPortalUrl, transformCampaignResponse } from '../../functions/_lib/transform';

describe('safe error normalization', () => {
  it('keeps explicit safe HTTP errors', () => {
    expect(
      normalizeError(new HttpError(422, 'Some fields need attention.', 'validation_failed')),
    ).toEqual({
      status: 422,
      code: 'validation_failed',
      message: 'Some fields need attention.',
    });
  });

  it('hides unexpected internal error messages', () => {
    const safe = normalizeError(new Error('password=secret and SQL stack trace'));
    expect(safe.status).toBe(503);
    expect(safe.message).not.toContain('password');
    expect(safe.message).not.toContain('SQL');
  });
});

describe('campaign portal URL creation', () => {
  it('URL-encodes campaign codes and portal tokens', () => {
    expect(createPortalUrl('CMP 123', 'token/+ value')).toBe(
      '/campaign/CMP%20123?token=token%2F%2B%20value',
    );
  });
});

describe('campaign API response transformation', () => {
  it('nests campaign details and never returns a raw portal token property', () => {
    const transformed = transformCampaignResponse({
      success: true,
      campaign_code: 'CMP-2026-001',
      portal_token: 'super-secure-token',
      portal_token_expires_at: '2026-09-01T00:00:00.000Z',
      status: 'brief_received',
      company_name: 'FreshWeek Meals',
    });
    expect(transformed.campaign.code).toBe('CMP-2026-001');
    expect(transformed.portal_url).toContain('token=super-secure-token');
    expect(transformed).not.toHaveProperty('portal_token');
  });

  it('rejects malformed n8n responses', () => {
    expect(() => transformCampaignResponse({ success: true })).toThrow(HttpError);
  });
});
