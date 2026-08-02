import { describe, expect, it } from 'vitest';
import { getStatusPresentation, statusMap } from '../lib/status';

describe('technical status mapping', () => {
  it('maps every supported technical status to client-safe copy', () => {
    expect(Object.keys(statusMap)).toHaveLength(12);
    expect(getStatusPresentation('brief_received').label).toBe('Brief received');
    expect(getStatusPresentation('automation_error').label).toBe(
      'Our team is reviewing a processing issue',
    );
    expect(getStatusPresentation('completed').progress).toBe(100);
  });

  it('does not expose raw error wording', () => {
    expect(getStatusPresentation('automation_error').description).not.toMatch(
      /exception|stack|sql/i,
    );
  });
});
