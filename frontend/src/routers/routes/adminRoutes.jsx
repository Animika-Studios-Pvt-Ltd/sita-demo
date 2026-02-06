import AdminLogin from "../../components/AdminLogin";
import AdminRoute from "../AdminRoute";
import DashboardLayout from "../../pages/dashboard/DashboardLayout";
import Dashboard from "../../pages/dashboard/Dashboard";
import ManageBooks from "../../pages/dashboard/manageBooks/ManageBooks";
import ManageLetters from "../../pages/dashboard/manageLetters/ManageLetters";
import AddBlogs from "../../pages/dashboard/manageblogs/AddBlogs";
import AdminOrderPage from "../../pages/dashboard/orders/AdminOrderPage";
import BillingDownload from "../../pages/dashboard/billing-download/BillingDownload";
import InventoryPage from "../../pages/dashboard/inventory/InventoryPage";
import CMSModule from "../../pages/dashboard/CMS module/CMSModule";
import CmsDashboard from "../../pages/Add pages/pages/CmsDashboard";
import ManageReviews from "../../pages/dashboard/CMS module/ManageReviews";
import TrustCertificate from "../../pages/dashboard/CMS module/Certificates/TrustCertificate";
import AdminManagePages from "../../pages/Add pages/AdminManagePages";
import SetupMFA from "../../pages/dashboard/settings/SetupMFA";
import SalesPage from "../../pages/dashboard/salesPage/SalesPage";
import ManageEvents from "../../pages/dashboard/CMS module/ManageEvents";
import EventBookings from "../../pages/dashboard/CMS module/EventBookings";
import Podcasts from "../../pages/dashboard/CMS module/Podcasts";
import Articles from "../../pages/dashboard/CMS module/Articles";
import PageNotFound from "../PageNotFound";

export const adminRoutes = [
    {
        path: "/",
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
            { path: "cms/new", element: <CmsDashboard /> },
            { path: "cms/edit/:slug", element: <CmsDashboard /> },
            { path: "manage-reviews", element: <ManageReviews /> },
            { path: "certificates/trust-certificate", element: <TrustCertificate /> },
            { path: "manage-pages", element: <AdminManagePages /> },
            { path: "settings/mfa", element: <SetupMFA /> },
            { path: "sales", element: <SalesPage /> },
            { path: "manage-events", element: <ManageEvents /> },
            { path: "manage-events/:id/bookings", element: <EventBookings /> },
            { path: "podcasts", element: <Podcasts /> },
            { path: "articles", element: <Articles /> },
        ],
    },
    { path: "*", element: <PageNotFound /> },
];
