import { createBrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "../App";

// Public pages
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import OrderPage from "../pages/books/OrderPage";
import EbookReader from "../pages/books/EbookReader";
import BookPreview from "../pages/books/BookPreview";

import BlogsPage from "../pages/blogs/BlogsPage";
import BlogDetailPage from "../pages/blogs/BlogDetailPage";

import LetterFromLangshott from "../pages/letters/letter-from-langshott";
import Contact from "../pages/contact/contact";
import DynamicPage from "../pages/Add pages/DynamicPage";

// Auth & guards
import Auth from "../components/Auth";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";

// Dashboard
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import ManageLetters from "../pages/dashboard/manageLetters/ManageLetters";
import AddBlogs from "../pages/dashboard/manageblogs/AddBlogs";
import AdminOrderPage from "../pages/dashboard/orders/AdminOrderPage";
import BillingDownload from "../pages/dashboard/billing-download/BillingDownload";
import InventoryPage from "../pages/dashboard/inventory/InventoryPage";
import CMSModule from "../pages/dashboard/CMS module/CMSModule";
import ManageReviews from "../pages/dashboard/CMS module/ManageReviews";
import TrustCertificate from "../pages/dashboard/CMS module/Certificates/TrustCertificate";

import AdminManagePages from "../pages/Add pages/AdminManagePages";
import SetupMFA from "../pages/dashboard/settings/SetupMFA";
import SalesPage from "../pages/dashboard/salesPage/SalesPage";

import UserDashboard from "../pages/dashboard/users/UserDashboard";
import PageNotFound from "./PageNotFound";
import Publications from "../pages/publications/Publications";
import ManageEvents from "../pages/dashboard/CMS module/ManageEvents";

/* ---------------- Auth0 Wrapper ---------------- */

const Auth0Wrapper = ({ children }) => (
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin + "/auth",
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "openid profile email phone",
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    {children}
  </Auth0Provider>
);

/* ---------------- Router ---------------- */

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Auth0Wrapper>
        <App />
      </Auth0Wrapper>
    ),
    children: [
      { path: "contact", element: <Contact /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "books/:slug", element: <SingleBook /> },
      { path: "books/preview/:id", element: <BookPreview /> },

      {
        path: "ebook/:id",
        element: (
          <PrivateRoute>
            <EbookReader />
          </PrivateRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "my-profile",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },

      { path: "blogs", element: <BlogsPage /> },
      { path: "blogs/:id", element: <BlogDetailPage /> },

      { path: "publications", element: <Publications /> },
      { path: "letters", element: <LetterFromLangshott /> },

      { path: "auth", element: <Auth /> },

      // ⚠️ MUST BE LAST
      { path: ":slug", element: <DynamicPage /> },
    ],
  },

  {
    path: "/Langshott-Foundation-Author-Anilkumar-Admin",
    element: <AdminLogin />,
  },

  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "manage-books", element: <ManageBooks /> },
      { path: "manage-letters", element: <ManageLetters /> },
      { path: "add-blogs", element: <AddBlogs /> },
      { path: "orders", element: <AdminOrderPage /> },
      { path: "billing-download", element: <BillingDownload /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "cms", element: <CMSModule /> },
      { path: "manage-reviews", element: <ManageReviews /> },
      { path: "certificates/trust-certificate", element: <TrustCertificate /> },
      { path: "manage-pages", element: <AdminManagePages /> },
      { path: "settings/mfa", element: <SetupMFA /> },
      { path: "sales", element: <SalesPage /> },
      { path: "manage-events", element: <ManageEvents /> },
    ],
  },

  { path: "*", element: <PageNotFound /> },
]);

export default router;
