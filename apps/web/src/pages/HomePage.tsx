import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Check,
  ClipboardCheck,
  FileText,
  Image,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const deliverables = [
  {
    icon: Target,
    title: 'Campaign strategy',
    copy: 'A clear strategic foundation tied to your offer and audience.',
  },
  {
    icon: Blocks,
    title: 'Advertising angles',
    copy: 'Distinct ways to frame the same verified business offer.',
  },
  {
    icon: MessageSquareText,
    title: 'Hooks and ad copy',
    copy: 'Platform-ready copy directions organized by angle.',
  },
  {
    icon: Image,
    title: 'Image creative directions',
    copy: 'Detailed concepts, compositions, and suggested overlays.',
  },
  {
    icon: Video,
    title: 'Short-form video concepts',
    copy: 'Hooks, scene plans, voiceover, and end-card direction.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance review',
    copy: 'Unsupported claims and policy risks flagged for a person.',
  },
  {
    icon: FileText,
    title: 'Approved campaign PDF',
    copy: 'One structured, shareable record of the approved package.',
  },
  {
    icon: ClipboardCheck,
    title: 'Production plan',
    copy: 'Organized tasks that help a creative team move forward.',
  },
];

const process = [
  ['01', 'Submit brief', 'Share the product, offer, audience, tone, and campaign goal.'],
  ['02', 'Generate structured draft', 'AI assists with strategy, copy, and creative directions.'],
  ['03', 'Review and revise', 'A human checks facts, clarity, compliance, and brand fit.'],
  ['04', 'Approve and organize', 'Approved work becomes a PDF, workspace, and production plan.'],
];

export function HomePage() {
  return (
    <>
      <Seo
        title="AdFlow Studio"
        description="Turn a business brief into a structured, human-reviewed Meta Ads campaign package."
      />
      <section className="hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="section-shell hero-grid">
          <div className="hero-copy">
            <div className="signal-pill">
              <span /> Strategy → review → production
            </div>
            <h1>Turn your business brief into a structured ad campaign.</h1>
            <p className="hero-lede">
              AdFlow Studio combines AI-assisted strategy with human review to produce ad angles,
              copy, image directions, video concepts, and organized production plans.
            </p>
            <div className="button-row">
              <Link to="/start-campaign" className="button button-primary">
                Start Your Campaign <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/example-campaign" className="button button-secondary">
                View Example Campaign
              </Link>
            </div>
            <p className="micro-proof">
              <Check size={16} aria-hidden="true" /> No automatic publishing
              <Check size={16} aria-hidden="true" /> Human approval required
            </p>
          </div>

          <div className="campaign-board" aria-label="Example campaign workflow preview">
            <div className="board-topline">
              <div>
                <span className="board-label">CAMPAIGN / 0248</span>
                <strong>FreshWeek Meals</strong>
              </div>
              <span className="status-chip">
                <span /> Human review
              </span>
            </div>
            <div className="board-progress" aria-hidden="true">
              <span className="is-done" />
              <span className="is-done" />
              <span className="is-current" />
              <span />
            </div>
            <div className="board-card board-card-featured">
              <div className="card-icon">
                <Sparkles size={17} />
              </div>
              <div>
                <span>ADVERTISING ANGLE 01</span>
                <h3>Reclaim the weekday</h3>
                <p>Position dinner as one less decision after a full workday.</p>
              </div>
            </div>
            <div className="board-columns">
              <div className="board-card compact">
                <MessageSquareText size={18} />
                <span>HOOK</span>
                <strong>“Make dinner the easy part.”</strong>
              </div>
              <div className="board-card compact visual-card">
                <div className="visual-art">
                  <span />
                  <span />
                  <span />
                </div>
                <span>IMAGE DIRECTION</span>
                <strong>Desk to dinner</strong>
              </div>
            </div>
            <div className="board-approval">
              <BadgeCheck size={20} aria-hidden="true" />
              <div>
                <strong>Review gate</strong>
                <span>Required before production planning</span>
              </div>
              <span className="review-avatars" aria-hidden="true">
                <i>AI</i>
                <i>H</i>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="process-strip" aria-label="Trusted process">
        <div className="section-shell process-strip-grid">
          {[
            'Structured intake',
            'AI-assisted generation',
            'Human approval',
            'Organized delivery',
          ].map((item, index) => (
            <div key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-light">
        <div className="section-shell">
          <div className="section-intro split-intro">
            <div>
              <p className="eyebrow">Campaign package</p>
              <h2>Everything the creative team needs to move with clarity.</h2>
            </div>
            <p>
              Each deliverable stays connected to the approved brief, so strategy, copy, visuals,
              and production direction all tell the same story.
            </p>
          </div>
          <div className="deliverables-grid">
            {deliverables.map(({ icon: Icon, title, copy }, index) => (
              <article className="deliverable-card" key={title}>
                <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="section-shell">
          <div className="section-intro split-intro light-copy">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>A clear path from business context to production direction.</h2>
            </div>
            <Link to="/how-it-works" className="text-link light-link">
              Explore the full process <ArrowRight size={17} />
            </Link>
          </div>
          <div className="process-grid">
            {process.map(([number, title, copy]) => (
              <article key={number} className="process-card">
                <span>{number}</span>
                <div className="process-dot" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="human-section">
        <div className="section-shell human-grid">
          <div className="human-visual" aria-hidden="true">
            <div className="review-window">
              <div className="review-toolbar">
                <span />
                <span />
                <span />
              </div>
              <div className="review-line wide" />
              <div className="review-line" />
              <div className="review-line short" />
              <div className="review-comment">
                <span>HM</span>
                <div>
                  <strong>Clarify offer terms</strong>
                  <i>Human review note</i>
                </div>
              </div>
              <div className="review-actions">
                <i>Request revision</i>
                <i>Approve</i>
              </div>
            </div>
          </div>
          <div className="human-copy">
            <p className="eyebrow">Human in the loop</p>
            <h2>AI accelerates the work. Humans approve the result.</h2>
            <p>
              AI helps organize the brief and draft creative directions. A person still checks the
              facts, claims, tone, and practical fit before anything moves into production planning.
            </p>
            <ul className="check-list">
              <li>
                <Check /> Fact and offer verification
              </li>
              <li>
                <Check /> Brand and compliance review
              </li>
              <li>
                <Check /> Versioned feedback and revisions
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="section-shell">
          <div className="section-intro centered-intro">
            <p className="eyebrow">Example output</p>
            <h2>One brief. Connected creative directions.</h2>
            <p>
              These fictional snippets show how campaign thinking stays organized across formats.
            </p>
          </div>
          <div className="output-grid">
            <article className="output-card angle-output">
              <div className="output-top">
                <Target />
                <span>Advertising angle</span>
                <i>01</i>
              </div>
              <h3>Reclaim the weekday</h3>
              <p>Make dinner one less decision after a full workday.</p>
              <span className="output-tag">Problem aware</span>
            </article>
            <article className="output-card copy-output">
              <div className="output-top">
                <MessageSquareText />
                <span>Ad copy</span>
                <i>AD-01</i>
              </div>
              <p className="ad-copy-preview">
                “After a full workday, planning dinner can feel like one task too many.”
              </p>
              <strong>Make dinner the easy part</strong>
            </article>
            <article className="output-card image-output">
              <div className="abstract-thumbnail">
                <span>6:12</span>
                <div />
                <i />
              </div>
              <div className="output-top">
                <Image />
                <span>Image direction</span>
                <i>4:5</i>
              </div>
              <h3>Desk to dinner</h3>
            </article>
            <article className="output-card video-output">
              <div className="video-timeline">
                <span />
                <span />
                <span />
                <Play />
              </div>
              <div className="output-top">
                <Video />
                <span>Video concept</span>
                <i>20 sec</i>
              </div>
              <h3>Close the laptop</h3>
            </article>
          </div>
          <div className="center-action">
            <Link to="/example-campaign" className="button button-secondary">
              View the fictional demonstration
            </Link>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="section-shell final-cta-inner">
          <p className="eyebrow">Start with the brief</p>
          <h2>Give your next campaign a clearer beginning.</h2>
          <p>Share the business context once. Get a structured package built for review.</p>
          <Link to="/start-campaign" className="button button-white">
            Start Your Campaign <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
