import { PageHeader } from '../components/PageHeader';
import { Seo } from '../components/Seo';

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy"
        description="AdFlow Studio privacy notice for campaign briefs, contact forms, review links, and campaign portals."
      />
      <PageHeader
        eyebrow="Legal / Privacy"
        title="Privacy notice"
        description="How campaign, contact, and review information moves through the AdFlow Studio demonstration system."
      />
      <article className="section-shell legal-content">
        <p className="legal-updated">Effective August 2, 2026</p>
        <h2>Information we collect</h2>
        <p>
          Campaign briefs can include contact details, company information, product and offer
          details, audience descriptions, brand preferences, and notes you choose to submit. Contact
          forms collect the fields displayed on the form. Review decisions collect the reviewer’s
          name, email, decision, and feedback.
        </p>
        <h2>How information is used</h2>
        <p>
          Submitted information is used to validate the brief, prepare AI-assisted campaign drafts,
          support human review, preserve version history, create approved production tasks, and
          organize delivery. AI-generated material requires human review and is not published
          automatically.
        </p>
        <h2>Systems and service providers</h2>
        <p>
          The technical workflow may process information through Cloudflare, n8n, PostgreSQL,
          Gemini, Google Drive, Gmail, and GitHub according to the configured deployment. Only
          submit information you are authorized to share. Do not submit sensitive personal data or
          confidential information that is unnecessary for the campaign.
        </p>
        <h2>Secure links and retention</h2>
        <p>
          Campaign portal and review links contain access tokens. Treat these links as confidential.
          Tokens are not stored in browser analytics or local storage by this website. Campaign and
          automation records may be retained for operational history and later archived according to
          the studio’s configured retention practices.
        </p>
        <h2>Your choices</h2>
        <p>
          You may contact the studio to ask about a submitted campaign, request corrections, or
          discuss deletion where applicable. Security and backup copies may persist temporarily
          after a deletion request.
        </p>
        <h2>Contact</h2>
        <p>
          Use the AdFlow Studio contact form for privacy questions. This fictional demonstration
          does not replace a deployment-specific legal notice prepared for a real business and
          jurisdiction.
        </p>
      </article>
    </>
  );
}

export function TermsPage() {
  return (
    <>
      <Seo
        title="Terms"
        description="AdFlow Studio service terms and AI-assisted work disclaimer."
      />
      <PageHeader
        eyebrow="Legal / Terms"
        title="Terms and AI-assisted work disclaimer"
        description="Plain-language boundaries for campaign preparation, review, and production planning."
      />
      <article className="section-shell legal-content">
        <p className="legal-updated">Effective August 2, 2026</p>
        <h2>Service scope</h2>
        <p>
          AdFlow Studio prepares structured campaign strategy, ad copy, creative directions, review
          materials, and production plans. It does not automatically publish ads, purchase media,
          access advertising budgets, or make final legal or platform-policy decisions.
        </p>
        <h2>AI-assisted drafting</h2>
        <p>
          Artificial intelligence assists with drafting and organization. AI output can be
          incomplete, incorrect, or unsuitable. Every campaign package must be reviewed by an
          authorized person before production or use.
        </p>
        <h2>No performance guarantees</h2>
        <p>
          Campaign plans and creative directions do not guarantee leads, sales, advertising
          performance, return on investment, platform approval, or business results. Advertising
          outcomes depend on many factors outside this service.
        </p>
        <h2>Your responsibilities</h2>
        <p>
          You are responsible for supplying accurate information, having authority to submit it,
          verifying offers and claims, securing required permissions, and completing legal, brand,
          and platform review before using the materials.
        </p>
        <h2>Review and approval</h2>
        <p>
          An approval records a human decision on a specific version. A later change to the offer,
          claims, product, audience, or creative may require a new review. Review links are
          confidential and should be shared only with authorized reviewers.
        </p>
        <h2>Demonstration status</h2>
        <p>
          AdFlow Studio is a fictional agency used to demonstrate a real automation architecture.
          Example campaigns and mock-mode results are demonstration data and should not be
          interpreted as client work or performance evidence.
        </p>
      </article>
    </>
  );
}
