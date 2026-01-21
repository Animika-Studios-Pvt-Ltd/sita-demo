// Public pages
import App from "../../App";
import LetterFromLangshott from "../../pages/letters/letter-from-langshott";
import Contact from "../../pages/contact/contact";
import DynamicPage from "../../pages/Add pages/DynamicPage";
import Publications from "../../pages/publications/Publications";
import CartPage from "../../pages/books/CartPage"; // Kept for main domain fallback/access if desired, or remove if strict separation
// Actually, strict separation is better. Removing Cart/Checkout from Main. 
// Re-importing only what is strictly Main.

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
            { path: "contact", element: <Contact /> },

            // Removed Store Routes: cart, checkout, books, orders, ebook, preview
            // They are now in storeRoutes.jsx

            // Publications is effectively "The Store" listing. 
            // If we want it on Main domain too as "Publications" page:
            { path: "publications", element: <Publications /> },

            { path: "letters", element: <LetterFromLangshott /> },

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
