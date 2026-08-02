import { ShieldCheck } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { isMockMode } from '../lib/api';

declare global {
  interface Window {
    turnstile?: {
      render: (
        target: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
          theme: 'light';
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: (message: string) => void;
}

const scriptId = 'cloudflare-turnstile-script';

export function Turnstile({ onVerify, onError }: TurnstileProps) {
  const generatedId = useId().replaceAll(':', '');
  const containerId = `turnstile-${generatedId}`;
  const widgetId = useRef<string | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (isMockMode) {
      onVerify('mock-turnstile-token');
      return;
    }

    if (!siteKey || siteKey === 'replace_me') {
      onError?.('The security check is not configured. Please contact the studio.');
      return;
    }

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(`#${containerId}`, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': () => onVerify(''),
        'error-callback': () => onError?.('The security check could not load. Please try again.'),
        theme: 'light',
      });
    };

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.turnstile) renderWidget();
      else existingScript.addEventListener('load', renderWidget, { once: true });
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', renderWidget, { once: true });
      script.addEventListener(
        'error',
        () => onError?.('The security check could not load. Please refresh the page.'),
        { once: true },
      );
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [containerId, onError, onVerify, siteKey]);

  if (isMockMode) {
    return (
      <div className="turnstile-demo" role="status">
        <ShieldCheck aria-hidden="true" /> Demonstration security check enabled
      </div>
    );
  }

  return <div id={containerId} className="turnstile-container" aria-label="Security check" />;
}
