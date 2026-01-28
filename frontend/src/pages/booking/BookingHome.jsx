import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppUrl } from "../../utils/subdomain";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= CATEGORY IMAGE SET ================= */
const categoryImages = {
    "Yoga Therapy": [
        "https://images.unsplash.com/photo-1552058544-f2b08422138a",
        "https://images.unsplash.com/photo-1593810451137-5dc55105dace",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    ],
    "Ayurveda – Nutrition & Integration": [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
        "https://images.unsplash.com/photo-1604908177522-040c8b7e16ad",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    ],
    "Kosha Counseling": [
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    ],
    "Soul Curriculum": [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
        "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
    ],
    "Release Karmic Patterns": [
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
        "https://images.unsplash.com/photo-1494173853739-c21f58b16055",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    ],
    "Others": [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        "https://images.unsplash.com/photo-1515169067865-5387ec356754",
        "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    ],
};

/* ================= PER-CATEGORY IMAGE ROTATION ================= */
const categoryCounters = {};

const getCategoryImage = (category) => {
    const images = categoryImages[category] || categoryImages["Others"];

    if (!categoryCounters[category]) {
        categoryCounters[category] = 0;
    }

    const image = images[categoryCounters[category] % images.length];
    categoryCounters[category]++;

    return image;
};

/* ================= TIME FORMAT ================= */
const formatTimeRange = (start, end) => {
    if (!start || !end) return "TBA";

    const format = (time) => {
        const [h, m] = time.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${hour}:${String(m).padStart(2, "0")} ${period}`;
    };

    return `${format(start)} – ${format(end)}`;
};

/* ================= UPCOMING EVENT CHECK ================= */
const isUpcomingEvent = (event) => {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = event.date.split("-").map(Number);
    const eventDate = new Date(y, m - 1, d);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate > today) return true;
    if (eventDate < today) return false;

    const [eh, em] = event.endTime.split(":").map(Number);
    const eventEnd = new Date();
    eventEnd.setHours(eh, em, 0, 0);

    return eventEnd > now;
};

/* ================= COMPONENT ================= */
const BookingHome = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/events`)
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const upcomingEvents = events.filter(isUpcomingEvent);

    return (
        <div className="container">
            <div className="max-w-6xl mx-auto px-4 mb-5">
                <div
                    className="breadcrumb-container w-full text-left mb-0 font-figtree font-light">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 p-0 flex gap-0 text-sm">
                            <li className="breadcrumb-item">
                                <a href={getAppUrl(null, '/')} className="text-gray-500 hover:underline">
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <a
                                    href="/"
                                    className="!text-gray-700 hover:underline breadcrumb-item truncate max-w-[120px] sm:max-w-[200px] md:max-w-full">
                                    Events
                                </a>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="flex flex-col items-center mb-8 mt-2">
                    <h2
                        className="text-4xl text-center text-[#8b171b]"
                        style={{ fontFamily: "PTSerif-Regular" }}
                    >
                        WORKSHOP CALENDAR
                    </h2>

                    <img src="/sita-motif.webp" className="mt-0 w-48" />
                </div>

                {upcomingEvents.length === 0 ? (
                    <p
                        className="text-center text-gray-500"
                        style={{ fontFamily: "Montserrat-Light" }}
                    >
                        No upcoming workshops
                    </p>
                ) : (
                    <div className="space-y-6">
                        {upcomingEvents.map((event) => {
                            const dateObj = new Date(event.date);
                            const day = dateObj.getDate();
                            const month = dateObj.toLocaleString("en-US", { month: "short" });

                            return (
                                <div
                                    key={event._id}
                                    className="relative h-40 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                        style={{
                                            backgroundImage: `url(${getCategoryImage(event.category)})`,
                                        }}
                                    />

                                    <div className="absolute inset-0 bg-black/55 transition-all duration-500 group-hover:bg-black/70" />

                                    <div className="relative h-full flex items-center justify-between px-6 text-white transition-transform duration-500 group-hover:-translate-y-1">
                                        <div className="flex flex-col items-center justify-center bg-white/95 border-l-4 border-[#8b171b] rounded-xl px-4 py-3 min-w-[110px] shadow-md">
                                            <span
                                                className="text-[11px] uppercase tracking-widest text-gray-500"
                                                style={{ fontFamily: "Montserrat-Light" }}
                                            >
                                                {month}
                                            </span>
                                            <span
                                                className="text-4xl font-extrabold text-gray-900 leading-none"
                                                style={{ fontFamily: "Montserrat-Regular" }}
                                            >
                                                {day}
                                            </span>
                                            <span
                                                className="mt-1 text-[12px] font-semibold text-gray-700 whitespace-nowrap"
                                                style={{ fontFamily: "Montserrat-Light" }}
                                            >
                                                Time : {formatTimeRange(event.startTime, event.endTime)}
                                            </span>
                                        </div>

                                        <div className="flex-1 px-6">
                                            <h3
                                                className="text-2xl md:text-3xl font-bold leading-tight"
                                                style={{ fontFamily: "Montserrat-Regular" }}
                                            >
                                                {event.title}
                                            </h3>

                                            <div className="inline-block mt-1 mb-1">
                                                <span
                                                    className="px-3 py-0.5 rounded-full text-[12px] font-semibold text-gray-900 bg-white/90"
                                                    style={{ fontFamily: "Montserrat-Light" }}
                                                >
                                                    Location : {event.location || "Location TBA"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right space-y-2">
                                            {Number(event.availability) > 0 && (
                                                <p
                                                    className="text-sm text-white font-medium"
                                                    style={{ fontFamily: "Montserrat-Light" }}
                                                >
                                                    Available Slots :{" "}
                                                    <span className="font-bold">
                                                        {event.availability}
                                                    </span>
                                                </p>
                                            )}

                                            {Number(event.availability) === 0 ? (
                                                <span
                                                    className="inline-block px-2 py-2 bg-gray-600 text-sm rounded"
                                                    style={{ fontFamily: "Montserrat-Regular" }}
                                                >
                                                    Bookings Closed
                                                </span>
                                            ) : event.bookingUrl ? (
                                                <Link
                                                    to={`/${event.bookingUrl}`}
                                                    className="inline-block text-white no-underline px-6 py-2 bg-green-600 text-sm font-semibold rounded transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/40"
                                                    style={{ fontFamily: "Montserrat-Regular" }}
                                                >
                                                    Book Now
                                                </Link>
                                            ) : (
                                                <span
                                                    className="inline-block px-6 py-2 bg-lime-600 text-sm font-semibold rounded"
                                                    style={{ fontFamily: "Montserrat-Regular" }}
                                                >
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHome;
