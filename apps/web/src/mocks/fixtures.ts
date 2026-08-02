import type {
  CampaignCreateResponse,
  CampaignReviewResponse,
  CampaignStatusResponse,
  DecisionResponse,
} from '../lib/types';

const now = new Date();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

export const mockCampaignCreateResponse: CampaignCreateResponse = {
  success: true,
  campaign: {
    code: 'CMP-DEMO-FRESHWEEK',
    status: 'brief_received',
    company_name: 'Demonstration Company',
  },
  portal_url: '/campaign/CMP-DEMO-FRESHWEEK?token=demo-portal-token',
  message: 'Your demonstration campaign brief was received for structured review.',
};

export const mockCampaignStatus: CampaignStatusResponse = {
  success: true,
  campaign: {
    code: 'CMP-DEMO-FRESHWEEK',
    company_name: 'FreshWeek Meals',
    status: 'completed',
    version_count: 2,
    created_at: hoursAgo(72),
    updated_at: hoursAgo(2),
  },
  timeline: [
    { status: 'brief_received', occurred_at: hoursAgo(72) },
    { status: 'generating', occurred_at: hoursAgo(68) },
    { status: 'awaiting_approval', occurred_at: hoursAgo(60) },
    {
      status: 'revision_requested',
      occurred_at: hoursAgo(48),
      detail: 'A human reviewer requested clearer offer wording.',
    },
    { status: 'approved', occurred_at: hoursAgo(24) },
    { status: 'in_production', occurred_at: hoursAgo(12) },
    { status: 'completed', occurred_at: hoursAgo(2) },
  ],
  delivery: {
    ready: true,
    pdf_url: 'https://example.com/demonstration-campaign.pdf',
    folder_url: 'https://example.com/demonstration-workspace',
  },
};

export const mockCampaignReview: CampaignReviewResponse = {
  success: true,
  review_status: 'pending',
  status_message: 'This demonstration version is ready for a human decision.',
  campaign: {
    code: 'CMP-DEMO-FRESHWEEK',
    company_name: 'FreshWeek Meals',
    objective: 'Sales',
    brand_tone: 'Friendly',
  },
  version: { number: 2, created_at: hoursAgo(26) },
  content: {
    campaign_summary:
      'Position FreshWeek Meals as a practical weekday reset for busy professionals, pairing a clear first-order offer with convenience-led creative directions.',
    strategic_foundation: {
      audience_summary:
        'Busy professionals who want easier weekday meals without adding another planning task.',
      primary_problem:
        'Workday demands leave little time or energy for meal planning and preparation.',
      desired_outcome: 'A more predictable week with convenient, ready-to-enjoy meals.',
      offer_positioning: 'A low-friction first order with 15% off the first weekly meal order.',
    },
    ad_angles: [
      {
        angle_id: 'ANGLE-01',
        name: 'Reclaim the weekday',
        rationale: 'Connects convenience to the audience’s limited time after work.',
        awareness_stage: 'problem_aware',
        core_message: 'Dinner can be one less decision on a full workday.',
      },
      {
        angle_id: 'ANGLE-02',
        name: 'A calmer calendar',
        rationale: 'Frames meal planning as part of a more organized weekly routine.',
        awareness_stage: 'solution_aware',
        core_message: 'Plan meals once and make the rest of the week easier.',
      },
      {
        angle_id: 'ANGLE-03',
        name: 'Try the first week',
        rationale: 'Leads with the supplied introductory offer without overpromising results.',
        awareness_stage: 'product_aware',
        core_message: 'Start with 15% off your first weekly meal order.',
      },
    ],
    hooks: [
      {
        hook_id: 'HOOK-01',
        angle_id: 'ANGLE-01',
        hook_text: 'Your 6 p.m. calendar is full enough.',
      },
      {
        hook_id: 'HOOK-02',
        angle_id: 'ANGLE-01',
        hook_text: 'Make dinner the easy part of a busy day.',
      },
      {
        hook_id: 'HOOK-03',
        angle_id: 'ANGLE-02',
        hook_text: 'One weekly choice. Fewer weekday decisions.',
      },
      {
        hook_id: 'HOOK-04',
        angle_id: 'ANGLE-02',
        hook_text: 'Put weekday meals on a simpler schedule.',
      },
      {
        hook_id: 'HOOK-05',
        angle_id: 'ANGLE-03',
        hook_text: 'Take 15% off your first weekly meal order.',
      },
      {
        hook_id: 'HOOK-06',
        angle_id: 'ANGLE-03',
        hook_text: 'A simple first step toward easier weekdays.',
      },
      {
        hook_id: 'HOOK-07',
        angle_id: 'ANGLE-01',
        hook_text: 'Long workday? Dinner can still be sorted.',
      },
      {
        hook_id: 'HOOK-08',
        angle_id: 'ANGLE-02',
        hook_text: 'Build a better weekday meal rhythm.',
      },
    ],
    ads: [
      {
        ad_id: 'AD-01',
        angle_id: 'ANGLE-01',
        primary_text:
          'After a full workday, planning dinner can feel like one task too many. FreshWeek Meals helps make weekday meals simpler. Start with 15% off your first weekly meal order.',
        headline: 'Make dinner the easy part',
        description: '15% off your first weekly meal order.',
        call_to_action: 'Order Now',
      },
      {
        ad_id: 'AD-02',
        angle_id: 'ANGLE-02',
        primary_text:
          'A smoother week can start with fewer meal decisions. Explore FreshWeek Meals and choose a weekly order that fits your routine.',
        headline: 'A simpler weekday meal plan',
        description: 'Explore this week’s options.',
        call_to_action: 'Learn More',
      },
      {
        ad_id: 'AD-03',
        angle_id: 'ANGLE-03',
        primary_text:
          'Ready to try a more organized meal routine? Get 15% off your first weekly FreshWeek Meals order.',
        headline: 'Save 15% on your first order',
        description: 'Introductory offer for your first weekly order.',
        call_to_action: 'Order Now',
      },
    ],
    image_prompts: [
      {
        prompt_id: 'IMAGE-01',
        angle_id: 'ANGLE-01',
        concept_name: 'Desk to dinner',
        prompt:
          'Editorial overhead composition of a closed laptop beside a neatly plated meal, deep navy surface, warm off-white napkin, subtle magenta accent, believable food styling, no logos or text.',
        overlay_text: 'Make dinner the easy part.',
      },
      {
        prompt_id: 'IMAGE-02',
        angle_id: 'ANGLE-02',
        concept_name: 'The organized week',
        prompt:
          'Minimal weekly planner composition with three meal containers, calm natural light, premium editorial styling, restrained neutral palette, no brand marks.',
        overlay_text: 'One less weekday decision.',
      },
      {
        prompt_id: 'IMAGE-03',
        angle_id: 'ANGLE-03',
        concept_name: 'First-week offer',
        prompt:
          'Close crop of a colorful prepared meal on an off-white background with generous clear space for offer copy, premium commercial lighting, no logos.',
        overlay_text: '15% off your first weekly order.',
      },
    ],
    video_concepts: [
      {
        concept_id: 'VIDEO-01',
        angle_id: 'ANGLE-01',
        concept_name: 'Close the laptop',
        opening_hook: 'Your workday is over. Your dinner decision can be too.',
        duration_seconds: 20,
        scene_plan: [
          'Close laptop at the end of the workday.',
          'Open a neatly organized meal container.',
          'Plate the meal in quick, tactile close-ups.',
          'End on the supplied introductory offer.',
        ],
        voiceover:
          'When the workday runs long, keep dinner simple with FreshWeek Meals. Start with 15% off your first weekly meal order.',
        end_card_text: '15% off your first weekly order. Order now.',
      },
      {
        concept_id: 'VIDEO-02',
        angle_id: 'ANGLE-02',
        concept_name: 'Three easier evenings',
        opening_hook: 'What if three weekday dinners were already planned?',
        duration_seconds: 24,
        scene_plan: [
          'Show three busy calendar days.',
          'Match each day to a prepared meal.',
          'Show quick serving moments across the week.',
          'Close with the FreshWeek offer in plain text.',
        ],
        voiceover:
          'Plan your weekly meals once, then move through the week with fewer dinner decisions. Explore FreshWeek Meals today.',
        end_card_text: 'A simpler weekly meal routine. Learn more.',
      },
    ],
    compliance_review: {
      unsupported_claims: [
        'Do not claim time saved without client evidence.',
        'Do not describe meals as healthier without substantiation.',
      ],
      sensitive_or_policy_risks: [
        'Avoid implying the viewer has a medical, dietary, or financial condition.',
      ],
      notes_for_human_reviewer: [
        'Confirm the 15% offer terms and eligible delivery locations before production.',
        'Confirm whether “Order Now” is the correct CTA for every placement.',
      ],
    },
  },
};

export function createMockDecisionResponse(
  decision: DecisionResponse['decision'],
): DecisionResponse {
  const statuses: Record<DecisionResponse['decision'], DecisionResponse['campaign_status']> = {
    approved: 'approved',
    revision_requested: 'revision_requested',
    rejected: 'rejected',
  };
  return {
    success: true,
    processed: true,
    decision,
    campaign_code: 'CMP-DEMO-FRESHWEEK',
    campaign_status: statuses[decision],
    message: 'Your demonstration decision was recorded. No production systems were changed.',
  };
}
