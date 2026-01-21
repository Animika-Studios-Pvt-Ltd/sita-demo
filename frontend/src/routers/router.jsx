import { createBrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "../App";

// Public pages
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import EbookReader from "../pages/books/EbookReader";
import BookPreview from "../pages/books/BookPreview";
import OrderPage from "../pages/books/OrderPage"; // ✅ FIXED

import BlogsPage from "../pages/blogs/BlogsPage";
import BlogDetailPage from "../pages/blogs/BlogDetailPage";
import InspirationBoard from "../pages/blogs/inspirationboard/inspirationboard";
import InspirationDetailPage from "../pages/blogs/inspirationboard/InspirationDetailPage";

import Publications from "../pages/publications/Publications";
import LetterFromLangshott from "../pages/letters/letter-from-langshott";

import DynamicPage from "../pages/Add pages/DynamicPage";

// Auth
import Auth from "../components/Auth";
import AdminLogin from "../components/AdminLogin";

// Route guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Dashboard
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import ManageLetters from "../pages/dashboard/manageLetters/ManageLetters";
import AddBlogs from "../pages/dashboard/manageblogs/AddBlogs";
import AdminOrderPage from "../pages/dashboard/orders/AdminOrderPage";
import BillingDownload from "../pages/dashboard/billing-download/BillingDownload";
import InventoryPage from "../pages/dashboard/inventory/InventoryPage";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import SalesPage from "../pages/dashboard/salesPage/SalesPage";
import SetupMFA from "../pages/dashboard/settings/SetupMFA";
import AdminManagePages from "../pages/Add pages/AdminManagePages";

// Fallback
import PageNotFound from "./PageNotFound";

/* =========================
   AUTH0 WRAPPER
========================= */
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

/* =========================
   ROUTER
========================= */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Auth0Wrapper>
        <App />
      </Auth0Wrapper>
    ),
    children: [
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/books/:slug", element: <SingleBook /> },
      { path: "/books/preview/:id", element: <BookPreview /> },

      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/ebook/:id",
        element: (
          <PrivateRoute>
            <EbookReader />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-profile",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },

      { path: "/blogs", element: <BlogsPage /> },
      { path: "/blogs/:id", element: <BlogDetailPage /> },

      { path: "/inspiration-board", element: <InspirationBoard /> },
      { path: "/inspiration/:id", element: <InspirationDetailPage /> },

      { path: "/publications", element: <Publications /> },
      { path: "/letters", element: <LetterFromLangshott /> },

      { path: "/auth", element: <Auth /> },
      { path: "/:slug", element: <DynamicPage /> },
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
      { path: "", element: <Dashboard /> },
      { path: "manage-books", element: <ManageBooks /> },
      { path: "manage-letters", element: <ManageLetters /> },
      { path: "add-blogs", element: <AddBlogs /> },
      { path: "orders", element: <AdminOrderPage /> },
      { path: "billing-download", element: <BillingDownload /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "manage-pages", element: <AdminManagePages /> },
      { path: "settings/mfa", element: <SetupMFA /> },
      { path: "sales", element: <SalesPage /> },
    ],
  },

  { path: "*", element: <PageNotFound /> },
]);

/* =========================
   FORCE HARD NAVIGATION
========================= */
const originalNavigate = router.navigate;

router.navigate = (...args) => {
  const to = args[0];
  if (typeof to === "string") {
    window.location.assign(to);
  } else if (to?.pathname) {
    window.location.assign(to.pathname);
  } else {
    originalNavigate(...args);
  }
};

export default router;
