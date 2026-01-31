import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppUrl } from "../../utils/subdomain";
import "./BookingHome.css";
import { useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= CATEGORY IMAGE SET ================= */
const categoryImages = {
    "Yoga Therapy": [
        "https://images.unsplash.com/photo-1496483353456-90997957cf99",
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

    const decorRef = useRef(null);

    useEffect(() => {
        if (loading) return;

        const decor = decorRef.current;
        if (!decor) return;

        let raf;
        let currentY = 0;
        let targetY = 0;
        let scrollY = window.scrollY;
        let time = 0;

        const startOffset = 120;
        const ease = 0.08; // 🔥 lower = smoother

        const doc = document.documentElement;

        // ✅ Calculate ONCE
        const imgHeight = decor.offsetHeight || 350;
        const scrollMax = doc.scrollHeight - window.innerHeight;
        const maxTravel = Math.max(
            doc.scrollHeight - window.innerHeight - imgHeight - startOffset,
            0
        );

        // 🔥 Sync on mount
        targetY = currentY = (scrollY / scrollMax) * maxTravel;
        decor.style.transform = `translateY(${currentY}px)`;

        const onScroll = () => {
            scrollY = window.scrollY;
        };

        const animate = () => {
            time += 0.03;

            // smooth target
            targetY = (scrollY / scrollMax) * maxTravel;

            // smooth follow
            currentY += (targetY - currentY) * ease;

            // idle float only when not scrolling fast
            const float =
                Math.abs(targetY - currentY) < 0.5
                    ? Math.sin(time) * 6
                    : 0;

            decor.style.transform = `translateY(${currentY + float}px)`;

            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        animate();

        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, [loading]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const upcomingEvents = events.filter(isUpcomingEvent);

    return (
        <div className="relative w-full overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none h-full w-full flex flex-col items-end">
                <img
                    ref={decorRef}
                    src="/flower.webp"
                    className="sita-publications-decor sita-decor"
                />

            </div>
            <div className="container mx-auto relative z-10">
                <div className="max-w-6xl mx-auto px-4 mb-5 relative">
                    {/* BREADCRUMB */}
                    <div
                        className="breadcrumb-container w-full text-left font-figtree font-light">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mt-0 mb-2 p-0">
                                <li className="breadcrumb-item">
                                    <a href="https://sitashakti.com" className="text-gray-500 text-[16px] hover:underline">
                                        Home
                                    </a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a
                                        href="/"
                                        className="!text-gray-700 hover:underline breadcrumb-item text-[16px] truncate max-w-[120px] sm:max-w-[200px] md:max-w-full">
                                        Events
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    {/* HEADER */}
                    <h2
                        className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
                        WORKSHOP CALENDAR
                    </h2>
                    <img
                        src="/sita-motif.webp"
                        alt="Sita Motif"
                        className="mx-auto mt-1 w-40 sm:w-48 mb-8"
                    />

                    {upcomingEvents.length === 0 ? (
                        <p
                            className="text-center text-gray-500"
                            style={{ fontFamily: "Montserrat-Light" }}
                        >
                            No upcoming workshops
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => {
                                const dateObj = new Date(event.date);
                                const day = dateObj.getDate();
                                const month = dateObj.toLocaleString("en-US", {
                                    month: "short",
                                });
                                const eventImage = getCategoryImage(event.category);

                                return (
                                    <div
                                        key={event._id}
                                        className="group rounded-2xl overflow-hidden bg-white shadow-md flex flex-col border-1 border-transparent transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#8b171b]">

                                        {/* IMAGE */}
                                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${eventImage})` }}
                                            />
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                            />
                                        </div>


                                        {/* CONTENT */}
                                        <div className="p-4 flex flex-col space-y-3 flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#8b171b]">
                                                {event.title}
                                            </h3>

                                            <div className="flex items-start gap-3">
                                                <div className="px-3 py-2 bg-[#8b171b] text-white rounded-lg text-center">
                                                    <div className="text-xs uppercase">{month}</div>
                                                    <div className="text-lg font-bold">{day}</div>
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    <div>
                                                        {formatTimeRange(
                                                            event.startTime,
                                                            event.endTime
                                                        )}
                                                    </div>
                                                    <div>
                                                        Location:{" "}
                                                        {event.location || "Location TBA"}
                                                    </div>
                                                    <div>
                                                        {Number(event.availability) > 0 && (
                                                            <p className="text-sm text-gray-700">
                                                                Available Slots:{" "}
                                                                <span className="font-semibold text-[#8b171b]">
                                                                    {event.availability}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-auto pt-2">
                                                {Number(event.availability) === 0 ? (
                                                    <span className="block w-full text-center py-2 bg-gray-500 text-white rounded-lg">
                                                        Bookings Closed
                                                    </span>
                                                ) : event.bookingUrl ? (
                                                    <Link
                                                        to={`/${event.bookingUrl}`}
                                                        className="block w-full text-center no-underline py-2 bg-[#8b171b] text-white font-semibold rounded-lg
           transition-all duration-300 hover:bg-[#a62024] hover:scale-[1.02]"
                                                    >
                                                        Book Now
                                                    </Link>
                                                ) : (
                                                    <span className="block w-full text-center py-2 bg-lime-600 text-white rounded-lg">
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
        </div>
    );
};

export default BookingHome;
