import { createBrowserRouter, RouteObject } from 'react-router-dom'

// Pages
import HomePage from '../pages/HomePage'
import ForChurchesPage from '../pages/ForChurchesPage'
import PricingPage from '../pages/PricingPage'
import ChurchOnboardingPage from '../pages/ChurchOnboardingPage'
import MediaTeamSetupPage from '../pages/MediaTeamSetupPage'
import TrainingSupportPage from '../pages/TrainingSupportPage'
import DocumentationPage from '../pages/DocumentationPage'
import AboutUsPage from '../pages/AboutUsPage'
import OurMissionPage from '../pages/OurMissionPage'
import ContactPage from '../pages/ContactPage'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'
import TermsOfServicePage from '../pages/TermsOfServicePage'
import CookiePolicyPage from '../pages/CookiePolicyPage'
import NotFoundPage from '../pages/NotFoundPage'

const routeConfig: RouteObject[] = [
  { path: '/', Component: HomePage },
  { path: '/for-churches', Component: ForChurchesPage },
  { path: '/pricing', Component: PricingPage },
  { path: '/church-onboarding', Component: ChurchOnboardingPage },
  { path: '/media-team-setup', Component: MediaTeamSetupPage },
  { path: '/training-support', Component: TrainingSupportPage },
  { path: '/documentation', Component: DocumentationPage },
  { path: '/about', Component: AboutUsPage },
  { path: '/our-mission', Component: OurMissionPage },
  { path: '/contact', Component: ContactPage },
  { path: '/privacy-policy', Component: PrivacyPolicyPage },
  { path: '/terms-of-service', Component: TermsOfServicePage },
  { path: '/cookie-policy', Component: CookiePolicyPage },
  { path: '*', Component: NotFoundPage },
]

export const router = createBrowserRouter(routeConfig)

export default router
