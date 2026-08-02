import {
  Download,
  ExternalLink,
  FileCheck2,
  FolderOpen,
  Layers3,
  LockKeyhole,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { ErrorState, LoadingSkeleton } from '../components/States';
import { api, isMockMode } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { formatDateTime } from '../lib/format';
import { getStatusPresentation } from '../lib/status';
import type { CampaignStatusResponse } from '../lib/types';

const timelineEventLabels: Record<string, string> = {
  campaign_intake_saved: 'Brief received',
  ai_campaign_version_created: 'Initial campaign draft prepared',
  campaign_revision_requested: 'Revision requested',
  ai_campaign_revision_created: 'Revised campaign prepared',
  campaign_approved: 'Campaign approved',
  production_tasks_created: 'Production planning started',
  campaign_workspace_created: 'Campaign package ready',
};

const fallbackStatus = {
  label: 'Campaign in progress',
  description: 'Your campaign is currently being processed.',
  progress: 10,
  tone: 'neutral',
};

type NormalizedTimelineEvent = {
  key: string;
  title: string;
  occurredAt: string;
  detail: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readString(
  record: Record<string, unknown>,
  possibleKeys: string[],
): string {
  for (const key of possibleKeys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    if (typeof value === 'number') {
      return String(value);
    }
  }

  return '';
}

function normalizeTimelineEvent(
  event: unknown,
  index: number,
  fallbackDate: string,
): NormalizedTimelineEvent {
  if (!isRecord(event)) {
    return {
      key: `campaign-event-${index}`,
      title: 'Campaign updated',
      occurredAt: fallbackDate,
      detail: '',
    };
  }

  const eventType = readString(event, [
    'event_type',
    'eventType',
    'status',
    'type',
  ]);

  const providedTitle = readString(event, [
    'title',
    'label',
    'event_label',
    'eventLabel',
  ]);

  let statusLabel = '';

  if (eventType) {
    try {
      const presentation = getStatusPresentation(
        eventType as Parameters<typeof getStatusPresentation>[0],
      );

      statusLabel = presentation?.label ?? '';
    } catch {
      statusLabel = '';
    }
  }

  const title =
    providedTitle ||
    timelineEventLabels[eventType] ||
    statusLabel ||
    'Campaign updated';

  const occurredAt =
    readString(event, [
      'occurred_at',
      'occurredAt',
      'created_at',
      'createdAt',
      'updated_at',
      'updatedAt',
    ]) || fallbackDate;

  const detail = readString(event, [
    'detail',
    'description',
    'message',
  ]);

  const identifier = readString(event, [
    'id',
    'event_id',
    'eventId',
  ]);

  return {
    key:
      identifier ||
      `${eventType || 'campaign-event'}-${occurredAt}-${index}`,
    title,
    occurredAt,
    detail,
  };
}

function safeFormatDateTime(value: string | null | undefined): string {
  if (!value) {
    return 'Not available';
  }

  try {
    return formatDateTime(value);
  } catch {
    return 'Not available';
  }
}

export function CampaignStatusPage() {
  const { campaignCode = '' } = useParams();
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get('token') ??
    (isMockMode ? 'demo-portal-token' : '');

  const [data, setData] =
    useState<CampaignStatusResponse | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    if (!token) {
      setError(
        'This secure portal link is incomplete. Use the full link supplied by AdFlow Studio.',
      );
      setLoading(false);

      return () => {
        active = false;
      };
    }

    api
      .getCampaignStatus(campaignCode, token)
      .then((response) => {
        if (active) {
          setData(response);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [attempt, campaignCode, token]);

  const timeline = useMemo(() => {
    if (!data) {
      return [];
    }

    const rawTimeline = Array.isArray(data.timeline)
      ? data.timeline
      : [];

    return rawTimeline
      .map((event, index) =>
        normalizeTimelineEvent(
          event,
          index,
          data.campaign.updated_at,
        ),
      )
      .reverse();
  }, [data]);

  if (loading) {
    return (
      <LoadingSkeleton label="Loading campaign status" />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        message={
          error ||
          'Campaign information is unavailable.'
        }
        onRetry={token ? retry : undefined}
      />
    );
  }

  const campaignStatus =
    getStatusPresentation(data.campaign.status) ??
    fallbackStatus;

  const deliveryReady = Boolean(data.delivery?.ready);
  const pdfUrl = data.delivery?.pdf_url ?? '';
  const folderUrl = data.delivery?.folder_url ?? '';

  return (
    <>
      <Seo
        title={`Campaign ${data.campaign.code}`}
        description="Secure AdFlow Studio campaign status portal."
        noIndex
      />

      {isMockMode && (
        <div className="demo-banner">
          <span>Demonstration data</span>{' '}
          This portal is running with local fixture content.
        </div>
      )}

      <section className="portal-hero">
        <div className="section-shell portal-heading">
          <div>
            <p className="eyebrow">
              <LockKeyhole
                size={15}
                aria-hidden="true"
              />
              Secure campaign portal
            </p>

            <h1>{data.campaign.company_name}</h1>

            <span className="campaign-reference">
              {data.campaign.code}
            </span>
          </div>

          <div
            className={`large-status status-${campaignStatus.tone}`}
          >
            <span />

            <div>
              <small>Current status</small>

              <strong>{campaignStatus.label}</strong>

              <p>{campaignStatus.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-body">
        <div className="section-shell portal-grid">
          <div className="portal-main">
            <section className="portal-card progress-card">
              <header>
                <div>
                  <p className="eyebrow">
                    Campaign progress
                  </p>

                  <h2>
                    {campaignStatus.progress}% complete
                  </h2>
                </div>

                <span>
                  Updated{' '}
                  {safeFormatDateTime(
                    data.campaign.updated_at,
                  )}
                </span>
              </header>

              <div
                className="portal-progress"
                role="progressbar"
                aria-label="Campaign progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={campaignStatus.progress}
              >
                <span
                  style={{
                    width: `${campaignStatus.progress}%`,
                  }}
                />
              </div>

              <div className="progress-labels">
                <span>Brief</span>
                <span>Draft</span>
                <span>Review</span>
                <span>Production</span>
                <span>Ready</span>
              </div>
            </section>

            <section className="portal-card timeline-card">
              <header>
                <div>
                  <p className="eyebrow">Activity</p>
                  <h2>Campaign timeline</h2>
                </div>
              </header>

              {timeline.length > 0 ? (
                <ol>
                  {timeline.map((event, index) => (
                    <li
                      key={event.key}
                      className={
                        index === 0 ? 'is-latest' : ''
                      }
                    >
                      <span className="timeline-event-dot" />

                      <div>
                        <div>
                          <strong>{event.title}</strong>

                          {index === 0 && <i>Latest</i>}
                        </div>

                        <time dateTime={event.occurredAt}>
                          {safeFormatDateTime(
                            event.occurredAt,
                          )}
                        </time>

                        {event.detail && (
                          <p>{event.detail}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>
                  No campaign activity is available yet.
                </p>
              )}
            </section>
          </div>

          <aside className="portal-side">
            <section className="portal-card detail-card">
              <p className="eyebrow">Campaign details</p>

              <dl>
                <div>
                  <dt>Reference</dt>
                  <dd>{data.campaign.code}</dd>
                </div>

                <div>
                  <dt>Versions</dt>
                  <dd>
                    <Layers3
                      size={16}
                      aria-hidden="true"
                    />
                    {data.campaign.version_count}
                  </dd>
                </div>

                <div>
                  <dt>Brief received</dt>
                  <dd>
                    {safeFormatDateTime(
                      data.campaign.created_at,
                    )}
                  </dd>
                </div>

                <div>
                  <dt>Last updated</dt>
                  <dd>
                    {safeFormatDateTime(
                      data.campaign.updated_at,
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="portal-card delivery-card">
              <div className="delivery-icon">
                <FileCheck2 aria-hidden="true" />
              </div>

              <p className="eyebrow">Delivery</p>

              <h2>
                {deliveryReady
                  ? 'Your package is ready.'
                  : 'Delivery is being prepared.'}
              </h2>

              <p>
                {deliveryReady
                  ? 'Open the approved campaign PDF and shared workspace below.'
                  : 'Links will appear here after approval and production organization are complete.'}
              </p>

              {deliveryReady && (
                <div className="delivery-actions">
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-primary"
                    >
                      <Download
                        size={18}
                        aria-hidden="true"
                      />
                      Open campaign PDF
                    </a>
                  )}

                  {folderUrl && (
                    <a
                      href={folderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-secondary"
                    >
                      <FolderOpen
                        size={18}
                        aria-hidden="true"
                      />
                      Open shared folder
                      <ExternalLink
                        size={15}
                        aria-hidden="true"
                      />
                    </a>
                  )}

                  {!pdfUrl && !folderUrl && (
                    <p>
                      The package is marked ready, but no
                      delivery links are available yet.
                    </p>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}