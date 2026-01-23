import App from "../../App";
import BookingHome from "../../pages/booking/BookingHome";
import CmsPage from "../../pages/Add pages/pages/CmsPage"; // Reusing CmsPage
import PageNotFound from "../PageNotFound";
import { Auth0Wrapper } from "../../components/Auth0Wrapper";
import BookingEvent from "../../pages/booking/BookingEvent";

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
            { path: ":slug", element: <CmsPage /> } // Use CmsPage for viewing
        ]
    },
    { path: "*", element: <PageNotFound /> }
];
