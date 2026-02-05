// Public pages
import App from "../../App";
import DynamicPage from "../../pages/Add pages/DynamicPage";
import Publications from "../../pages/publications/Publications";
import EventList from "../../pages/events/EventList";
import EventDetail from "../../pages/events/EventDetail";
import CartPage from "../../pages/books/CartPage"; // Kept for main domain fallback/access if desired, or remove if strict separation

// Auth & guards
import Auth from "../../components/Auth";
import PrivateRoute from "../PrivateRoute";
import UserDashboard from "../../pages/dashboard/users/UserDashboard";
import PageNotFound from "../PageNotFound";
import { Auth0Wrapper } from "../../components/Auth0Wrapper";
import HomePage from "../../pages/homepage/Homepage";
import About from "../../pages/about/About";
import AyurvedaNutrition from "../../pages/services/Ayurveda-Nutrition";
import KoshaCounseling from "../../pages/services/Kosha-Counseling";
import ReleaseKarmicPatterns from "../../pages/services/Release-Karmic-Patterns";
import SoulCurriculum from "../../pages/services/Soul-Curriculum";
import YogaTherapy from "../../pages/services/Yoga-Therapy";
import CorporateTraining from "../../pages/workshops/Corporate-Training";
import GroupSessions from "../../pages/workshops/Group-Sessions";
import PrivateSessions from "../../pages/workshops/Private-Sessions";
import ShakthiLeadership from "../../pages/workshops/Shakthi-Leadership";
import TeacherTraining from "../../pages/workshops/Teacher-Training";
import Articles from "../../pages/resources/Articles";
import Podcasts from "../../pages/resources/Podcasts";
import PrivacyPolicy from "../../pages/privacy and disclaimer/PrivacyPolicy";
import Disclaimer from "../../pages/privacy and disclaimer/Disclaimer";
import Contact from "../../pages/contact/Contact";
import ConsultSita from "../../pages/sita factor/ConsultSita";
import EngageSita from "../../pages/sita factor/EngageSita";
import StudyWithSita from "../../pages/sita factor/StudyWithSita";

export const mainRoutes = [
  {
    path: "/",
    element: (
      <Auth0Wrapper>
        <App />
      </Auth0Wrapper>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <About /> },
      { path: "/ayurveda-nutrition", element: <AyurvedaNutrition /> },
      { path: "/kosha-counseling", element: <KoshaCounseling /> },
      { path: "/release-karmic-patterns", element: <ReleaseKarmicPatterns /> },
      { path: "/soul-curriculum", element: <SoulCurriculum /> },
      { path: "/yoga-therapy", element: <YogaTherapy /> },
      { path: "/corporate-training", element: <CorporateTraining /> },
      { path: "/group-sessions", element: <GroupSessions /> },
      { path: "/private-sessions", element: <PrivateSessions /> },
      { path: "/shakthi-leadership", element: <ShakthiLeadership /> },
      { path: "/teacher-training", element: <TeacherTraining /> },
      { path: "/articles", element: <Articles /> },
      { path: "/podcasts", element: <Podcasts /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/disclaimer", element: <Disclaimer /> },
      { path: "/contact", element: <Contact /> },
      { path: "/consult-sita", element: <ConsultSita /> },
      { path: "/engage-sita", element: <EngageSita /> },
      { path: "/styudy-with-sita", element: <StudyWithSita /> },

      // If we want it on Main domain too as "Publications" page:
      { path: "publications", element: <Publications /> },

      { path: "events", element: <EventList /> },
      { path: "events/:id", element: <EventDetail /> },

      {
        path: "my-profile",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },

      { path: "auth", element: <Auth /> },

      // ⚠️ MUST BE LAST
      { path: ":slug", element: <DynamicPage /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
];
