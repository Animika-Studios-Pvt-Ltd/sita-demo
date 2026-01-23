import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API = "http://localhost:5000/api";

const EventBookings = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
    }, [id]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API}/bookings/${id}`);
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(
        (b) =>
            b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/dashboard/manage-events")}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
                >
                    <ArrowBackIcon />
                    Back to Events
                </button>
                <h1 className="text-3xl font-bold text-indigo-700">Event Bookings</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email or status..."
                        className="border p-3 rounded-lg w-full max-w-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="text-gray-500 text-sm">
                        Total: {filteredBookings.length}
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No bookings found for this event.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                                <tr>
                                    <th className="p-3">User Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3 text-center">Seats</th>
                                    <th className="p-3 text-center">Amount</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((b) => (
                                    <tr key={b._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-900">{b.userName}</td>
                                        <td className="p-3 text-gray-600">{b.userEmail}</td>
                                        <td className="p-3 text-gray-600">{b.userPhone || "-"}</td>
                                        <td className="p-3 text-center">{b.seats}</td>
                                        <td className="p-3 text-center font-medium">
                                            {b.totalAmount > 0 ? `₹${b.totalAmount}` : "Free"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === "CONFIRMED"
                                                        ? "bg-green-100 text-green-700"
                                                        : b.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {new Date(b.bookedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventBookings;
