import type { TechnicalStatus } from './types';

interface StatusPresentation {
  label: string;
  description: string;
  progress: number;
  tone: 'neutral' | 'active' | 'attention' | 'success' | 'closed';
}

export const statusMap: Record<TechnicalStatus, StatusPresentation> = {
  brief_received: {
    label: 'Brief received',
    description: 'Your campaign information has reached the studio and is queued for validation.',
    progress: 10,
    tone: 'neutral',
  },
  validating: {
    label: 'Checking campaign information',
    description: 'We are checking that the brief has enough detail for a useful campaign draft.',
    progress: 20,
    tone: 'active',
  },
  validation_failed: {
    label: 'Additional information required',
    description: 'A team member will follow up to clarify part of the campaign brief.',
    progress: 20,
    tone: 'attention',
  },
  generating: {
    label: 'Preparing campaign strategy',
    description: 'AI-assisted drafting is creating a structured package for human review.',
    progress: 38,
    tone: 'active',
  },
  awaiting_approval: {
    label: 'Awaiting human review',
    description: 'The latest campaign draft is ready for a person to review and decide.',
    progress: 52,
    tone: 'active',
  },
  revision_requested: {
    label: 'Revision in progress',
    description: 'Reviewer feedback is being applied to a new, versioned campaign draft.',
    progress: 48,
    tone: 'attention',
  },
  approved: {
    label: 'Approved for production planning',
    description: 'A human approved the package and production planning can begin.',
    progress: 70,
    tone: 'success',
  },
  in_production: {
    label: 'Preparing production materials',
    description:
      'The approved package is being organized into production tasks and delivery files.',
    progress: 86,
    tone: 'active',
  },
  completed: {
    label: 'Campaign package ready',
    description: 'The approved campaign package and shared workspace are ready.',
    progress: 100,
    tone: 'success',
  },
  automation_error: {
    label: 'Our team is reviewing a processing issue',
    description: 'The campaign is safe. A person is reviewing an internal processing issue.',
    progress: 40,
    tone: 'attention',
  },
  rejected: {
    label: 'Campaign package closed',
    description: 'The review was closed without moving this campaign package into production.',
    progress: 100,
    tone: 'closed',
  },
  archived: {
    label: 'Campaign archived',
    description: 'This campaign is no longer active, but its history remains recorded.',
    progress: 100,
    tone: 'closed',
  },
};

export function getStatusPresentation(status: TechnicalStatus): StatusPresentation {
  return statusMap[status];
}
