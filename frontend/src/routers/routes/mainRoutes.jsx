// Public pages
import App from "../../App";
import CartPage from "../../pages/books/CartPage";
import CheckoutPage from "../../pages/books/CheckoutPage";
import SingleBook from "../../pages/books/SingleBook";
import OrderPage from "../../pages/books/OrderPage";
import EbookReader from "../../pages/books/EbookReader";
import BookPreview from "../../pages/books/BookPreview";
import BlogsPage from "../../pages/blogs/BlogsPage";
import BlogDetailPage from "../../pages/blogs/BlogDetailPage";
import LetterFromLangshott from "../../pages/letters/letter-from-langshott";
import Contact from "../../pages/contact/contact";
import DynamicPage from "../../pages/Add pages/DynamicPage";
import Publications from "../../pages/publications/Publications";

// Auth & guards
import Auth from "../../components/Auth";
import PrivateRoute from "../PrivateRoute";
import UserDashboard from "../../pages/dashboard/users/UserDashboard";
import PageNotFound from "../PageNotFound";
import { Auth0Provider } from "@auth0/auth0-react";

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
    { path: "*", element: <PageNotFound /> },
];
