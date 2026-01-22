import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BookingHome = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await fetch(`${API_URL}/api/pages`);
                const data = await res.json();
                // Filter for pages designated for booking subdomain
                const bookingPages = data.filter(
                    (p) =>
                        p.displayLocations &&
                        p.displayLocations.includes("booking") &&
                        !p.suspended
                );
                setPages(bookingPages);
            } catch (err) {
                console.error("Failed to fetch pages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-playfair text-center mb-12">Events & Workshops</h1>

            {pages.length === 0 ? (
                <div className="text-center text-gray-500 text-xl">
                    No upcoming events or workshops at the moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pages.map((page) => (
                        <div key={page._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
                            {page.bannerImage && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={page.bannerImage.src}
                                        alt={page.bannerImage.alt || page.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-3 font-playfair">{page.title}</h2>
                                {page.metaDescription && (
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {page.metaDescription}
                                    </p>
                                )}
                                <Link
                                    to={`/${page.slug}`}
                                    className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHome;
