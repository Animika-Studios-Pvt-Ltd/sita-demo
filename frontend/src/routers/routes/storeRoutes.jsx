import { Navigate } from "react-router-dom";
import App from "../../App";
import Publications from "../../pages/publications/Publications";
import SingleBook from "../../pages/books/SingleBook";
import CartPage from "../../pages/books/CartPage";
import CheckoutPage from "../../pages/books/CheckoutPage";
import OrderPage from "../../pages/books/OrderPage";
import EbookReader from "../../pages/books/EbookReader";
import BookPreview from "../../pages/books/BookPreview";
import PageNotFound from "../PageNotFound";
import { Auth0Wrapper } from "../../components/Auth0Wrapper";
import PrivateRoute from "../PrivateRoute";

export const storeRoutes = [
    {
        path: "/",
        element: (
            <Auth0Wrapper>
                <App />
            </Auth0Wrapper>
        ),
        children: [
            { index: true, element: <Publications /> }, // Default to publications (all books)

            { path: "books/:slug", element: <SingleBook /> },
            { path: "cart", element: <CartPage /> },
            { path: "checkout", element: <CheckoutPage /> },
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
        ],
    },
    { path: "*", element: <PageNotFound /> },
];
