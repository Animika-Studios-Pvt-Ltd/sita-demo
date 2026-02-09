import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import getBaseUrl from "../../../utils/baseURL";

const API = `${getBaseUrl()}/api`;
const PAGE_LIMIT = 10;

/* ================= UI THEME ================= */
const glassPanel =
    "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl";
const glassBtn =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
    "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 " +
    "hover:bg-white/90 transition-colors";
const glassSearch =
    "w-full md:max-w-md bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 " +
    "rounded-full px-4 py-2 text-sm text-slate-700 placeholder-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80";
const glassTableWrap = `${glassPanel} overflow-hidden`;
const glassTableHead =
    "bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 " +
    "text-slate-500 uppercase text-xs font-semibold border border-white/70";

const EventBookings = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [eventCapacity, setEventCapacity] = useState(0);

    useEffect(() => {
        fetchBookings();
        fetchEvent();
    }, [id]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API}/bookings/${id}`);
            setBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`${API}/events`);
            const event = res.data.find((e) => e._id === id);

            if (event) {
                setEventCapacity(event.capacity || 0);
            } else {
                console.warn("Event not found in events list");
            }
        } catch (err) {
            console.error("Failed to fetch event:", err);
        }
    };

    /* ================= FILTER ================= */
    const filteredBookings = bookings.filter(
        (b) =>
            b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ================= RESET PAGE ON SEARCH ================= */
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    /* ================= PAGINATION ================= */
    const total = filteredBookings.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

    const paginatedBookings = filteredBookings.slice(
        (page - 1) * PAGE_LIMIT,
        page * PAGE_LIMIT
    );

    /* ================= SEATS CALCULATION ================= */
    const bookedSeats = bookings
        .filter((b) => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + Number(b.seats || 0), 0);

    // 🔹 Replace with real capacity if available from API
    const EVENT_CAPACITY = eventCapacity;

    const availableSeats = Math.max(EVENT_CAPACITY - bookedSeats, 0);

    return (
        <div className="max-w-7xl mx-auto p-4 pt-0 mt-10 font-montserrat text-slate-700">
            {/* HEADER */}
            <div className="relative flex items-center justify-center mb-6">
                <button
                    onClick={() => navigate("/dashboard/manage-events")}
                    className={`absolute left-0 ${glassBtn}`}
                >
                    <ArrowBackIcon fontSize="small" />
                    Back
                </button>

                <h1 className="text-2xl md:text-3xl font-semibold text-[#7A1F2B] text-center">
                    Event Bookings
                </h1>
            </div>

            {/* CARD */}
            <div className={`${glassPanel} p-6`}>
                {/* SEARCH + COUNT */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email or status..."
                        className={glassSearch}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="flex flex-col md:items-end text-sm font-medium gap-1">
                        <div className="text-slate-600">
                            Seats Booked :{" "}
                            <span className="text-[#7A1F2B] font-semibold">
                                {bookedSeats}
                            </span>
                            <span className="text-slate-400"> / {EVENT_CAPACITY}</span>
                        </div>

                        <div
                            className={`text-sm font-semibold ${availableSeats === 0
                                ? "text-red-600"
                                : availableSeats < 5
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                        >
                            Available Seats : {availableSeats}
                        </div>
                    </div>
                </div>

                {/* STATES */}
                {loading ? (
                    <div className="text-center py-14 text-slate-500">
                        Loading bookings...
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-14 text-slate-500">
                        No bookings found for this event.
                    </div>
                ) : (
                    <>
                        {/* TABLE */}
                        <div className={glassTableWrap}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className={glassTableHead}>
                                        <tr>
                                            {[
                                                "User",
                                                "Email",
                                                "Phone",
                                                "Seats",
                                                "Amount",
                                                "Status",
                                                "Booked On",
                                            ].map((h) => (
                                                <th
                                                    key={h}
                                                    className="p-3 text-center text-xs font-semibold uppercase tracking-wide"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paginatedBookings.map((b) => (
                                            <tr
                                                key={b._id}
                                                className="border-b border-slate-200/80 hover:bg-white/70 transition"
                                            >
                                                <td className="p-3 text-center font-medium text-slate-700">
                                                    {b.userName}
                                                </td>

                                                <td className="p-3 text-center text-slate-600">
                                                    {b.userEmail}
                                                </td>

                                                <td className="p-3 text-center text-slate-600">
                                                    {b.userPhone || "-"}
                                                </td>

                                                <td className="p-3 text-center font-semibold">
                                                    {b.seats}
                                                </td>

                                                <td className="p-3 text-center font-semibold">
                                                    {b.totalAmount > 0 ? `$${b.totalAmount}` : "Free"}
                                                </td>

                                                <td className="p-3 text-center">
                                                    <span
                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                            ${b.status === "CONFIRMED"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : b.status === "PENDING"
                                                                    ? "bg-amber-100 text-amber-700"
                                                                    : "bg-rose-100 text-rose-700"
                                                            }`}
                                                    >
                                                        {b.status}
                                                    </span>
                                                </td>

                                                <td className="p-3 text-center text-slate-500">
                                                    {new Date(b.bookedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (page > 1) setPage((p) => p - 1);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    disabled={page <= 1}
                                    className={`px-4 py-2 rounded-full border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-black/5 text-sm ${page <= 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-white/90"
                                        }`}
                                >
                                    Prev
                                </button>

                                <div className="px-3 py-2 rounded-full border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-black/5 text-sm">
                                    Page {page} of {totalPages}
                                </div>

                                <button
                                    onClick={() => {
                                        if (page < totalPages) setPage((p) => p + 1);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    disabled={page >= totalPages}
                                    className={`px-4 py-2 rounded-full border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-black/5 text-sm ${page >= totalPages
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-white/90"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventBookings;  
