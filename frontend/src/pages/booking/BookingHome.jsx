import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-4xl text-center font-serif text-red-700 mb-10">
                WORKSHOP CALENDAR
            </h1>

            {events.length === 0 ? (
                <p className="text-center text-gray-500">
                    No workshops available
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm text-center">
                        <thead className="bg-gray-100 font-semibold">
                            <tr>
                                <th className="border px-3 py-2">Code</th>
                                <th className="border px-3 py-2">Workshop Title</th>
                                <th className="border px-3 py-2">Workshop Date</th>
                                <th className="border px-3 py-2">Workshop Location</th>
                                <th className="border px-3 py-2">Workshop Mode</th>
                                <th className="border px-3 py-2">Fees</th>
                                <th className="border px-3 py-2">Capacity</th>
                                <th className="border px-3 py-2">Availability</th>
                                <th className="border px-3 py-2">Age Group</th>
                                <th className="border px-3 py-2">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{event.code}</td>
                                    <td className="border px-3 py-2 font-medium">
                                        {event.title}
                                    </td>
                                    <td className="border px-3 py-2">{event.date}</td>
                                    <td className="border px-3 py-2">
                                        {event.location || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {event.mode || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {event.fees || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {event.capacity || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {event.availability ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {event.ageGroup || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {Number(event.availability) === 0 ? (
                                            <span className="text-red-600 font-semibold">
                                                Booking Closed
                                            </span>
                                        ) : event.bookingUrl ? (
                                            <Link
                                                to={`/${event.bookingUrl}`}
                                                className="inline-block px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Book Now
                                            </Link>
                                        ) : (
                                            <span className="inline-block px-4 py-1 bg-lime-600 text-white rounded">
                                                Coming Soon
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingHome;
