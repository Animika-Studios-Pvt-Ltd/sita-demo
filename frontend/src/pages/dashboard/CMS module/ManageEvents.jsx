import React, { useEffect, useState } from "react";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import Swal from "sweetalert2";
import "react-day-picker/dist/style.css";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

/* ================= SWEET ALERT HELPERS ================= */
const successAlert = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#4f46e5",
  });
const isPastSlot = (date, startTime) => {
  if (!date) return false;

  const now = new Date();

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ❌ Entire past day
  if (selected < today) return true;

  // ❌ Today but time passed
  if (selected.getTime() === today.getTime()) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const slotMinutes = toMinutes(startTime);
    return slotMinutes <= nowMinutes;
  }

  return false;
};
const isEventEditable = (event) => {
  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = event.date.split("-").map(Number);
  const eventDate = new Date(y, m - 1, d);

  // ❌ Past day
  if (eventDate < today) return false;

  // ❌ Today but already ended
  if (eventDate.getTime() === today.getTime()) {
    const endMinutes = toMinutes(event.endTime);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (endMinutes <= nowMinutes) return false;
  }

  return true;
};

const errorAlert = (title, text) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#dc2626",
  });

const confirmDelete = async (text) =>
  Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });

/* ================= TIME HELPERS ================= */
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (mins) => {
  mins = mins % 1440;
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const format12Hour = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const generateSlots = (step) => {
  const slots = [];
  for (let m = 0; m < 1440; m += step) slots.push(toTime(m));
  return slots;
};

const toDateStr = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`
    : "";

const getSlotStatus = (date, start, duration, events, blocked, ignoreEventId) => {
  const s1 = toMinutes(start);
  const e1 = s1 + duration;

  // 🔴 BLOCKED
  for (const b of blocked.filter((b) => b.date === date)) {
    if (isOverlap(s1, e1, toMinutes(b.startTime), toMinutes(b.endTime))) {
      return "blocked";
    }
  }

  // 🔵 EVENT
  for (const e of events.filter(
    (e) => e.date === date && e._id !== ignoreEventId
  )) {
    if (isOverlap(s1, e1, toMinutes(e.startTime), toMinutes(e.endTime))) {
      return "event";
    }
  }

  // ⚪ AVAILABLE
  return "available";
};

/* ================= OVERLAP ================= */
const isOverlap = (s1, e1, s2, e2) => s1 < e2 && s2 < e1;

const ManageEvents = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const [editingEventId, setEditingEventId] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);

  const [eventDuration, setEventDuration] = useState(60);
  const [blockDuration, setBlockDuration] = useState(60);
  const [manualEvent, setManualEvent] = useState(false);
  const [manualBlock, setManualBlock] = useState(false);
  const navigate = useNavigate();

  const [eventForm, setEventForm] = useState({
    title: "",
    location: "",
    mode: "Offline",
    fees: "",
    price: "",
    capacity: "",
    availability: "",
    ageGroup: "",
    description: "",
    bookingUrl: "",
    date: null,
    startTime: "",
    endTime: "",
  });

  const [blockForm, setBlockForm] = useState({
    reason: "",
    date: null,
    startTime: "",
    endTime: "",
  });

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    const [e, b] = await Promise.all([
      axios.get(`${API}/events`),
      axios.get(`${API}/blocked-dates`),
    ]);
    setEvents(e.data);
    setBlocked(b.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= SLOT CHECK ================= */
  const isSlotDisabled = (date, start, duration, ignoreId) => {
    const s1 = toMinutes(start);
    const e1 = s1 + duration;

    for (const b of blocked.filter((b) => b.date === date)) {
      if (isOverlap(s1, e1, toMinutes(b.startTime), toMinutes(b.endTime)))
        return true;
    }

    for (const e of events.filter((e) => e.date === date && e._id !== ignoreId)) {
      if (isOverlap(s1, e1, toMinutes(e.startTime), toMinutes(e.endTime)))
        return true;
    }

    return false;
  };

  /* ================= EVENT ================= */
  const submitEvent = async () => {
    if (!eventForm.title.trim())
      return errorAlert("Missing title", "Event title is required");

    if (!eventForm.date || !eventForm.startTime || !eventForm.endTime)
      return errorAlert("Missing fields", "Date & time required");

    if (toMinutes(eventForm.startTime) >= toMinutes(eventForm.endTime))
      return errorAlert("Invalid time", "End time must be after start");

    const date = toDateStr(eventForm.date);

    if (
      isSlotDisabled(
        date,
        eventForm.startTime,
        toMinutes(eventForm.endTime) - toMinutes(eventForm.startTime),
        editingEventId
      )
    ) {
      return errorAlert(
        "Time conflict",
        "This slot overlaps with another event or blocked slot"
      );
    }

    // bookingUrl can be empty now ✅
    const payload = { ...eventForm, date };

    try {
      editingEventId
        ? await axios.put(`${API}/events/${editingEventId}`, payload)
        : await axios.post(`${API}/events`, payload);

      successAlert(
        editingEventId ? "Event Updated" : "Event Created",
        "Operation successful"
      );

      resetEvent();
      fetchAll();
    } catch (err) {
      errorAlert("Error", err.response?.data?.message || "Failed");
    }
  };

  useEffect(() => {
    if (isPastDate(eventForm.date)) {
      setManualEvent(false);
    }
  }, [eventForm.date]);

  useEffect(() => {
    if (isPastDate(blockForm.date)) {
      setManualBlock(false);
    }
  }, [blockForm.date]);

  const editEvent = (e) => {
    setEditingEventId(e._id);
    setManualEvent(true);

    setEventForm({
      title: e.title || "",
      location: e.location || "",
      mode: e.mode || "Offline",
      availability: e.availability || "",

      fees: e.fees || "",
      price: e.price || "",
      capacity: e.capacity || "",
      ageGroup: e.ageGroup || "",
      description: e.description || "",
      bookingUrl: e.bookingUrl || "",

      date: new Date(e.date),
      startTime: e.startTime,
      endTime: e.endTime,
    });
  };

  const isPastDate = (date) => {
    if (!date) return false;

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected < today;
  };

  const editBlock = (b) => {
    setEditingBlockId(b._id);
    setManualBlock(true); // allow editing exact times

    setBlockForm({
      reason: b.reason || "",
      date: new Date(b.date),
      startTime: b.startTime,
      endTime: b.endTime,
    });
  };

  const resetEvent = () => {
    setEditingEventId(null);
    setManualEvent(false);
    setEventForm({
      title: "",
      location: "",
      mode: "Offline",
      availability: "",
      fees: "",
      capacity: "",
      ageGroup: "",
      description: "",
      bookingUrl: "",
      date: null,
      startTime: "",
      endTime: "",
    });

  };

  /* ================= BLOCK ================= */
  const submitBlock = async () => {
    if (!blockForm.date || !blockForm.startTime || !blockForm.endTime)
      return errorAlert("Missing fields", "Date & time required");

    if (toMinutes(blockForm.startTime) >= toMinutes(blockForm.endTime))
      return errorAlert("Invalid time", "End time must be after start");

    try {
      const payload = { ...blockForm, date: toDateStr(blockForm.date) };

      editingBlockId
        ? await axios.put(`${API}/blocked-dates/${editingBlockId}`, payload)
        : await axios.post(`${API}/blocked-dates`, payload);

      successAlert("Success", "Blocked slot saved");
      resetBlock();
      fetchAll();
    } catch (err) {
      errorAlert("Error", err.response?.data?.message || "Failed");
    }
  };

  const resetBlock = () => {
    setEditingBlockId(null);
    setManualBlock(false);
    setBlockForm({ reason: "", date: null, startTime: "", endTime: "" });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        Admin Event & Availability Manager
      </h1>

      {/* TOGGLE */}
      {/* <div className="flex justify-center mb-10">
        <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-inner">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-10 py-2 rounded-full font-semibold transition flex items-center gap-2
        ${activeTab === "events"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <EventAvailableIcon fontSize="small" />
            Events
          </button>

          <button
            onClick={() => setActiveTab("blocked")}
            className={`px-10 py-2 rounded-full font-semibold transition flex items-center gap-2
        ${activeTab === "blocked"
                ? "bg-red-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <BlockIcon fontSize="small" />
            Blocked
          </button>
        </div>
      </div> */}


      {/* ================= EVENTS ================= */}
      {activeTab === "events" && (
        <>
          {/* FORM */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">
              {editingEventId ? "Edit Event" : "Create New Event"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Title*", value: eventForm.title, key: "title" },
                { label: "Price (INR)", value: eventForm.price, key: "price" },
                { label: "Capacity", value: eventForm.capacity, key: "capacity" },
                { label: "Age Group", value: eventForm.ageGroup, key: "ageGroup" },
              ].map((f) => (
                <input
                  key={f.key}
                  placeholder={f.label}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={f.value}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, [f.key]: e.target.value })
                  }
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* LOCATION */}
              <input
                placeholder="Workshop Location"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={eventForm.location}
                onChange={(e) =>
                  setEventForm({ ...eventForm, location: e.target.value })
                }
              />

              {/* MODE */}
              <select
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                value={eventForm.mode}
                onChange={(e) =>
                  setEventForm({ ...eventForm, mode: e.target.value })
                }
              >
                <option value="Online">Online</option>
                <option value="In Person">In Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <input
              placeholder="Booking URL * (example: Yoga-Therapy)"
              className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={eventForm.bookingUrl}
              onChange={(e) =>
                setEventForm({ ...eventForm, bookingUrl: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="border p-3 rounded-lg w-full mb-6 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DayPicker
                mode="single"
                selected={eventForm.date}
                onSelect={(d) => setEventForm({ ...eventForm, date: d })}
                disabled={{ before: new Date() }}
              />
              <div>
                <label className="flex items-center gap-2 mb-3 font-medium">
                  <input
                    type="checkbox"
                    checked={manualEvent}
                    disabled={isPastDate(eventForm.date)}
                    onChange={() => setManualEvent(!manualEvent)}
                  />

                  Manual Time Selection
                </label>

                {!manualEvent ? (
                  <>
                    <select
                      className="border p-3 rounded-lg w-full mb-3"
                      value={eventDuration}
                      onChange={(e) => setEventDuration(Number(e.target.value))}
                    >
                      {[15, 30, 45, 60, 90, 120].map((d) => (
                        <option key={d} value={d}>
                          {d} minutes
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                      {eventForm.date &&
                        generateSlots(eventDuration).map((slot) => {
                          const end = toTime(toMinutes(slot) + eventDuration);
                          const status = getSlotStatus(
                            toDateStr(eventForm.date),
                            slot,
                            eventDuration,
                            events,
                            blocked,
                            editingEventId
                          );

                          const past = isPastSlot(eventForm.date, slot);
                          const disabled = status !== "available" || past;

                          let slotClass = "border-gray-300 bg-white hover:bg-gray-100";

                          if (status === "blocked") {
                            slotClass = "border-red-500 bg-red-50 text-red-600 cursor-not-allowed";
                          } else if (status === "event") {
                            slotClass = "border-blue-500 bg-blue-50 text-blue-600 cursor-not-allowed";
                          } else if (past) {
                            slotClass = "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed";
                          } else if (eventForm.startTime === slot) {
                            slotClass = "border-indigo-600 bg-indigo-600 text-white";
                          }

                          return (
                            <button
                              key={slot}
                              disabled={disabled}
                              onClick={() =>
                                setEventForm({
                                  ...eventForm,
                                  startTime: slot,
                                  endTime: end,
                                })
                              }
                              className={`py-2 text-xs rounded-lg border-2 transition ${slotClass}`}>
                              {format12Hour(slot)} – {format12Hour(end)}
                            </button>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="time"
                      disabled={isPastDate(eventForm.date)}
                      className="border p-3 rounded-lg w-full mb-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={eventForm.startTime}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, startTime: e.target.value })
                      }
                    />

                    <input
                      type="time"
                      disabled={isPastDate(eventForm.date)}
                      className="border p-3 rounded-lg w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={eventForm.endTime}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, endTime: e.target.value })
                      }
                    />

                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitEvent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
              >
                {editingEventId ? "Update Event" : "Add Event"}
              </button>
              {editingEventId && (
                <button
                  onClick={resetEvent}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* LIST */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow overflow-hidden w-full max-w-7xl">
              <table className="w-full text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    {[
                      "Code",
                      "Title",
                      "Schedule",
                      "Mode",
                      "Price & Slots",
                      "Age",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="p-3 text-center text-xs font-semibold uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {events.map((e) => (
                    <tr key={e._id} className="border-t hover:bg-gray-50">
                      {/* CODE */}
                      <td className="p-3 text-center font-semibold text-indigo-600 text-sm">
                        {e.code || "-"}
                      </td>

                      {/* TITLE */}
                      <td className="p-3 text-center font-medium text-sm">
                        {e.title}
                      </td>

                      {/* SCHEDULE */}
                      <td className="p-3 text-center text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-800">{e.date}</span>
                          <span className="text-gray-600">
                            {format12Hour(e.startTime)} – {format12Hour(e.endTime)}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {e.location || "Location N/A"}
                          </span>
                        </div>
                      </td>

                      {/* MODE */}
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                          {e.mode || "-"}
                        </span>
                      </td>

                      {/* PRICING + SLOTS */}
                      <td className="p-3 text-center text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-gray-700 font-bold">
                            ₹{e.price || 0}
                          </span>

                          <span className="text-gray-600 text-xs">
                            Cap: {e.capacity || "-"}
                          </span>

                          <span
                            className={`text-xs font-semibold ${e.availability === 0
                              ? "text-red-600"
                              : e.availability < 5
                                ? "text-yellow-600"
                                : "text-green-600"
                              }`}
                          >
                            Avl: {e.availability ?? "-"}
                          </span>
                        </div>
                      </td>

                      {/* AGE */}
                      <td className="p-3 text-center text-sm">
                        {e.ageGroup || "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/dashboard/manage-events/${e._id}/bookings`)}
                            className="px-3 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Bookings
                          </button>

                          <button
                            onClick={() => editEvent(e)}
                            className="px-3 py-1 text-xs rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              if (e.bookingUrl) {
                                navigate(`/dashboard/cms/edit/${e.bookingUrl}`);
                              } else {
                                Swal.fire("No Page Linked", "This event does not have a Booking URL set.", "info");
                              }
                            }}
                            className="px-3 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Edit Page
                          </button>

                          <button
                            onClick={async () => {
                              const res = await Swal.fire({
                                title: "Delete Event?",
                                text: "This event will be permanently deleted",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                              });

                              if (res.isConfirmed) {
                                await axios.delete(`${API}/events/${e._id}`);
                                fetchAll();
                                Swal.fire("Deleted!", "Event removed", "success");
                              }
                            }}
                            className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= BLOCKED ================= */}
      {activeTab === "blocked" && (
        <>
          {/* FORM */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              {editingBlockId ? "Edit Blocked Slot" : "Block Time Slot"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DayPicker
                mode="single"
                selected={blockForm.date}
                onSelect={(d) => setBlockForm({ ...blockForm, date: d })}
                disabled={{ before: new Date() }}
              />

              <div>
                <input
                  placeholder="Reason (optional)"
                  className="border p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-red-400 outline-none"
                  value={blockForm.reason}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, reason: e.target.value })
                  }
                />

                <label className="flex items-center gap-2 mb-3 font-medium">
                  <input
                    type="checkbox"
                    checked={manualBlock}
                    disabled={isPastDate(blockForm.date)}
                    onChange={() => setManualBlock(!manualBlock)}
                  />
                  Manual Time Selection
                </label>

                {!manualBlock ? (
                  <>
                    <select
                      className="border p-3 rounded-lg w-full mb-3"
                      value={blockDuration}
                      onChange={(e) => setBlockDuration(Number(e.target.value))}
                    >
                      {[15, 30, 45, 60, 90, 120].map((d) => (
                        <option key={d} value={d}>
                          {d} minutes
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                      {blockForm.date &&
                        generateSlots(blockDuration).map((slot) => {
                          const end = toTime(toMinutes(slot) + blockDuration);
                          const status = getSlotStatus(
                            toDateStr(blockForm.date),
                            slot,
                            blockDuration,
                            events,
                            blocked,
                            editingBlockId
                          );

                          const past = isPastSlot(blockForm.date, slot);
                          const disabled = status !== "available" || past;

                          // ✅ ADD THIS BLOCK
                          let slotClass = "border-gray-300 bg-white hover:bg-gray-100";

                          if (status === "blocked") {
                            slotClass = "border-red-500 bg-red-50 text-red-600 cursor-not-allowed";
                          } else if (status === "event") {
                            slotClass = "border-blue-500 bg-blue-50 text-blue-600 cursor-not-allowed";
                          } else if (past) {
                            slotClass = "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed";
                          } else if (blockForm.startTime === slot) {
                            slotClass = "border-red-600 bg-red-600 text-white";
                          }

                          return (
                            <button
                              key={slot}
                              disabled={disabled}
                              onClick={() =>
                                setBlockForm({
                                  ...blockForm,
                                  startTime: slot,
                                  endTime: end,
                                })
                              }
                              className={`py-2 text-xs rounded-lg border-2 transition ${slotClass}`}>
                              {format12Hour(slot)} – {format12Hour(end)}
                            </button>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="time"
                      disabled={isPastDate(blockForm.date)}
                      className="border p-3 rounded-lg w-full mb-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={blockForm.startTime}
                      onChange={(e) =>
                        setBlockForm({ ...blockForm, startTime: e.target.value })
                      }
                    />

                    <input
                      type="time"
                      disabled={isPastDate(blockForm.date)}
                      className="border p-3 rounded-lg w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={blockForm.endTime}
                      onChange={(e) =>
                        setBlockForm({ ...blockForm, endTime: e.target.value })
                      }
                    />
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={submitBlock}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                  {editingBlockId ? "Update Block" : "Block Slot"}
                </button>
                {editingBlockId && (
                  <button
                    onClick={resetBlock}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow overflow-hidden w-full max-w-5xl">
              <table className="w-full text-sm">
                <thead className="bg-red-600 text-white">
                  <tr>
                    {["Date", "Time", "Reason", "Actions"].map((h) => (
                      <th key={h} className="p-3 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {blocked.map((b) => (
                    <tr key={b._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-center font-medium">{b.date}</td>
                      <td className="text-center">
                        {format12Hour(b.startTime)} – {format12Hour(b.endTime)}
                      </td>
                      <td className="text-center">{b.reason || "-"}</td>
                      <td className="flex gap-2 justify-center p-2">
                        <button
                          onClick={() => editBlock(b)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            const res = await Swal.fire({
                              title: "Remove blocked slot?",
                              text: "This blocked slot will be removed",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#dc2626",
                            });
                            if (res.isConfirmed) {
                              await axios.delete(`${API}/blocked-dates/${b._id}`);
                              fetchAll();
                              Swal.fire("Removed!", "Blocked slot removed", "success");
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}

                  {blocked.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center p-6 text-gray-500">
                        No blocked slots found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageEvents;
