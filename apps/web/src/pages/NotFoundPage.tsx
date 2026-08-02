import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <div className="not-found section-shell">
      <Seo
        title="Page not found"
        description="The requested AdFlow Studio page could not be found."
        noIndex
      />
      <div className="not-found-code">
        4<Compass aria-hidden="true" />4
      </div>
      <p className="eyebrow">Page not found</p>
      <h1>This route isn’t part of the campaign plan.</h1>
      <p>The page may have moved, or the link may be incomplete.</p>
      <Link to="/" className="button button-primary">
        <ArrowLeft size={18} /> Return home
      </Link>
    </div>
  );
}
