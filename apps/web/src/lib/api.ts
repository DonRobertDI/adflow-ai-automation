import { ApiError } from './errors';
import type {
  CampaignCreateResponse,
  CampaignReviewResponse,
  CampaignStatusResponse,
  CampaignSubmissionPayload,
  ContactResponse,
  DecisionResponse,
} from './types';
import type { DecisionInput } from './schemas';
import {
  createMockDecisionResponse,
  mockCampaignCreateResponse,
  mockCampaignReview,
  mockCampaignStatus,
} from '../mocks/fixtures';

const REQUEST_TIMEOUT = 12_000;
export const isMockMode = import.meta.env.VITE_USE_MOCK_API === 'true';

async function pause(milliseconds = 450) {
  await new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });

    const body = (await response.json().catch(() => null)) as
      { message?: string; request_id?: string } | T | null;

    if (!response.ok) {
      const errorBody = body as { message?: string; request_id?: string } | null;
      throw new ApiError(
        errorBody?.message ?? 'The request could not be completed. Please try again.',
        response.status,
        errorBody?.request_id,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('The request took too long. Please try again.', 408);
    }
    throw new ApiError('We could not connect to AdFlow Studio. Please try again.', 503);
  } finally {
    window.clearTimeout(timeout);
  }
}

export const api = {
  async createCampaign(payload: CampaignSubmissionPayload): Promise<CampaignCreateResponse> {
    if (isMockMode) {
      await pause(700);
      return {
        ...mockCampaignCreateResponse,
        campaign: { ...mockCampaignCreateResponse.campaign, company_name: payload.company_name },
      };
    }
    return requestJson('/api/campaigns', { method: 'POST', body: JSON.stringify(payload) });
  },

  async getCampaignStatus(code: string, token: string): Promise<CampaignStatusResponse> {
    if (isMockMode) {
      await pause();
      return mockCampaignStatus;
    }
    return requestJson(
      `/api/campaigns/${encodeURIComponent(code)}/status?token=${encodeURIComponent(token)}`,
    );
  },

  async getReview(token: string): Promise<CampaignReviewResponse> {
    if (isMockMode) {
      await pause();
      return mockCampaignReview;
    }
    return requestJson(`/api/reviews/${encodeURIComponent(token)}`);
  },

  async submitDecision(
    token: string,
    input: DecisionInput,
    turnstileToken: string,
  ): Promise<DecisionResponse> {
    if (isMockMode) {
      await pause(650);
      return createMockDecisionResponse(input.decision);
    }
    return requestJson(`/api/reviews/${encodeURIComponent(token)}/decision`, {
      method: 'POST',
      body: JSON.stringify(input),
      headers: { 'x-turnstile-token': turnstileToken },
    });
  },

  async sendContact(input: {
    name: string;
    email: string;
    company: string;
    message: string;
    turnstile_token: string;
    website_confirm: string;
  }): Promise<ContactResponse> {
    if (isMockMode) {
      await pause();
      return { success: true, message: 'Demonstration message received. No email was sent.' };
    }
    return requestJson('/api/contact', { method: 'POST', body: JSON.stringify(input) });
  },
};
