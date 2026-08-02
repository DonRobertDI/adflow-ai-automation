import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

export function LoadingSkeleton({ label = 'Loading campaign information' }: { label?: string }) {
  return (
    <div className="section-shell state-page" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="skeleton skeleton-kicker" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-copy" />
      <div className="skeleton-grid">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="section-shell state-page">
      <div className="state-card" role="alert">
        <AlertCircle aria-hidden="true" />
        <p className="eyebrow">Unable to load</p>
        <h1>We couldn’t open this campaign view.</h1>
        <p>{message}</p>
        {onRetry && (
          <button type="button" className="button button-primary" onClick={onRetry}>
            <RefreshCw size={18} aria-hidden="true" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty-state">
      <Inbox aria-hidden="true" />
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
