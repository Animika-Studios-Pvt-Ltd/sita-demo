import { Navigate } from "react-router-dom";
import App from "../../App";
import BlogsPage from "../../pages/blogs/BlogsPage";
import BlogDetailPage from "../../pages/blogs/BlogDetailPage";
import PageNotFound from "../PageNotFound";
import { Auth0Wrapper } from "../../components/Auth0Wrapper";

export const blogRoutes = [
    {
        path: "/",
        element: (
            <Auth0Wrapper>
                <App />
            </Auth0Wrapper>
        ),
        children: [
            // Redirect root to /blogs so that internal links (which use /blogs) still work naturally
            // or we can serve BlogsPage at / and also at /blogs.
            // Serving at both is safer for existing links in Navbar.
            { index: true, element: <BlogsPage /> },
            { path: "blogs", element: <BlogsPage /> },
            { path: "blogs/:id", element: <BlogDetailPage /> },

            // Keep other essential routes if needed? 
            // For now, only blog routes are exposed here. 
            // User might want to go back to "Home" (main domain). 
            // Cross-domain navigation is handled by full URL links in Navbar, 
            // or checking window.location inside Navbar.
        ],
    },
    { path: "*", element: <PageNotFound /> },
];
