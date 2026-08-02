import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  LoaderCircle,
  Pencil,
  Send,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type FieldPath, type UseFormRegisterReturn, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Seo } from '../components/Seo';
import { Turnstile } from '../components/Turnstile';
import { api } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import {
  brandTones,
  campaignFormSchema,
  campaignObjectives,
  preferredPlatformOptions,
  type CampaignFormValues,
} from '../lib/schemas';
import { getStatusPresentation } from '../lib/status';
import type { CampaignCreateResponse } from '../lib/types';

const storageKey = 'adflow-campaign-draft-v1';
const steps = ['Contact', 'Product & offer', 'Audience', 'Preferences', 'Review'];

const stepFields: FieldPath<CampaignFormValues>[][] = [
  ['client_name', 'company_name', 'client_email', 'website'],
  ['product_service', 'product_features', 'offer', 'price_range', 'call_to_action'],
  ['target_audience', 'main_customer_problem', 'desired_outcome', 'location_served'],
  [
    'campaign_objective',
    'brand_tone',
    'preferred_platforms',
    'competitor_examples',
    'claims_to_avoid',
    'additional_notes',
  ],
  ['consent'],
];

const emptyValues: CampaignFormValues = {
  submission_id: '',
  client_name: '',
  company_name: '',
  client_email: '',
  website: '',
  product_service: '',
  product_features: '',
  offer: '',
  price_range: '',
  call_to_action: '',
  target_audience: '',
  main_customer_problem: '',
  desired_outcome: '',
  location_served: '',
  campaign_objective: 'Lead Generation',
  brand_tone: 'Professional',
  preferred_platforms: [],
  competitor_examples: '',
  claims_to_avoid: '',
  additional_notes: '',
  consent: false,
  website_confirm: '',
};

function initialValues(): CampaignFormValues {
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved) as CampaignFormValues;
      return {
        ...emptyValues,
        ...parsed,
        submission_id: parsed.submission_id || crypto.randomUUID(),
      };
    }
  } catch {
    sessionStorage.removeItem(storageKey);
  }
  return { ...emptyValues, submission_id: crypto.randomUUID() };
}

interface FieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
}

function TextField({ label, registration, error, hint, ...props }: FieldProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {hint && <small>{hint}</small>}
      <input
        {...registration}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${registration.name}-error` : undefined}
      />
      {error && (
        <em id={`${registration.name}-error`} role="alert">
          {error}
        </em>
      )}
    </label>
  );
}

function TextAreaField({ label, registration, error, hint, placeholder, maxLength }: FieldProps) {
  return (
    <label className="form-field form-field-wide">
      <span>{label}</span>
      {hint && <small>{hint}</small>}
      <textarea
        {...registration}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${registration.name}-error` : undefined}
      />
      <div className="field-meta">
        {error ? (
          <em id={`${registration.name}-error`} role="alert">
            {error}
          </em>
        ) : (
          <i>Maximum {maxLength?.toLocaleString()} characters</i>
        )}
      </div>
    </label>
  );
}

export function StartCampaignPage() {
  const [step, setStep] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<CampaignCreateResponse | null>(null);
  const submissionLock = useRef(false);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: initialValues(),
    mode: 'onTouched',
  });

  useEffect(() => {
    const subscription = watch((values) => {
      sessionStorage.setItem(storageKey, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const nextStep = async () => {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleTurnstile = useCallback((token: string) => {
    setTurnstileToken(token);
    if (token) setTurnstileError('');
  }, []);
  const handleTurnstileError = useCallback((message: string) => {
    setTurnstileError(message);
    setTurnstileToken('');
  }, []);

  const submit = async (values: CampaignFormValues) => {
    if (submissionLock.current) return;
    if (!turnstileToken) {
      setTurnstileError('Complete the security check before submitting.');
      return;
    }

    submissionLock.current = true;
    setSubmitError('');
    try {
      const response = await api.createCampaign({ ...values, turnstile_token: turnstileToken });
      setResult(response);
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      submissionLock.current = false;
    }
  };

  if (result) {
    const status = getStatusPresentation(result.campaign.status);
    return (
      <>
        <Seo
          title="Campaign received"
          description="Your AdFlow Studio campaign brief was received."
          noIndex
        />
        <div className="confirmation-page section-shell">
          <div className="confirmation-icon">
            <Check aria-hidden="true" />
          </div>
          <p className="eyebrow">Campaign received</p>
          <h1>Your brief has a place in the workflow.</h1>
          <p>{result.message}</p>
          <div className="reference-card">
            <span>Campaign reference</span>
            <strong>{result.campaign.code}</strong>
            <div>
              <i />
              <p>
                <b>{status.label}</b>
                {status.description}
              </p>
            </div>
          </div>
          <Link to={result.portal_url} className="button button-primary">
            Open campaign portal <ExternalLink size={18} />
          </Link>
          <p className="confirmation-note">
            A separate secure review link will be delivered to the authorized reviewer when a
            version is ready.
          </p>
        </div>
      </>
    );
  }

  const values = getValues();

  return (
    <>
      <Seo
        title="Start a campaign"
        description="Submit a structured five-step campaign brief to AdFlow Studio."
      />
      <PageHeader
        eyebrow="Campaign brief"
        title="Give the campaign a strong starting point."
        description="Share accurate business context through five focused steps. Your draft stays in this browser session until you submit it."
      />
      <section className="form-section">
        <div className="section-shell form-layout">
          <aside className="form-sidebar">
            <div className="step-count">
              <span>Step {step + 1}</span>
              <strong>{steps.length}</strong>
            </div>
            <div className="form-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
              <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>
            <ol>
              {steps.map((label, index) => (
                <li
                  key={label}
                  className={index === step ? 'is-current' : index < step ? 'is-complete' : ''}
                >
                  <button
                    type="button"
                    onClick={() => index < step && setStep(index)}
                    disabled={index > step}
                    aria-current={index === step ? 'step' : undefined}
                  >
                    <span>{index < step ? <Check size={14} /> : index + 1}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
            <div className="privacy-note">
              <strong>Session-only draft</strong>
              <p>
                Draft fields are saved in sessionStorage and removed after successful submission.
              </p>
            </div>
          </aside>

          <form className="campaign-form" onSubmit={handleSubmit(submit)} noValidate>
            <input
              {...register('website_confirm')}
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <header className="form-step-header">
              <span>0{step + 1}</span>
              <div>
                <p className="eyebrow">{steps[step]}</p>
                <h2>
                  {
                    [
                      'Who should we keep in the loop?',
                      'What are we helping you promote?',
                      'Who needs to see the campaign?',
                      'How should the campaign show up?',
                      'Confirm the campaign brief.',
                    ][step]
                  }
                </h2>
              </div>
            </header>

            {step === 0 && (
              <div className="form-grid">
                <TextField
                  label="Your name"
                  registration={register('client_name')}
                  error={errors.client_name?.message}
                  placeholder="Alex Morgan"
                  maxLength={150}
                  autoComplete="name"
                />
                <TextField
                  label="Company name"
                  registration={register('company_name')}
                  error={errors.company_name?.message}
                  placeholder="Company name"
                  maxLength={150}
                  autoComplete="organization"
                />
                <TextField
                  label="Business email"
                  registration={register('client_email')}
                  error={errors.client_email?.message}
                  type="email"
                  placeholder="alex@company.com"
                  maxLength={255}
                  autoComplete="email"
                />
                <TextField
                  label="Website"
                  hint="Optional — we’ll add https:// if needed."
                  registration={register('website')}
                  error={errors.website?.message}
                  type="url"
                  placeholder="company.com"
                  maxLength={500}
                  autoComplete="url"
                />
              </div>
            )}

            {step === 1 && (
              <div className="form-grid">
                <TextAreaField
                  label="Product or service"
                  hint="Describe what you sell in plain language."
                  registration={register('product_service')}
                  error={errors.product_service?.message}
                  placeholder="What is the product or service?"
                  maxLength={5000}
                />
                <TextAreaField
                  label="Product features"
                  hint="Only include facts you can support."
                  registration={register('product_features')}
                  error={errors.product_features?.message}
                  placeholder="Key features, differentiators, or inclusions"
                  maxLength={5000}
                />
                <TextAreaField
                  label="Offer"
                  registration={register('offer')}
                  error={errors.offer?.message}
                  placeholder="Discount, trial, package, or core value proposition"
                  maxLength={3000}
                />
                <TextField
                  label="Price range"
                  registration={register('price_range')}
                  error={errors.price_range?.message}
                  placeholder="$50–$100 / month"
                  maxLength={150}
                />
                <TextField
                  label="Call to action"
                  registration={register('call_to_action')}
                  error={errors.call_to_action?.message}
                  placeholder="Learn More"
                  maxLength={150}
                />
              </div>
            )}

            {step === 2 && (
              <div className="form-grid">
                <TextAreaField
                  label="Target audience"
                  registration={register('target_audience')}
                  error={errors.target_audience?.message}
                  placeholder="Who is the campaign intended to reach?"
                  maxLength={5000}
                />
                <TextAreaField
                  label="Main customer problem"
                  registration={register('main_customer_problem')}
                  error={errors.main_customer_problem?.message}
                  placeholder="What practical problem are they trying to solve?"
                  maxLength={5000}
                />
                <TextAreaField
                  label="Desired outcome"
                  registration={register('desired_outcome')}
                  error={errors.desired_outcome?.message}
                  placeholder="What do they want to be different?"
                  maxLength={5000}
                />
                <TextField
                  label="Location served"
                  registration={register('location_served')}
                  error={errors.location_served?.message}
                  placeholder="Metro Manila, Philippines"
                  maxLength={250}
                />
              </div>
            )}

            {step === 3 && (
              <div className="form-grid">
                <label className="form-field">
                  <span>Campaign objective</span>
                  <select
                    {...register('campaign_objective')}
                    aria-invalid={Boolean(errors.campaign_objective)}
                  >
                    {campaignObjectives.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  {errors.campaign_objective && (
                    <em role="alert">{errors.campaign_objective.message}</em>
                  )}
                </label>
                <label className="form-field">
                  <span>Brand tone</span>
                  <select {...register('brand_tone')} aria-invalid={Boolean(errors.brand_tone)}>
                    {brandTones.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  {errors.brand_tone && <em role="alert">{errors.brand_tone.message}</em>}
                </label>
                <fieldset className="form-field form-field-wide platform-field">
                  <legend>Preferred placements</legend>
                  <p>Select every placement you want considered.</p>
                  <div>
                    {preferredPlatformOptions.map((platform) => (
                      <label key={platform}>
                        <input
                          type="checkbox"
                          value={platform}
                          {...register('preferred_platforms')}
                        />
                        <span>
                          <Check size={14} />
                          {platform}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.preferred_platforms && (
                    <em role="alert">{errors.preferred_platforms.message}</em>
                  )}
                </fieldset>
                <TextAreaField
                  label="Competitor examples"
                  hint="Optional. References only; wording will not be copied."
                  registration={register('competitor_examples')}
                  error={errors.competitor_examples?.message}
                  placeholder="Names, sites, or ads you like"
                  maxLength={5000}
                />
                <TextAreaField
                  label="Claims to avoid"
                  hint="Optional. Add restricted phrases or unsupported claims."
                  registration={register('claims_to_avoid')}
                  error={errors.claims_to_avoid?.message}
                  placeholder="Claims or language the campaign must not use"
                  maxLength={5000}
                />
                <TextAreaField
                  label="Additional notes"
                  hint="Optional."
                  registration={register('additional_notes')}
                  error={errors.additional_notes?.message}
                  placeholder="Anything else a human reviewer should know"
                  maxLength={5000}
                />
              </div>
            )}

            {step === 4 && (
              <div className="review-step">
                {[
                  [
                    'Contact',
                    0,
                    [
                      ['Name', values.client_name],
                      ['Company', values.company_name],
                      ['Email', values.client_email],
                      ['Website', values.website || 'Not provided'],
                    ],
                  ],
                  [
                    'Product & offer',
                    1,
                    [
                      ['Product or service', values.product_service],
                      ['Features', values.product_features],
                      ['Offer', values.offer],
                      ['Price range', values.price_range],
                      ['Call to action', values.call_to_action],
                    ],
                  ],
                  [
                    'Audience',
                    2,
                    [
                      ['Audience', values.target_audience],
                      ['Problem', values.main_customer_problem],
                      ['Desired outcome', values.desired_outcome],
                      ['Location', values.location_served],
                    ],
                  ],
                  [
                    'Preferences',
                    3,
                    [
                      ['Objective', values.campaign_objective],
                      ['Tone', values.brand_tone],
                      ['Placements', values.preferred_platforms.join(', ')],
                      ['Competitor examples', values.competitor_examples || 'Not provided'],
                      ['Claims to avoid', values.claims_to_avoid || 'Not provided'],
                      ['Notes', values.additional_notes || 'Not provided'],
                    ],
                  ],
                ].map(([title, editStep, rows]) => (
                  <section className="review-group" key={String(title)}>
                    <header>
                      <h3>{String(title)}</h3>
                      <button type="button" onClick={() => setStep(Number(editStep))}>
                        <Pencil size={15} /> Edit
                      </button>
                    </header>
                    <dl>
                      {(rows as string[][]).map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
                <label className="consent-field">
                  <input type="checkbox" {...register('consent')} />
                  <span>
                    <Check size={16} />
                  </span>
                  <p>
                    I confirm that I am authorized to submit this business information and
                    understand that AI will assist with drafting content that requires human review.
                  </p>
                </label>
                {errors.consent && (
                  <p className="form-error" role="alert">
                    {errors.consent.message}
                  </p>
                )}
                <div className="security-block">
                  <Turnstile onVerify={handleTurnstile} onError={handleTurnstileError} />
                  {turnstileError && (
                    <p className="form-error" role="alert">
                      {turnstileError}
                    </p>
                  )}
                </div>
                {submitError && (
                  <div className="inline-error" role="alert">
                    {submitError}
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              {step > 0 ? (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setStep((current) => current - 1)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={18} /> Previous
                </button>
              ) : (
                <span />
              )}
              {step < steps.length - 1 ? (
                <button type="button" className="button button-primary" onClick={nextStep}>
                  Next step <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isSubmitting || submissionLock.current}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="spin" size={18} /> Submitting…
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Submit campaign brief
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
