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

export const mainRoutes = [
    {
        path: "/",
        element: (
            <Auth0Wrapper>
                <App />
            </Auth0Wrapper>
        ),
        children: [

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
