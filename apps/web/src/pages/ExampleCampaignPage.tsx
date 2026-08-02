import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  Image,
  Play,
  Target,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Seo } from '../components/Seo';
import { mockCampaignReview } from '../mocks/fixtures';

export function ExampleCampaignPage() {
  const { campaign, content } = mockCampaignReview;
  const sampleAd = content.ads[0];
  const image = content.image_prompts[0];
  const video = content.video_concepts[0];

  return (
    <>
      <Seo
        title="Example campaign"
        description="Explore a clearly labeled fictional AdFlow Studio campaign package."
      />
      <div className="demo-banner">
        <span>Fictional demonstration</span> No real company or campaign results are represented.
      </div>
      <PageHeader
        eyebrow="Example campaign / FreshWeek Meals"
        title="A clearer week starts with one less dinner decision."
        description="See how one fictional brief becomes connected strategy, copy, image direction, video concepts, and a review-ready campaign package."
      >
        <div className="brief-facts">
          <div>
            <span>Offer</span>
            <strong>15% off the first weekly meal order</strong>
          </div>
          <div>
            <span>Audience</span>
            <strong>Busy professionals</strong>
          </div>
          <div>
            <span>Objective</span>
            <strong>{campaign.objective}</strong>
          </div>
        </div>
      </PageHeader>
      <section className="section section-light">
        <div className="section-shell example-layout">
          <aside className="example-index">
            <p className="eyebrow">Package index</p>
            <a href="#summary">01 · Summary</a>
            <a href="#angles">02 · Angles</a>
            <a href="#hooks">03 · Hooks</a>
            <a href="#sample-ad">04 · Sample ad</a>
            <a href="#creative">05 · Creative directions</a>
            <a href="#compliance">06 · Compliance</a>
            <a href="#pdf-preview">07 · PDF preview</a>
          </aside>
          <div className="example-content">
            <section id="summary" className="example-section">
              <div className="example-section-heading">
                <span>01</span>
                <div>
                  <p className="eyebrow">Campaign summary</p>
                  <h2>The strategic throughline</h2>
                </div>
              </div>
              <p className="large-copy">{content.campaign_summary}</p>
              <div className="foundation-grid">
                {Object.entries(content.strategic_foundation).map(([key, value]) => (
                  <div key={key}>
                    <span>{key.replaceAll('_', ' ')}</span>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="angles" className="example-section">
              <div className="example-section-heading">
                <span>02</span>
                <div>
                  <p className="eyebrow">Advertising angles</p>
                  <h2>Three distinct ways into the offer</h2>
                </div>
              </div>
              <div className="angle-list">
                {content.ad_angles.map((angle) => (
                  <article key={angle.angle_id}>
                    <div>
                      <Target />
                      <span>{angle.angle_id}</span>
                    </div>
                    <h3>{angle.name}</h3>
                    <p>{angle.rationale}</p>
                    <strong>{angle.core_message}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section id="hooks" className="example-section">
              <div className="example-section-heading">
                <span>03</span>
                <div>
                  <p className="eyebrow">Hooks</p>
                  <h2>Short openings, organized by angle</h2>
                </div>
              </div>
              <div className="hook-wall">
                {content.hooks.map((hook) => (
                  <blockquote key={hook.hook_id}>
                    <span>{hook.hook_id}</span>“{hook.hook_text}”
                  </blockquote>
                ))}
              </div>
            </section>

            <section id="sample-ad" className="example-section">
              <div className="example-section-heading">
                <span>04</span>
                <div>
                  <p className="eyebrow">Sample ad</p>
                  <h2>A review-ready copy unit</h2>
                </div>
              </div>
              <div className="sample-ad-card">
                <div className="sample-ad-meta">
                  <span>{sampleAd.ad_id}</span>
                  <span>{sampleAd.angle_id}</span>
                </div>
                <p>{sampleAd.primary_text}</p>
                <div>
                  <strong>{sampleAd.headline}</strong>
                  <span>{sampleAd.description}</span>
                </div>
                <button type="button" tabIndex={-1}>
                  {sampleAd.call_to_action}
                </button>
              </div>
            </section>

            <section id="creative" className="example-section">
              <div className="example-section-heading">
                <span>05</span>
                <div>
                  <p className="eyebrow">Creative directions</p>
                  <h2>From message to execution</h2>
                </div>
              </div>
              <div className="creative-direction-grid">
                <article>
                  <div className="direction-art">
                    <div className="art-laptop" />
                    <div className="art-plate" />
                    <span>{image.overlay_text}</span>
                  </div>
                  <div className="direction-copy">
                    <span>
                      <Image /> Image direction · {image.prompt_id}
                    </span>
                    <h3>{image.concept_name}</h3>
                    <p>{image.prompt}</p>
                  </div>
                </article>
                <article>
                  <div className="direction-art video-art">
                    <div className="play-button">
                      <Play />
                    </div>
                    <span>{video.opening_hook}</span>
                  </div>
                  <div className="direction-copy">
                    <span>
                      <Video /> Video concept · {video.duration_seconds}s
                    </span>
                    <h3>{video.concept_name}</h3>
                    <ol>
                      {video.scene_plan.map((scene) => (
                        <li key={scene}>{scene}</li>
                      ))}
                    </ol>
                  </div>
                </article>
              </div>
            </section>

            <section id="compliance" className="example-section">
              <div className="example-section-heading">
                <span>06</span>
                <div>
                  <p className="eyebrow">Compliance warning</p>
                  <h2>Items a person must verify</h2>
                </div>
              </div>
              <div className="warning-panel">
                <AlertTriangle />
                <div>
                  <h3>Human confirmation required</h3>
                  <ul>
                    {content.compliance_review.notes_for_human_reviewer.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section id="pdf-preview" className="example-section">
              <div className="example-section-heading">
                <span>07</span>
                <div>
                  <p className="eyebrow">PDF-style preview</p>
                  <h2>One approved campaign record</h2>
                </div>
              </div>
              <div className="pdf-frame">
                <div className="pdf-paper">
                  <header>
                    <span>ADFLOW STUDIO</span>
                    <i>FICTIONAL DEMONSTRATION</i>
                  </header>
                  <p>CAMPAIGN PACKAGE / VERSION 02</p>
                  <h3>FreshWeek Meals</h3>
                  <div className="pdf-rule" />
                  <div className="pdf-columns">
                    <div>
                      <span>OBJECTIVE</span>
                      <strong>Sales</strong>
                    </div>
                    <div>
                      <span>OFFER</span>
                      <strong>15% off first weekly order</strong>
                    </div>
                  </div>
                  <h4>Campaign strategy</h4>
                  <p>{content.campaign_summary}</p>
                  <h4>Approved creative units</h4>
                  <ul>
                    <li>
                      <Check /> 3 advertising angles
                    </li>
                    <li>
                      <Check /> 8 hooks and 3 ads
                    </li>
                    <li>
                      <Check /> 3 image directions and 2 videos
                    </li>
                  </ul>
                  <footer>
                    <FileText /> Prepared for human-reviewed production planning
                  </footer>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <section className="final-cta compact-cta">
        <div className="section-shell final-cta-inner">
          <p className="eyebrow">Your campaign</p>
          <h2>Ready to structure the real brief?</h2>
          <Link to="/start-campaign" className="button button-white">
            Start Your Campaign <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
