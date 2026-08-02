import type { CampaignFormValues, DecisionInput } from './schemas';

export type TechnicalStatus =
  | 'brief_received'
  | 'validating'
  | 'validation_failed'
  | 'generating'
  | 'awaiting_approval'
  | 'revision_requested'
  | 'approved'
  | 'in_production'
  | 'completed'
  | 'automation_error'
  | 'rejected'
  | 'archived';

export interface CampaignSummary {
  code: string;
  status: TechnicalStatus;
  company_name: string;
}

export interface CampaignCreateResponse {
  success: true;
  campaign: CampaignSummary;
  portal_url: string;
  message: string;
}

export interface TimelineEvent {
  status: TechnicalStatus;
  occurred_at: string;
  title?: string;
  detail?: string;
}

export interface CampaignStatusResponse {
  success: true;
  campaign: CampaignSummary & {
    created_at: string;
    updated_at: string;
    version_count: number;
  };
  timeline: TimelineEvent[];
  delivery: {
    ready: boolean;
    pdf_url?: string | null;
    folder_url?: string | null;
  };
}

export interface AdAngle {
  angle_id: string;
  name: string;
  rationale: string;
  awareness_stage: string;
  core_message: string;
}

export interface Hook {
  hook_id: string;
  angle_id: string;
  hook_text: string;
}

export interface AdCopy {
  ad_id: string;
  angle_id: string;
  primary_text: string;
  headline: string;
  description: string;
  call_to_action: string;
}

export interface ImageDirection {
  prompt_id: string;
  angle_id: string;
  concept_name: string;
  prompt: string;
  overlay_text: string;
}

export interface VideoConcept {
  concept_id: string;
  angle_id: string;
  concept_name: string;
  opening_hook: string;
  duration_seconds: number;
  scene_plan: string[];
  voiceover: string;
  end_card_text: string;
}

export interface CampaignContent {
  campaign_summary: string;
  strategic_foundation: {
    audience_summary: string;
    primary_problem: string;
    desired_outcome: string;
    offer_positioning: string;
  };
  ad_angles: AdAngle[];
  hooks: Hook[];
  ads: AdCopy[];
  image_prompts: ImageDirection[];
  video_concepts: VideoConcept[];
  compliance_review: {
    unsupported_claims: string[];
    sensitive_or_policy_risks: string[];
    notes_for_human_reviewer: string[];
  };
}

export interface CampaignReviewResponse {
  success: true;
  review_status: 'pending' | 'already_decided' | 'expired';
  status_message: string;
  campaign: {
    code: string;
    company_name: string;
    objective: string;
    brand_tone: string;
  };
  version: {
    number: number;
    created_at: string;
  };
  content: CampaignContent;
}

export interface DecisionResponse {
  success: true;
  processed: boolean;
  decision: DecisionInput['decision'];
  campaign_code: string;
  campaign_status: TechnicalStatus;
  message: string;
}

export interface ContactResponse {
  success: true;
  message: string;
}

export interface N8nCampaignCreateResponse {
  success: true;
  campaign_code: string;
  portal_token: string;
  portal_token_expires_at: string;
  status: TechnicalStatus;
  company_name: string;
}

export type CampaignSubmissionPayload = CampaignFormValues & { turnstile_token: string };
