import React from "react";
import { Navigate } from "react-router-dom";
import App from "../../App";
import DynamicPage from "../../pages/Add pages/DynamicPage";
import Publications from "../../pages/publications/Publications";
import EventList from "../../pages/events/EventList";
import EventDetail from "../../pages/events/EventDetail";
import CartPage from "../../pages/books/CartPage";

// Auth & guards
import Auth from "../../components/Auth";
import PrivateRoute from "../PrivateRoute";
import UserDashboard from "../../pages/dashboard/users/UserDashboard";
import PageNotFound from "../PageNotFound";
import { Auth0Wrapper } from "../../components/Auth0Wrapper";
import ErrorBoundary from "../../components/ErrorBoundary"; // Import ErrorBoundary
import HomePage from "../../pages/homepage/Homepage";
import About from "../../pages/about/About";
import AyurvedaNutrition from "../../pages/services/Ayurveda-Nutrition";
import KoshaCounselling from "../../pages/services/Kosha-Counselling";
import ReleaseKarmicPatterns from "../../pages/services/Release-Karmic-Patterns";
import SoulCurriculum from "../../pages/services/Soul-Curriculum";
import YogaTherapy from "../../pages/services/Yoga-Therapy";
import CorporateTraining from "../../pages/workshops/Corporate-Training";
import GroupSessions from "../../pages/workshops/Group-Sessions";
import PrivateSessions from "../../pages/workshops/Private-Sessions";
import ShakthiLeadership from "../../pages/workshops/Shakthi-Leadership";
import TeacherTraining from "../../pages/workshops/Teacher-Training";
import PodcastsPage from "../../pages/podcast/PodcastsPage"; // NEW
import PrivacyPolicy from "../../pages/privacy and disclaimer/PrivacyPolicy";
import Disclaimer from "../../pages/privacy and disclaimer/Disclaimer";
import Contact from "../../pages/contact/Contact";
import ConsultSita from "../../pages/sita factor/ConsultSita";
import EngageSita from "../../pages/sita factor/EngageSita";
import StudyWithSita from "../../pages/sita factor/StudyWithSita";

// Blog Imports
import BlogsPage from "../../pages/blogs/BlogsPage";
import BlogDetailPage from "../../pages/blogs/BlogDetailPage";
import ArticlesPage from "../../pages/articles/ArticlesPage";
import ArticleDetailPage from "../../pages/articles/ArticleDetailPage";

// Store Imports
import SingleBook from "../../pages/books/SingleBook";
import CheckoutPage from "../../pages/books/CheckoutPage";
import OrderPage from "../../pages/books/OrderPage";
import EbookReader from "../../pages/books/EbookReader";
import BookPreview from "../../pages/books/BookPreview";

// Booking Imports
import BookingHome from "../../pages/booking/BookingHome";
import BookingEvent from "../../pages/booking/BookingEvent";
import MyBookings from "../../pages/booking/MyBookings";
import RateEvent from "../../pages/RateEvent";
import CmsPage from "../../pages/Add pages/pages/CmsPage";

export const mainRoutes = [
  {
    path: "/",
    element: (
      <Auth0Wrapper>
        <App />
      </Auth0Wrapper>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <About /> },
      { path: "/ayurveda-nutrition", element: <AyurvedaNutrition /> },
      { path: "/kosha-counselling", element: <KoshaCounselling /> },
      { path: "/release-karmic-patterns", element: <ReleaseKarmicPatterns /> },
      { path: "/soul-curriculum", element: <SoulCurriculum /> },
      { path: "/yoga-therapy", element: <YogaTherapy /> },
      { path: "/corporate-training", element: <CorporateTraining /> },
      { path: "/group-sessions", element: <GroupSessions /> },
      { path: "/private-sessions", element: <PrivateSessions /> },
      { path: "/shakthi-leadership", element: <ShakthiLeadership /> },
      { path: "/teacher-training", element: <TeacherTraining /> },
      // { path: "/articles", element: <Articles /> }, // Commented out to use new ArticlesPage
      { path: "/podcasts", element: <PodcastsPage /> }, // Updated
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/disclaimer", element: <Disclaimer /> },
      { path: "/contact", element: <Contact /> },
      { path: "/consult-sita", element: <ConsultSita /> },
      { path: "/engage-sita", element: <EngageSita /> },
      { path: "/study-with-sita", element: <StudyWithSita /> },

      // Publications / Store (Consolidated)
      { path: "publications", element: <Publications /> },
      { path: "store", element: <Publications /> }, // Alias
      { path: "books/:slug", element: <SingleBook /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "books/preview/:id", element: <BookPreview /> },

      // Protected Store Routes
      {
        path: "ebook/:id",
        element: (
          <PrivateRoute>
            <EbookReader />
          </PrivateRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },

      // Blog Routes
      { path: "blogs", element: <BlogsPage /> },
      { path: "blogs/:id", element: <BlogDetailPage /> },

      // Article Routes
      { path: "articles", element: <ArticlesPage /> },
      { path: "articles/:slug", element: <ArticleDetailPage /> },

      // Booking / Calendar Routes

      { path: "booking", element: <BookingHome /> }, // Alias
      { path: "booking/:slug", element: <CmsPage /> },
      { path: "my-bookings", element: <MyBookings /> },
      { path: "rate-event/:bookingId", element: <RateEvent /> },

      // Events (Redirect to Booking)
      { path: "events", element: <Navigate to="/booking" replace /> },
      { path: "booking/:id", element: <EventDetail /> },

      // User Dashboard
      {
        path: "my-profile",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },

      { path: "auth", element: <Auth /> },
      { path: ":slug", element: <CmsPage /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
];
