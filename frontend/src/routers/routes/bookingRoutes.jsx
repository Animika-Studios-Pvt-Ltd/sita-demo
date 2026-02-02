import App from "../../App";
import BookingHome from "../../pages/booking/BookingHome";
import CmsPage from "../../pages/Add pages/pages/CmsPage";
import PageNotFound from "../PageNotFound";
import { Auth0Wrapper } from "../../components/Auth0Wrapper";
import BookingEvent from "../../pages/booking/BookingEvent";
import RateEvent from "../../pages/RateEvent";
import UserDashboard from "../../pages/dashboard/users/UserDashboard";
import OrderPage from "../../pages/books/OrderPage";
import PrivateRoute from "../PrivateRoute"; // ✅ REQUIRED

export const bookingRoutes = [
    {
        path: "/",
        element: (
            <Auth0Wrapper>
                <App />
            </Auth0Wrapper>
        ),
        children: [
            { index: true, element: <BookingHome /> },

            { path: "booking/:eventId", element: <BookingEvent /> },
            { path: "rate-event/:bookingId", element: <RateEvent /> },

            // ✅ MUST COME BEFORE :slug
            {
                path: "my-profile",
                element: (
                    <PrivateRoute>
                        <UserDashboard />
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

            // ⚠️ ALWAYS LAST
            { path: ":slug", element: <CmsPage /> },
        ],
    },
    { path: "*", element: <PageNotFound /> },
];
