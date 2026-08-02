import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const navigation = [
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/example-campaign', label: 'Example' },
  { to: '/contact', label: 'Contact' },
];

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="site-frame">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-shell">
          <Logo />
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav
            id="primary-navigation"
            aria-label="Primary navigation"
            className={menuOpen ? 'primary-nav is-open' : 'primary-nav'}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/start-campaign" className="button button-primary button-small">
              Start a campaign
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-shell">
          <div>
            <Logo />
            <p className="footer-tagline">
              AI-assisted ad strategy. Human-reviewed creative production.
            </p>
          </div>
          <div className="footer-links" aria-label="Footer navigation">
            <Link to="/services">Services</Link>
            <Link to="/how-it-works">Process</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-note">
            <p>AdFlow Studio prepares and organizes ad materials.</p>
            <p>No automatic publishing or media spend.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AdFlow Studio</span>
          <span>Fictional agency. Real automation architecture.</span>
        </div>
      </footer>
    </div>
  );
}
