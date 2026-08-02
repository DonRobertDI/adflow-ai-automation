import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileInput,
  FileOutput,
  FolderKanban,
  ScanSearch,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Seo } from '../components/Seo';

const steps = [
  {
    icon: FileInput,
    title: 'Campaign brief',
    owner: 'Person',
    copy: 'A client supplies the offer, audience, brand preferences, product facts, and restrictions.',
  },
  {
    icon: ScanSearch,
    title: 'Validation',
    owner: 'Automated',
    copy: 'The system normalizes fields, checks allowed values, and rejects incomplete or malformed inputs.',
  },
  {
    icon: Bot,
    title: 'AI-assisted generation',
    owner: 'Automated',
    copy: 'Gemini drafts a structured campaign package using only the submitted business context.',
  },
  {
    icon: UserCheck,
    title: 'Human review',
    owner: 'Person',
    copy: 'A reviewer checks factual accuracy, claims, brand fit, compliance risks, and creative quality.',
  },
  {
    icon: Wrench,
    title: 'Revision loop',
    owner: 'Shared',
    copy: 'Clear feedback can trigger a new version while preserving the complete review history.',
  },
  {
    icon: CheckCircle2,
    title: 'Approval',
    owner: 'Person',
    copy: 'A named reviewer explicitly approves, requests revision, or closes the package.',
  },
  {
    icon: FolderKanban,
    title: 'Production task creation',
    owner: 'Automated',
    copy: 'Approved ads, images, videos, and quality checks become organized internal tasks.',
  },
  {
    icon: FileOutput,
    title: 'PDF and workspace delivery',
    owner: 'Automated',
    copy: 'The system assembles an approved package and shared workspace for the production team.',
  },
];

export function ProcessPage() {
  return (
    <>
      <Seo
        title="How it works"
        description="See the automated and human steps behind every AdFlow Studio campaign package."
      />
      <PageHeader
        eyebrow="The AdFlow process"
        title="Automation where it helps. Human judgment where it matters."
        description="Every campaign moves through clear gates. Automated steps create structure and consistency; people provide business context, judgment, and final approval."
      />
      <section className="section section-light">
        <div className="section-shell timeline-layout">
          <aside className="timeline-legend">
            <p className="eyebrow">Responsibility</p>
            <div>
              <span className="owner-dot automated" /> Automated system
            </div>
            <div>
              <span className="owner-dot person" /> Person required
            </div>
            <div>
              <span className="owner-dot shared" /> Shared step
            </div>
          </aside>
          <ol className="detailed-timeline">
            {steps.map(({ icon: Icon, title, owner, copy }, index) => (
              <li key={title}>
                <span className="timeline-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="timeline-node">
                  <Icon aria-hidden="true" />
                </div>
                <article>
                  <div className="timeline-title-row">
                    <h2>{title}</h2>
                    <span className={`owner-chip ${owner.toLowerCase()}`}>{owner}</span>
                  </div>
                  <p>{copy}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="process-cta">
        <div className="section-shell process-cta-inner">
          <div>
            <p className="eyebrow">Your first step</p>
            <h2>Start with accurate business context.</h2>
          </div>
          <p>The better the brief, the stronger the material a human reviewer has to work with.</p>
          <Link to="/start-campaign" className="button button-white">
            Open the campaign brief <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
