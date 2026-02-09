import React, { useEffect, useState } from "react";
import axios from "axios";
import getBaseUrl from "../../../../utils/baseURL";

const BookingForm = ({ content, onUpdate, pageSlug }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${getBaseUrl()}/api/events`);
                setEvents(res.data);

                // Auto-select event if content.eventId is empty AND pageSlug matches a bookingUrl
                if (!content.eventId && pageSlug) {
                    const match = res.data.find(e => e.bookingUrl === pageSlug);
                    if (match) {
                        onUpdate("eventId", match._id);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to load events", err);
                setLoading(false);
            }
        };
        fetchEvents();
    }, [pageSlug]); // Depend on pageSlug so it re-runs if slug changes (though unlikely in editor)

    // Filter events: If we have a matching event for the page, show ONLY that one (or all if none match?)
    // User asked: "I dont need all the event drop down"
    // So if we find a match, we can just show that one or make it read-only.
    // Let's filter the list.
    const matchingEvent = events.find(e => e.bookingUrl === pageSlug);
    const displayedEvents = matchingEvent ? [matchingEvent] : events;

    if (loading) {
        return <div className="text-sm text-slate-500">Loading events...</div>;
    }

    return (
        <div className="bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-[#7A1F2B] border-b border-white/70 pb-2">
                Booking Button Configuration
            </h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {matchingEvent ? "Linked Event" : "Select Event"}
                </label>
                <select
                    value={content.eventId || ""}
                    onChange={(e) => onUpdate("eventId", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm disabled:opacity-70"
                    disabled={!!matchingEvent} // Disable if auto-matched to prevent changing
                >
                    <option value="">-- Choose an Event --</option>
                    {displayedEvents.map((e) => (
                        <option key={e._id} value={e._id}>
                            {e.title} ({new Date(e.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
                {matchingEvent && (
                    <p className="text-xs text-emerald-700 mt-1">
                        ✓ Automatically linked to this page's event.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                <input
                    type="text"
                    value={content.buttonText || "Book Now"}
                    onChange={(e) => onUpdate("buttonText", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alignment</label>
                <div className="flex gap-4">
                    {["left", "center", "right"].map((align) => (
                        <label key={align} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                            <input
                                type="radio"
                                name="align"
                                checked={content.alignment === align}
                                onChange={() => onUpdate("alignment", align)}
                                className="accent-[#7A1F2B]"
                            />
                            <span className="capitalize">{align}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
