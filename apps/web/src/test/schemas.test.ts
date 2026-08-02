import { describe, expect, it } from 'vitest';
import { campaignBriefSchema, decisionSchema, validateCampaignStep } from '../lib/schemas';

const validBrief = {
  submission_id: 'd991ddf4-e571-4cda-980e-95b06f067778',
  client_name: 'Alex Morgan',
  company_name: 'FreshWeek Meals',
  client_email: 'alex@example.com',
  website: 'freshweek.example',
  product_service: 'A weekly prepared meal ordering service for professionals.',
  product_features: 'Prepared meals, weekly ordering, and scheduled local delivery.',
  offer: '15% off the first weekly meal order',
  price_range: '$50–$100 per week',
  call_to_action: 'Order Now',
  target_audience: 'Busy professionals with limited time for weekday meal planning.',
  main_customer_problem: 'Weekday meal planning adds another decision after a full workday.',
  desired_outcome: 'A more predictable weekday meal routine with fewer planning decisions.',
  location_served: 'Metro Manila, Philippines',
  campaign_objective: 'Sales',
  brand_tone: 'Friendly',
  preferred_platforms: ['Facebook Feed', 'Instagram Reels'],
  competitor_examples: '',
  claims_to_avoid: 'Do not make health or time-saved claims.',
  additional_notes: '',
  consent: true,
  turnstile_token: 'test-token',
  website_confirm: '',
} as const;

describe('campaign brief schema', () => {
  it('accepts and normalizes a complete campaign brief', () => {
    const result = campaignBriefSchema.parse(validBrief);
    expect(result.website).toBe('https://freshweek.example');
    expect(result.preferred_platforms).toHaveLength(2);
  });

  it('rejects unsupported objectives, consent, and honeypot submissions', () => {
    const result = campaignBriefSchema.safeParse({
      ...validBrief,
      campaign_objective: 'Guaranteed Conversions',
      consent: false,
      website_confirm: 'bot value',
    });
    expect(result.success).toBe(false);
  });
});

describe('decision schema', () => {
  it('allows approval without feedback', () => {
    expect(
      decisionSchema.safeParse({
        reviewer_name: 'Jamie Reviewer',
        reviewer_email: 'jamie@example.com',
        decision: 'approved',
        feedback: '',
      }).success,
    ).toBe(true);
  });

  it('requires feedback for revision and rejection decisions', () => {
    for (const decision of ['revision_requested', 'rejected']) {
      expect(
        decisionSchema.safeParse({
          reviewer_name: 'Jamie Reviewer',
          reviewer_email: 'jamie@example.com',
          decision,
          feedback: '',
        }).success,
      ).toBe(false);
    }
  });
});

describe('campaign form step validation', () => {
  it('validates each completed step independently', () => {
    const formValues = { ...validBrief };
    expect(validateCampaignStep(0, formValues).success).toBe(true);
    expect(validateCampaignStep(1, formValues).success).toBe(true);
    expect(validateCampaignStep(2, formValues).success).toBe(true);
    expect(validateCampaignStep(3, formValues).success).toBe(true);
    expect(validateCampaignStep(4, formValues).success).toBe(true);
  });

  it('identifies missing audience detail at the audience step', () => {
    expect(validateCampaignStep(2, { ...validBrief, target_audience: '' }).success).toBe(false);
  });
});
