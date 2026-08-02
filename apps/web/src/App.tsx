import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProcessPage } from './pages/ProcessPage';
import { ExampleCampaignPage } from './pages/ExampleCampaignPage';
import { StartCampaignPage } from './pages/StartCampaignPage';
import { CampaignStatusPage } from './pages/CampaignStatusPage';
import { ReviewPage } from './pages/ReviewPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="how-it-works" element={<ProcessPage />} />
        <Route path="example-campaign" element={<ExampleCampaignPage />} />
        <Route path="start-campaign" element={<StartCampaignPage />} />
        <Route path="campaign/:campaignCode" element={<CampaignStatusPage />} />
        <Route path="review/:token" element={<ReviewPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
