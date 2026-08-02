import { z } from 'zod';

export const campaignObjectives = [
  'Lead Generation',
  'Sales',
  'Website Traffic',
  'Brand Awareness',
] as const;

export const brandTones = ['Professional', 'Friendly', 'Energetic', 'Simple', 'Premium'] as const;

export const preferredPlatformOptions = [
  'Facebook Feed',
  'Instagram Feed',
  'Facebook Reels',
  'Instagram Reels',
  'Facebook Stories',
  'Instagram Stories',
] as const;

const shortText = (label: string, minimum = 2, maximum = 150) =>
  z
    .string()
    .trim()
    .min(minimum, `${label} must contain at least ${minimum} characters.`)
    .max(maximum, `${label} cannot exceed ${maximum} characters.`);

const longText = (label: string, minimum = 10, maximum = 5000) =>
  z
    .string()
    .trim()
    .min(minimum, `${label} must contain at least ${minimum} characters.`)
    .max(maximum, `${label} cannot exceed ${maximum.toLocaleString()} characters.`);

const optionalLongText = (label: string, maximum = 5000) =>
  z.string().trim().max(maximum, `${label} cannot exceed ${maximum.toLocaleString()} characters.`);

export function normalizeWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const contactStepSchema = z.object({
  client_name: shortText('Your name'),
  company_name: shortText('Company name'),
  client_email: z.string().trim().email('Enter a valid business email.').max(255),
  website: z
    .string()
    .trim()
    .max(500, 'Website cannot exceed 500 characters.')
    .transform(normalizeWebsite)
    .refine((value) => !value || z.url().safeParse(value).success, 'Enter a valid website URL.'),
});

export const productStepSchema = z.object({
  product_service: longText('Product or service'),
  product_features: longText('Product features'),
  offer: longText('Offer', 3, 3000),
  price_range: shortText('Price range', 1, 150),
  call_to_action: shortText('Call to action', 2, 150),
});

export const audienceStepSchema = z.object({
  target_audience: longText('Target audience'),
  main_customer_problem: longText('Main customer problem'),
  desired_outcome: longText('Desired outcome'),
  location_served: shortText('Location served', 2, 250),
});

export const preferencesStepSchema = z.object({
  campaign_objective: z.enum(campaignObjectives, 'Select a campaign objective.'),
  brand_tone: z.enum(brandTones, 'Select a brand tone.'),
  preferred_platforms: z
    .array(z.enum(preferredPlatformOptions))
    .min(1, 'Select at least one preferred placement.')
    .max(preferredPlatformOptions.length),
  competitor_examples: optionalLongText('Competitor examples'),
  claims_to_avoid: optionalLongText('Claims to avoid'),
  additional_notes: optionalLongText('Additional notes'),
});

export const campaignBriefSchema = contactStepSchema
  .extend(productStepSchema.shape)
  .extend(audienceStepSchema.shape)
  .extend(preferencesStepSchema.shape)
  .extend({
    submission_id: z.uuid('Submission ID must be a valid UUID.'),
    consent: z.boolean().refine(Boolean, 'Consent is required before submission.'),
    turnstile_token: z.string().min(1, 'Complete the security check.'),
    website_confirm: z.string().max(0, 'Invalid submission.'),
  });

export const campaignFormSchema = campaignBriefSchema.omit({ turnstile_token: true });

export const decisionSchema = z
  .object({
    reviewer_name: shortText('Reviewer name', 2, 150),
    reviewer_email: z.string().trim().email('Enter a valid reviewer email.').max(255),
    decision: z.enum(['approved', 'revision_requested', 'rejected']),
    feedback: z.string().trim().max(5000, 'Feedback cannot exceed 5,000 characters.'),
  })
  .superRefine((value, context) => {
    if (
      (value.decision === 'revision_requested' || value.decision === 'rejected') &&
      value.feedback.length < 5
    ) {
      context.addIssue({
        code: 'custom',
        path: ['feedback'],
        message: 'Add clear feedback for this decision.',
      });
    }
  });

export const contactFormSchema = z.object({
  name: shortText('Name', 2, 150),
  email: z.string().trim().email('Enter a valid email.').max(255),
  company: z.string().trim().max(150, 'Company cannot exceed 150 characters.'),
  message: longText('Message', 10, 3000),
  turnstile_token: z.string().min(1, 'Complete the security check.'),
  website_confirm: z.string().max(0, 'Invalid submission.'),
});

export const campaignCodeSchema = z
  .string()
  .trim()
  .min(3)
  .max(80)
  .regex(/^[A-Za-z0-9-]+$/, 'Invalid campaign reference.');

export const accessTokenSchema = z.string().trim().min(8).max(256);

export type CampaignBrief = z.infer<typeof campaignBriefSchema>;
export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
export type DecisionInput = z.infer<typeof decisionSchema>;
export type ContactInput = z.infer<typeof contactFormSchema>;

export const campaignStepSchemas = [
  contactStepSchema,
  productStepSchema,
  audienceStepSchema,
  preferencesStepSchema,
  campaignFormSchema.pick({ consent: true }),
] as const;

export function validateCampaignStep(step: number, values: unknown) {
  return campaignStepSchemas[step]?.safeParse(values) ?? { success: false as const };
}
