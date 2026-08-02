import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  noIndex?: boolean;
}

function setMeta(selector: string, attribute: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo({ title, description, noIndex = false }: SeoProps) {
  useEffect(() => {
    const fullTitle = title === 'AdFlow Studio' ? title : `${title} · AdFlow Studio`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex ? 'noindex, nofollow, noarchive' : 'index, follow',
    );
  }, [description, noIndex, title]);

  return null;
}
