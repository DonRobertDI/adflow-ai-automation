import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Check,
  CircleX,
  Clock3,
  Image,
  LoaderCircle,
  MessageSquareText,
  Send,
  Target,
  Video,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { ErrorState, LoadingSkeleton } from '../components/States';
import { Seo } from '../components/Seo';
import { Turnstile } from '../components/Turnstile';
import { api, isMockMode } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { formatDateTime, sentenceCase } from '../lib/format';
import { decisionSchema, type DecisionInput } from '../lib/schemas';
import type { CampaignReviewResponse, DecisionResponse } from '../lib/types';

export function ReviewPage() {
  const { token = '' } = useParams();
  const [data, setData] = useState<CampaignReviewResponse | null>(null);
  const [result, setResult] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DecisionInput>({
    resolver: zodResolver(decisionSchema),
    defaultValues: { reviewer_name: '', reviewer_email: '', decision: 'approved', feedback: '' },
    mode: 'onTouched',
  });
  const decision = watch('decision');
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const handleTurnstile = useCallback((value: string) => {
    setTurnstileToken(value);
    if (value) setTurnstileError('');
  }, []);
  const handleTurnstileError = useCallback((message: string) => {
    setTurnstileError(message);
    setTurnstileToken('');
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    if (!token) {
      setError('This secure review link is incomplete.');
      setLoading(false);
      return;
    }
    api
      .getReview(token)
      .then((response) => active && setData(response))
      .catch((requestError) => active && setError(getErrorMessage(requestError)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [attempt, token]);

  const submit = async (input: DecisionInput) => {
    if (!turnstileToken) {
      setTurnstileError('Complete the security check before submitting your decision.');
      return;
    }
    setSubmitError('');
    try {
      setResult(await api.submitDecision(token, input, turnstileToken));
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError));
    }
  };

  if (loading) return <LoadingSkeleton label="Loading campaign review" />;
  if (error || !data)
    return (
      <ErrorState
        message={error || 'Review information is unavailable.'}
        onRetry={token ? retry : undefined}
      />
    );
  if (result) {
    return (
      <div className="confirmation-page section-shell">
        <Seo
          title="Decision recorded"
          description="Your campaign review decision was recorded."
          noIndex
        />
        <div className={`confirmation-icon decision-${result.decision}`}>
          {result.decision === 'approved' ? (
            <Check />
          ) : result.decision === 'revision_requested' ? (
            <Clock3 />
          ) : (
            <CircleX />
          )}
        </div>
        <p className="eyebrow">Decision recorded</p>
        <h1>
          {result.decision === 'approved'
            ? 'Approved for production planning.'
            : result.decision === 'revision_requested'
              ? 'Revision request received.'
              : 'Campaign package closed.'}
        </h1>
        <p>{result.message}</p>
        <div className="reference-card">
          <span>Campaign reference</span>
          <strong>{result.campaign_code}</strong>
          <p>Your decision applies to the reviewed version and cannot be submitted twice.</p>
        </div>
      </div>
    );
  }

  const { content } = data;
  const reviewLocked = data.review_status !== 'pending';

  return (
    <>
      <Seo
        title={`Review ${data.campaign.code}`}
        description="Secure human review of an AdFlow Studio campaign package."
        noIndex
      />
      {isMockMode && (
        <div className="demo-banner">
          <span>Demonstration data</span> Decisions remain local and do not change production
          systems.
        </div>
      )}
      <section className="review-hero">
        <div className="section-shell">
          <div>
            <p className="eyebrow">Secure campaign review</p>
            <h1>{data.campaign.company_name}</h1>
            <div className="review-meta">
              <span>{data.campaign.code}</span>
              <span>Version {data.version.number}</span>
              <span>{data.campaign.objective}</span>
              <span>{data.campaign.brand_tone}</span>
            </div>
          </div>
          <div className="review-status">
            <span />
            <div>
              <small>Review status</small>
              <strong>
                {data.review_status === 'pending'
                  ? 'Decision required'
                  : sentenceCase(data.review_status)}
              </strong>
              <p>{data.status_message}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="review-package section-shell">
        <section className="review-section summary-review">
          <div className="review-section-title">
            <span>01</span>
            <div>
              <p className="eyebrow">Campaign summary</p>
              <h2>Strategic overview</h2>
            </div>
          </div>
          <p className="large-copy">{content.campaign_summary}</p>
          <div className="foundation-grid">
            {Object.entries(content.strategic_foundation).map(([key, value]) => (
              <div key={key}>
                <span>{key.replaceAll('_', ' ')}</span>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="review-section">
          <div className="review-section-title">
            <span>02</span>
            <div>
              <p className="eyebrow">Advertising angles</p>
              <h2>Strategic directions</h2>
            </div>
          </div>
          <div className="review-card-grid">
            {content.ad_angles.map((angle) => (
              <article key={angle.angle_id} className="review-content-card">
                <header>
                  <Target />
                  <span>{angle.angle_id}</span>
                  <i>{sentenceCase(angle.awareness_stage)}</i>
                </header>
                <h3>{angle.name}</h3>
                <p>{angle.rationale}</p>
                <strong>{angle.core_message}</strong>
              </article>
            ))}
          </div>
        </section>
        <section className="review-section">
          <div className="review-section-title">
            <span>03</span>
            <div>
              <p className="eyebrow">Hooks & copy</p>
              <h2>Written campaign units</h2>
            </div>
          </div>
          <div className="review-hooks">
            {content.hooks.map((hook) => (
              <div key={hook.hook_id}>
                <span>
                  {hook.hook_id} · {hook.angle_id}
                </span>
                <p>{hook.hook_text}</p>
              </div>
            ))}
          </div>
          <div className="review-ads">
            {content.ads.map((ad) => (
              <article key={ad.ad_id}>
                <header>
                  <MessageSquareText />
                  <span>
                    {ad.ad_id} · {ad.angle_id}
                  </span>
                </header>
                <p>{ad.primary_text}</p>
                <div>
                  <strong>{ad.headline}</strong>
                  <span>{ad.description}</span>
                </div>
                <i>{ad.call_to_action}</i>
              </article>
            ))}
          </div>
        </section>
        <section className="review-section">
          <div className="review-section-title">
            <span>04</span>
            <div>
              <p className="eyebrow">Image creative directions</p>
              <h2>Static concepts</h2>
            </div>
          </div>
          <div className="direction-review-list">
            {content.image_prompts.map((item) => (
              <article key={item.prompt_id}>
                <header>
                  <Image />
                  <span>
                    {item.prompt_id} · {item.angle_id}
                  </span>
                </header>
                <h3>{item.concept_name}</h3>
                <p>{item.prompt}</p>
                <div>
                  <strong>Overlay</strong>
                  {item.overlay_text}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="review-section">
          <div className="review-section-title">
            <span>05</span>
            <div>
              <p className="eyebrow">Video concepts</p>
              <h2>Short-form directions</h2>
            </div>
          </div>
          <div className="direction-review-list">
            {content.video_concepts.map((item) => (
              <article key={item.concept_id}>
                <header>
                  <Video />
                  <span>
                    {item.concept_id} · {item.duration_seconds} seconds
                  </span>
                </header>
                <h3>{item.concept_name}</h3>
                <blockquote>{item.opening_hook}</blockquote>
                <ol>
                  {item.scene_plan.map((scene) => (
                    <li key={scene}>{scene}</li>
                  ))}
                </ol>
                <p>
                  <strong>Voiceover:</strong> {item.voiceover}
                </p>
                <div>
                  <strong>End card</strong>
                  {item.end_card_text}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="review-section compliance-review">
          <div className="review-section-title">
            <span>06</span>
            <div>
              <p className="eyebrow">Compliance & quality</p>
              <h2>Notes for human review</h2>
            </div>
          </div>
          <div className="compliance-columns">
            <div>
              <h3>
                <AlertTriangle /> Unsupported claims
              </h3>
              <ul>
                {content.compliance_review.unsupported_claims.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>
                <AlertTriangle /> Policy or sensitivity risks
              </h3>
              <ul>
                {content.compliance_review.sensitive_or_policy_risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>
                <AlertTriangle /> Reviewer checks
              </h3>
              <ul>
                {content.compliance_review.notes_for_human_reviewer.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>
      <section className="decision-section">
        <div className="section-shell decision-layout">
          <div>
            <p className="eyebrow">Human decision</p>
            <h2>Approve, revise, or close this version.</h2>
            <p>
              Your decision is tied to version {data.version.number}, created{' '}
              {formatDateTime(data.version.created_at)}. Revision and rejection decisions require
              clear feedback.
            </p>
          </div>
          <form className="decision-form" onSubmit={handleSubmit(submit)} noValidate>
            <div className="form-grid">
              <label className="form-field">
                <span>Reviewer name</span>
                <input
                  {...register('reviewer_name')}
                  maxLength={150}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.reviewer_name)}
                />
                {errors.reviewer_name && <em role="alert">{errors.reviewer_name.message}</em>}
              </label>
              <label className="form-field">
                <span>Reviewer email</span>
                <input
                  {...register('reviewer_email')}
                  type="email"
                  maxLength={255}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.reviewer_email)}
                />
                {errors.reviewer_email && <em role="alert">{errors.reviewer_email.message}</em>}
              </label>
            </div>
            <fieldset className="decision-options">
              <legend>Decision</legend>
              {[
                ['approved', 'Approve', 'Move this version into production planning.'],
                [
                  'revision_requested',
                  'Request revision',
                  'Create a new version from your feedback.',
                ],
                ['rejected', 'Reject', 'Close this campaign package.'],
              ].map(([value, label, copy]) => (
                <label key={value} className={decision === value ? 'is-selected' : ''}>
                  <input type="radio" value={value} {...register('decision')} />
                  <span>
                    <i>
                      {value === 'approved' ? (
                        <Check />
                      ) : value === 'revision_requested' ? (
                        <Clock3 />
                      ) : (
                        <CircleX />
                      )}
                    </i>
                    <strong>{label}</strong>
                    <small>{copy}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className="form-field">
              <span>Feedback {decision === 'approved' ? '(optional)' : '(required)'}</span>
              <textarea
                {...register('feedback')}
                rows={6}
                maxLength={5000}
                placeholder="Add approval notes, revision instructions, or the reason for closing the package."
                aria-invalid={Boolean(errors.feedback)}
              />
              {errors.feedback && <em role="alert">{errors.feedback.message}</em>}
            </label>
            <Turnstile onVerify={handleTurnstile} onError={handleTurnstileError} />
            {turnstileError && (
              <p className="form-error" role="alert">
                {turnstileError}
              </p>
            )}
            {submitError && (
              <div className="inline-error" role="alert">
                {submitError}
              </div>
            )}
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting || reviewLocked}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="spin" /> Recording decision…
                </>
              ) : (
                <>
                  <Send /> Submit decision
                </>
              )}
            </button>
            {reviewLocked && (
              <p className="form-error">This review can no longer accept a decision.</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
