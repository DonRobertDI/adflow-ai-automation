import { zodResolver } from '@hookform/resolvers/zod';
import { Check, LoaderCircle, Mail, Send } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageHeader } from '../components/PageHeader';
import { Seo } from '../components/Seo';
import { Turnstile } from '../components/Turnstile';
import { api } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { contactFormSchema, type ContactInput } from '../lib/schemas';

export function ContactPage() {
  const [sent, setSent] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: '',
      turnstile_token: '',
      website_confirm: '',
    },
    mode: 'onTouched',
  });

  const handleTurnstile = useCallback(
    (value: string) => {
      setTurnstileToken(value);
      setValue('turnstile_token', value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (value) {
        setTurnstileError('');
      }
    },
    [setValue],
  );

  const handleTurnstileError = useCallback(
    (message: string) => {
      setTurnstileError(message);
      setTurnstileToken('');
      setValue('turnstile_token', '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const submit = async (input: ContactInput) => {
    if (!turnstileToken) {
      setTurnstileError('Complete the security check before sending your message.');
      return;
    }

    setSubmitError('');

    try {
      const result = await api.sendContact({
        ...input,
        turnstile_token: turnstileToken,
      });

      setSent(result.message);
      reset();
      setTurnstileToken('');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Contact AdFlow Studio about a campaign brief, review, or delivery question."
      />

      <PageHeader
        eyebrow="Contact"
        title="Have a campaign question before you begin?"
        description="Share the context below. Please do not include passwords, payment details, review tokens, or unnecessary sensitive information."
      />

      <section className="section section-light">
        <div className="section-shell contact-layout">
          <aside>
            <div className="contact-icon">
              <Mail />
            </div>

            <p className="eyebrow">What to expect</p>
            <h2>A focused reply from the studio.</h2>

            <ul className="check-list">
              <li>
                <Check /> Questions about campaign scope
              </li>
              <li>
                <Check /> Help with an existing campaign reference
              </li>
              <li>
                <Check /> Delivery and review-process questions
              </li>
            </ul>

            <p className="contact-aside-note">
              Campaign performance, leads, and ROI are never guaranteed. The studio does not
              automatically publish ads.
            </p>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
            <input
              {...register('website_confirm')}
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <input type="hidden" {...register('turnstile_token')} />

            {sent ? (
              <div className="inline-success" role="status">
                <Check />
                <div>
                  <strong>Message received</strong>
                  <p>{sent}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Name</span>
                    <input {...register('name')} maxLength={150} autoComplete="name" />
                    {errors.name && <em role="alert">{errors.name.message}</em>}
                  </label>

                  <label className="form-field">
                    <span>Email</span>
                    <input
                      {...register('email')}
                      type="email"
                      maxLength={255}
                      autoComplete="email"
                    />
                    {errors.email && <em role="alert">{errors.email.message}</em>}
                  </label>

                  <label className="form-field form-field-wide">
                    <span>
                      Company <small>(optional)</small>
                    </span>
                    <input {...register('company')} maxLength={150} autoComplete="organization" />
                    {errors.company && <em role="alert">{errors.company.message}</em>}
                  </label>

                  <label className="form-field form-field-wide">
                    <span>Message</span>
                    <textarea
                      {...register('message')}
                      rows={8}
                      maxLength={3000}
                      placeholder="How can we help?"
                    />
                    {errors.message && <em role="alert">{errors.message.message}</em>}
                  </label>
                </div>

                <Turnstile onVerify={handleTurnstile} onError={handleTurnstileError} />

                {(turnstileError || errors.turnstile_token?.message) && (
                  <p className="form-error" role="alert">
                    {turnstileError || errors.turnstile_token?.message}
                  </p>
                )}

                {submitError && (
                  <div className="inline-error" role="alert">
                    {submitError}
                  </div>
                )}

                <button
                  className="button button-primary"
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send /> Send message
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}