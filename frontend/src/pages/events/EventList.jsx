import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import getBaseUrl from "../../utils/baseURL";

const API = `${getBaseUrl()}/api`;

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API}/events`);
                setEvents(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="text-center py-20">Loading Events...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
                Upcoming <span className="text-indigo-600">Events & Workshops</span>
            </h1>

            {events.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    No upcoming events at the moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
                            {/* Image Placeholder or Actual Image */}
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 font-medium">Event Image</span>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${event.mode === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {event.mode}
                                    </span>
                                </div>


                                <div className="flex items-center text-gray-600 mb-2 text-sm">
                                    <CalendarTodayIcon fontSize="small" className="mr-2 text-indigo-500" />
                                    {new Date(event.date).toLocaleDateString()} • {event.startTime}
                                </div>

                                <div className="flex items-center text-gray-600 mb-4 text-sm">
                                    <LocationOnIcon fontSize="small" className="mr-2 text-red-500" />
                                    {event.location || "Online"}
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                    {event.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t pt-4">
                                    <div>
                                        <span className="block text-xs text-gray-500">Price</span>
                                        <span className="text-lg font-bold text-indigo-700">
                                            {event.price > 0 ? `₹${event.price}` : "Free"}
                                        </span>
                                    </div>

                                    <Link
                                        to={`/booking/${event.bookingUrl || event._id}`}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
