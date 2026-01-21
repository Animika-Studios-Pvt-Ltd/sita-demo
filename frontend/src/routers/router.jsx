import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import AboutAuthorPage from "../pages/AboutAuthorPage/AboutAuthorPage";
import Publications from "../pages/publications/Publications";
import LetterFromLangshott from "../pages/letters/letter-from-langshott";
import ManageLetters from "../pages/dashboard/manageLetters/ManageLetters";
import BlogsPage from "../pages/blogs/BlogsPage";
import AddBlogs from "../pages/dashboard/manageblogs/AddBlogs";
import BlogDetailPage from "../pages/blogs/BlogDetailPage";
import AdminOrderPage from "../pages/dashboard/orders/AdminOrderPage";
import BillingDownload from "../pages/dashboard/billing-download/BillingDownload";
import InventoryPage from "../pages/dashboard/inventory/InventoryPage";
import Contact from "../pages/contact/contact";
import AdminBanner from "../pages/dashboard/CMS module/AdminBanner";
import CMSModule from "../pages/dashboard/CMS module/CMSModule";
import AdminReaderThoughts from "../pages/dashboard/CMS module/AdminReaderThoughts";
import AdminAuthorEdit from "../pages/dashboard/CMS module/AdminAuthorEdit";
import InspirationBoard from "../pages/blogs/inspirationboard/inspirationboard";
import AdminCorners from "../pages/dashboard/CMS module/AdminCorners";
import SufiCornerpage from "../pages/SufiCorner/SufiCornerpage";
import Foundation from "../pages/Foundation/Foundation";
import AdminSufiCorner from "../pages/dashboard/CMS module/AdminSufiCorner";
import AdminInspirationBoard from "../pages/dashboard/manageInspiration/InspirationBoard";
import ManageReviews from "../pages/dashboard/CMS module/ManageReviews";
import InspirationDetailPage from "../pages/blogs/inspirationboard/InspirationDetailPage";
import Auth from "../components/Auth";
import Authorpage from "../pages/dashboard/CMS module/Autherpage";
import TrustCertificate from "../pages/dashboard/CMS module/Certificates/TrustCertificate";
import DynamicPage from "../pages/Add pages/DynamicPage";
import AdminManagePages from "../pages/Add pages/AdminManagePages";
import SetupMFA from "../pages/dashboard/settings/SetupMFA";
import { Auth0Provider } from "@auth0/auth0-react";
import SalesPage from "../pages/dashboard/salesPage/SalesPage";
import AdminFoundationPage from "../pages/dashboard/CMS module/AdminFoundationPage";
import EbookReader from "../pages/books/EbookReader";
import BookPreview from "../pages/books/BookPreview";
import PageNotFound from "./PageNotFound";

const Auth0Wrapper = ({ children }) => (
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin + "/auth",
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "openid profile email phone"
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    {children}
  </Auth0Provider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (<Auth0Wrapper><App /></Auth0Wrapper>),
    children: [
      { path: "/", element: <Home /> },
      { path: "/contact", element: <Contact /> },
      { path: "/inspiration-board", element: <InspirationBoard /> },
      { path: "/orders", element: (<PrivateRoute><OrderPage /></PrivateRoute>) },
      { path: "/ebook/:id", element: (<PrivateRoute><EbookReader /></PrivateRoute>) },
      { path: "/auth", element: <Auth /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/books/:slug", element: <SingleBook /> },
      { path: "/my-profile", element: (<PrivateRoute><UserDashboard /></PrivateRoute>) },
      { path: "/blogs", element: <BlogsPage /> },
      { path: "/blogs/:id", element: <BlogDetailPage /> },
      { path: "/Anilkumar", element: <AboutAuthorPage /> },
      { path: "/publications", element: <Publications /> },
      { path: "/letters", element: <LetterFromLangshott /> },
      { path: "/sufi-corner", element: <SufiCornerpage /> },
      { path: "/foundation", element: <Foundation /> },
      { path: "/inspiration/:id", element: <InspirationDetailPage /> },
      { path: "/:slug", element: <DynamicPage /> },
      { path: "/books/preview/:id", element: <BookPreview /> },
    ],
  },

  { path: "/Langshott-Foundation-Author-Anilkumar-Admin", element: <AdminLogin /> },
  { path: "/admin", element: <PageNotFound /> },
  {
    path: "/dashboard",
    element: (<AdminRoute><DashboardLayout /></AdminRoute>),
    children: [
      { path: "", element: <Dashboard /> },
      { path: "manage-books", element: <ManageBooks /> },
      { path: "manage-letters", element: <ManageLetters /> },
      { path: "add-blogs", element: <AddBlogs /> },
      { path: "orders", element: <AdminOrderPage /> },
      { path: "billing-download", element: <BillingDownload /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "cms", element: <CMSModule /> },
      { path: "admin-Banner", element: <AdminBanner /> },
      { path: "reader-thoughts", element: <AdminReaderThoughts /> },
      { path: "edit-author", element: <AdminAuthorEdit /> },
      { path: "admin-corners", element: <AdminCorners /> },
      { path: "admin-sufi-corner", element: <AdminSufiCorner /> },
      { path: "manage-inspiration", element: <AdminInspirationBoard /> },
      { path: "manage-reviews", element: <ManageReviews /> },
      { path: "author-page", element: <Authorpage /> },
      { path: "certificates/trust-certificate", element: <TrustCertificate /> },
      { path: "manage-pages", element: <AdminManagePages /> },
      { path: "settings/mfa", element: <SetupMFA /> },
      { path: "sales", element: <SalesPage /> },
      { path: "admin-Foundation", element: <AdminFoundationPage /> },
    ],
  },

  { path: "*", element: <PageNotFound /> },
]);

const originalNavigate = router.navigate;
router.navigate = (...args) => {
  const to = args[0];
  if (typeof to === "string") {
    window.location.assign(to);
  } else if (to && to.pathname) {
    window.location.assign(to.pathname);
  } else {
    originalNavigate(...args);
  }
};

export default router;