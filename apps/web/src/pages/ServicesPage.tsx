import {
  ArrowRight,
  Check,
  CircleOff,
  ClipboardList,
  FileCheck2,
  Image,
  MessagesSquare,
  Target,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Seo } from '../components/Seo';

const services = [
  {
    icon: Target,
    title: 'Campaign strategy',
    text: 'A structured campaign summary, audience framing, customer problem, desired outcome, and offer positioning grounded in the submitted brief.',
  },
  {
    icon: MessagesSquare,
    title: 'Meta Ads copy',
    text: 'Distinct advertising angles, hooks, primary text, headlines, descriptions, and calls to action organized for review.',
  },
  {
    icon: Image,
    title: 'Static creative directions',
    text: 'Concept names, visual compositions, generation prompts, and optional overlay copy for a production designer.',
  },
  {
    icon: Video,
    title: 'Short-form video concepts',
    text: 'Opening hooks, scene plans, voiceover scripts, target durations, and end-card wording for vertical placements.',
  },
  {
    icon: FileCheck2,
    title: 'Human revisions',
    text: 'Review decisions, clear feedback, and versioned revision loops preserve the history behind the approved package.',
  },
  {
    icon: ClipboardList,
    title: 'Delivery and organization',
    text: 'An approved campaign PDF, shared workspace, and structured production tasks keep the next phase easy to follow.',
  },
];

export function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description="Structured Meta Ads strategy, copy, creative directions, human review, and production planning."
      />
      <PageHeader
        eyebrow="Services & deliverables"
        title="Campaign thinking your creative team can actually use."
        description="AdFlow Studio turns business context into a connected advertising package—then puts a person between the draft and production planning."
      >
        <Link to="/start-campaign" className="button button-primary">
          Start a campaign <ArrowRight size={18} />
        </Link>
      </PageHeader>
      <section className="section section-light">
        <div className="section-shell service-list">
          {services.map(({ icon: Icon, title, text }, index) => (
            <article className="service-row" key={title}>
              <span className="service-index">0{index + 1}</span>
              <div className="service-icon">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="scope-section">
        <div className="section-shell scope-grid">
          <div>
            <p className="eyebrow">Clear scope</p>
            <h2>Prepared for production. Never published automatically.</h2>
          </div>
          <div className="scope-card included">
            <h3>
              <Check aria-hidden="true" /> What the service does
            </h3>
            <ul>
              <li>Structures campaign strategy and creative directions</li>
              <li>Supports fact, tone, and compliance review</li>
              <li>Organizes approved work into delivery materials</li>
            </ul>
          </div>
          <div className="scope-card excluded">
            <h3>
              <CircleOff aria-hidden="true" /> What it does not do
            </h3>
            <ul>
              <li>Automatically publish or launch advertisements</li>
              <li>Spend or manage advertising budget</li>
              <li>Guarantee leads, performance, or return on investment</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
