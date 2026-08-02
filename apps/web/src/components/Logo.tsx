import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="AdFlow Studio home">
      <span className="logo-mark" aria-hidden="true">
        A<span>•</span>
      </span>
      <span className="logo-type">
        AdFlow <strong>Studio</strong>
      </span>
    </Link>
  );
}
