import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppUrl } from "../../utils/subdomain";
import "./BookingHome.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= CATEGORY IMAGE SET ================= */
const categoryImages = {
    "Yoga Therapy": [
        "https://img.freepik.com/free-vector/international-yoga-day-woman-doing-posture-grass-with-text-space_1017-53205.jpg?t=st=1769598369~exp=1769601969~hmac=1a1a9372ca40d43fc1f1a39ada20b5f5956343346899ea083f0cd4d08e7d555b&w=1060",
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

    useEffect(() => {
        const decorEls = document.querySelectorAll(".sita-decor");
        if (decorEls.length === 0) return;

        let current = [];
        let target = [];
        let time = 0;
        let animationFrameId;

        decorEls.forEach((_, i) => {
            current[i] = 0;
            target[i] = 0;
        });

        const lerp = (a, b, n) => (1 - n) * a + n * b;

        const updateTargets = () => {
            const viewportCenter = window.innerHeight / 2;

            decorEls.forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                const elCenter = rect.top + rect.height / 2;
                const distance = elCenter - viewportCenter;

                const strength = i === 0 ? 0.1 : 0.2;
                target[i] = -distance * strength;
            });
        };

        const animate = () => {
            time += 0.03;

            decorEls.forEach((el, i) => {
                current[i] = lerp(current[i], target[i], 0.08);
                const float = Math.sin(time + i) * 20;
                el.style.transform = `translateY(${current[i] + float}px)`;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("scroll", updateTargets, { passive: true });
        window.addEventListener("resize", updateTargets);

        updateTargets();
        animate();

        return () => {
            window.removeEventListener("scroll", updateTargets);
            window.removeEventListener("resize", updateTargets);
            cancelAnimationFrame(animationFrameId);
        };
    }, [loading]); // Re-run if loading changes (though flower is static, good practice if structure changes)

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
                    src="/flower.webp"
                    alt=""
                    className="sita-publications-decor sita-decor"
                    aria-hidden="true"
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
                                    <a href={getAppUrl(null, '/')} className="text-gray-500 text-[16px] hover:underline">
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
                        <div className="space-y-6">
                            {upcomingEvents.map((event) => {
                                const dateObj = new Date(event.date);
                                const day = dateObj.getDate();
                                const month = dateObj.toLocaleString("en-US", { month: "short" });
                                // Call getCategoryImage ONCE to ensure consistent image and correct counter increment
                                const eventImage = getCategoryImage(event.category);

                                return (
                                    <React.Fragment key={event._id}>
                                        {/* ================= DESKTOP VIEW (md+) ================= */}
                                        <div className="hidden md:block relative h-[230px] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                                style={{
                                                    backgroundImage: `url(${eventImage})`,
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

                                        {/* ================= MOBILE VIEW (< md) ================= */}
                                        <div className="md:hidden rounded-2xl overflow-hidden shadow-md bg-white">

                                            {/* Image */}
                                            <div
                                                className="w-full aspect-[16/9] bg-cover bg-center"
                                                style={{ backgroundImage: `url(${eventImage})` }}
                                            />

                                            {/* Content */}
                                            <div className="p-2 flex flex-col space-y-4">

                                                {/* Title */}
                                                <h3
                                                    className="text-lg font-bold text-gray-900 leading-snug"
                                                    style={{ fontFamily: "Montserrat-Regular" }}
                                                >
                                                    {event.title}
                                                </h3>

                                                {/* Date + Time + Location */}
                                                <div className="flex items-start gap-3">
                                                    {/* Date Badge */}
                                                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#8b171b] text-white rounded-lg leading-none">
                                                        <span className="text-xs uppercase tracking-wide">
                                                            {month}
                                                        </span>
                                                        <span className="text-lg font-bold">
                                                            {day}
                                                        </span>
                                                    </div>

                                                    {/* Time + Location */}
                                                    <div className="flex flex-col text-sm text-gray-600">
                                                        <span>
                                                            {formatTimeRange(event.startTime, event.endTime)}
                                                        </span>

                                                        <span className="mt-0.5">
                                                            Location: {event.location || "Location TBA"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Availability */}
                                                {Number(event.availability) > 0 && (
                                                    <p
                                                        className="text-sm text-gray-700"
                                                        style={{ fontFamily: "Montserrat-Light" }}
                                                    >
                                                        Available Slots:{" "}
                                                        <span className="font-semibold text-[#8b171b]">
                                                            {event.availability}
                                                        </span>
                                                    </p>
                                                )}

                                                {/* CTA */}
                                                <div className="pt-2">
                                                    {Number(event.availability) === 0 ? (
                                                        <span
                                                            className="block w-full text-center py-2 bg-gray-500 text-white text-sm rounded-lg"
                                                            style={{ fontFamily: "Montserrat-Regular" }}
                                                        >
                                                            Bookings Closed
                                                        </span>
                                                    ) : event.bookingUrl ? (
                                                        <Link
                                                            to={`/${event.bookingUrl}`}
                                                            className="block w-full text-center py-2 bg-[#8b171b] text-white text-sm no-underline font-semibold rounded-lg transition hover:bg-[#a62024]"
                                                            style={{ fontFamily: "Montserrat-Regular" }}
                                                        >
                                                            Book Now
                                                        </Link>
                                                    ) : (
                                                        <span
                                                            className="block w-full text-center py-3 bg-lime-600 text-white text-sm font-semibold rounded-lg"
                                                            style={{ fontFamily: "Montserrat-Regular" }}
                                                        >
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </React.Fragment>
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
