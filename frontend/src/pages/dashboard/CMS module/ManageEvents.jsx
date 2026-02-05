import React, { useEffect, useState } from "react";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import Swal from "sweetalert2";
import "react-day-picker/dist/style.css";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import getBaseUrl from "../../../utils/baseURL";

const API = `${getBaseUrl()}/api`;

/* ================= UI THEME ================= */
const glassPanel =
  "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl";
const glassInput =
  "w-full px-4 py-2 rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 " +
  "text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm";
const glassSelect =
  "w-full px-4 py-2 rounded-lg bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 " +
  "text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm";
const glassBtn =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 " +
  "hover:bg-white/90 transition-colors";
const glassBtnPrimarySoft =
  "inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold " +
  "bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl " +
  "border border-[#7A1F2B] text-[#7A1F2B] ring-1 ring-black/5 hover:bg-white/90 transition-colors";
const glassBtnMuted =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/70 backdrop-blur-xl border border-white/70 text-slate-600 ring-1 ring-black/5 hover:bg-white/90 transition-colors";
const glassTableWrap = `${glassPanel} overflow-hidden`;
const glassTableHead =
  "bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 " +
  "text-slate-500 uppercase text-xs font-semibold border border-white/70";

/* ================= SWEET ALERT HELPERS ================= */
const successAlert = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#7A1F2B",
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
  const [showEventForm, setShowEventForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const eventFormRef = React.useRef(null);
  const blockFormRef = React.useRef(null);
  const [eventFilter, setEventFilter] = useState("upcoming");
  const [blockFilter, setBlockFilter] = useState("upcoming");
  const [eventSearch, setEventSearch] = useState("");
  const [blockSearch, setBlockSearch] = useState("");
  const EVENT_LIMIT = 10;
  const BLOCK_LIMIT = 10;
  const [eventPage, setEventPage] = useState(1);
  const [blockPage, setBlockPage] = useState(1);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [blockSubmitting, setBlockSubmitting] = useState(false);
  const isPastEvent = (event) => !isUpcomingEvent(event);

  const [eventForm, setEventForm] = useState({
    title: "",
    category: "",
    location: "",
    mode: "",
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
  const isUpcomingEvent = (event) => {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = event.date.split("-").map(Number);
    const eventDate = new Date(y, m - 1, d);
    eventDate.setHours(0, 0, 0, 0);

    // ✅ Future date
    if (eventDate > today) return true;

    // ❌ Past date
    if (eventDate < today) return false;

    // 🕒 Today → compare end time
    const endMinutes = toMinutes(event.endTime);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return endMinutes > nowMinutes;
  };
  const isUpcomingDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);

    return d >= today;
  };

  const isPastDateStr = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);

    return d < today;
  };

  const isUpcomingBlocked = (block) => {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = block.date.split("-").map(Number);
    const blockDate = new Date(y, m - 1, d);
    blockDate.setHours(0, 0, 0, 0);

    // ✅ Future date
    if (blockDate > today) return true;

    // ❌ Past date
    if (blockDate < today) return false;

    // 🕒 Today → compare end time
    const endMinutes = toMinutes(block.endTime);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return endMinutes > nowMinutes;
  };

  const isPastBlocked = (block) => !isUpcomingBlocked(block);


  const eventQuery = eventSearch.trim().toLowerCase();
  const filteredEvents = events.filter((e) => {
    if (eventFilter === "upcoming" && !isUpcomingEvent(e)) return false;
    if (eventFilter === "past" && !isPastEvent(e)) return false;
    if (!eventQuery) return true;
    const hay = [
      e.title,
      e.code,
      e.location,
      e.category,
      e.mode,
      e.bookingUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(eventQuery);
  });

  const blockQuery = blockSearch.trim().toLowerCase();
  const filteredBlocked = blocked.filter((b) => {
    if (blockFilter === "upcoming" && !isUpcomingBlocked(b)) return false;
    if (blockFilter === "past" && !isPastBlocked(b)) return false;
    if (!blockQuery) return true;
    const hay = [
      b.reason,
      b.date,
      b.startTime,
      b.endTime,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(blockQuery);
  });

  /* ================= EVENT ================= */
  const submitEvent = async () => {
    if (eventSubmitting) return; // 🔒 prevent double click
    setEventSubmitting(true);

    try {
      if (!eventForm.title.trim())
        return errorAlert("Missing title", "Event title is required");

      if (!eventForm.date || !eventForm.startTime || !eventForm.endTime)
        return errorAlert("Missing fields", "Date & time required");

      if (toMinutes(eventForm.startTime) >= toMinutes(eventForm.endTime))
        return errorAlert("Invalid time", "End time must be after start");

      if (!eventForm.category)
        return errorAlert("Missing category", "Please select a category");

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

      const payload = { ...eventForm, date };

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
    } finally {
      setEventSubmitting(false); // ✅ always re-enable
    }
  };

  useEffect(() => {
    if (isPastDate(eventForm.date)) {
      setManualEvent(false);
    }
  }, [eventForm.date]);
  useEffect(() => {
    // Close all forms when switching tabs
    setShowEventForm(false);
    setShowBlockForm(false);

    // Reset editing states
    setEditingEventId(null);
    setEditingBlockId(null);

    // Reset manual toggles
    setManualEvent(false);
    setManualBlock(false);
  }, [activeTab]);

  useEffect(() => {
    if (isPastDate(blockForm.date)) {
      setManualBlock(false);
    }
  }, [blockForm.date]);

  useEffect(() => {
    setEventPage(1);
  }, [eventFilter]);
  useEffect(() => {
    setEventPage(1);
  }, [eventSearch]);

  useEffect(() => {
    setBlockPage(1);
  }, [blockFilter]);
  useEffect(() => {
    setBlockPage(1);
  }, [blockSearch]);

  useEffect(() => {
    setEventPage(1);
    setBlockPage(1);
  }, [activeTab]);

  const eventTotal = filteredEvents.length;

  const paginatedEvents = filteredEvents.slice(
    (eventPage - 1) * EVENT_LIMIT,
    eventPage * EVENT_LIMIT
  );

  const blockTotal = filteredBlocked.length;

  const paginatedBlocked = filteredBlocked.slice(
    (blockPage - 1) * BLOCK_LIMIT,
    blockPage * BLOCK_LIMIT
  );

  const editEvent = (e) => {
    setShowEventForm(true);
    setEditingEventId(e._id);
    setManualEvent(true);

    setEventForm({
      title: e.title || "",
      category: e.category || "",
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

    setTimeout(() => {
      eventFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
    setShowBlockForm(true);
    setEditingBlockId(b._id);
    setManualBlock(true);

    setBlockForm({
      reason: b.reason || "",
      date: new Date(b.date),
      startTime: b.startTime,
      endTime: b.endTime,
    });

    setTimeout(() => {
      blockFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  const resetEvent = () => {
    setEditingEventId(null);
    setShowEventForm(false);
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
    if (blockSubmitting) return;
    setBlockSubmitting(true);

    try {
      if (!blockForm.date || !blockForm.startTime || !blockForm.endTime)
        return errorAlert("Missing fields", "Date & time required");

      if (toMinutes(blockForm.startTime) >= toMinutes(blockForm.endTime))
        return errorAlert("Invalid time", "End time must be after start");

      const payload = { ...blockForm, date: toDateStr(blockForm.date) };

      editingBlockId
        ? await axios.put(`${API}/blocked-dates/${editingBlockId}`, payload)
        : await axios.post(`${API}/blocked-dates`, payload);

      successAlert("Success", "Blocked slot saved");
      resetBlock();
      fetchAll();
    } catch (err) {
      errorAlert("Error", err.response?.data?.message || "Failed");
    } finally {
      setBlockSubmitting(false);
    }
  };

  const resetBlock = () => {
    setEditingBlockId(null);
    setShowBlockForm(false);
    setManualBlock(false);
    setBlockForm({ reason: "", date: null, startTime: "", endTime: "" });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-4 pt-0 mt-10 font-montserrat text-slate-700">
      <div className="relative flex items-center justify-center mb-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className={`absolute left-0 ${glassBtn}`}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-semibold text-[#7A1F2B] text-center">
          Admin Event & Availability Manager
        </h1>
      </div>

      {/* TOGGLE */}

      {/* <div className="relative flex justify-center mb-8 bg-white/60 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-white/70 rounded-full p-1.5 max-w-md mx-auto shadow-sm overflow-hidden">
        <div className={`absolute top-1.5 left-1.5 w-[calc(50%-0.375rem)] h-10 bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 rounded-full border border-[#7A1F2B] ring-1 ring-black/5 shadow-[0_8px_18px_-12px_rgba(122,31,43,0.45)] transform transition-transform duration-300 ${activeTab === "blocked" ? "translate-x-full" : ""}`}></div>
        <button
          className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-colors duration-200 ${activeTab === "events" ? "text-[#7A1F2B]" : "text-slate-500 hover:text-slate-800"}`}
          onClick={() => setActiveTab("events")}
        >
          <EventAvailableIcon /> Events
        </button>
        <button
          className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-colors duration-200 ${activeTab === "blocked" ? "text-[#7A1F2B]" : "text-slate-500 hover:text-slate-800"}`}
          onClick={() => setActiveTab("blocked")}
        >
          <BlockIcon /> Blocked
        </button>
      </div> */}

      {/* ================= EVENTS ================= */}
      {activeTab === "events" && (
        <>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowEventForm((v) => !v)}
              className={glassBtnPrimarySoft}
            >
              {showEventForm ? "Close Event Form" : "Create Event"}
            </button>
          </div>

          {/* FORM */}
          {showEventForm && (
            <div ref={eventFormRef} className={`${glassPanel} p-6 mb-8`}>
              <h2 className="text-xl font-semibold text-[#7A1F2B] mb-4">
                {editingEventId ? "Edit Event" : "Create New Event"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Title*", value: eventForm.title, key: "title" },
                  { label: "Price (USD)", value: eventForm.price, key: "price" },
                  { label: "Capacity", value: eventForm.capacity, key: "capacity" },
                  { label: "Age Group", value: eventForm.ageGroup, key: "ageGroup" },
                ].map((f) => (
                  <input
                    key={f.key}
                    placeholder={f.label}
                    className={glassInput}
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
                  className={glassInput}
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                />

                {/* MODE */}
                <select
                  className={glassSelect}
                  value={eventForm.mode}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, mode: e.target.value })
                  }
                ><option value="">Select mode *</option>
                  <option value="Online">Online</option>
                  <option value="In Person">In Person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>

                <select
                  className={glassSelect}
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, category: e.target.value })
                  }
                >
                  <option value="">Select Category *</option>
                  <option value="Yoga Therapy">Yoga Therapy</option>
                  <option value="Ayurveda – Nutrition & Integration">Ayurveda – Nutrition & Integration</option>
                  <option value="Kosha Counseling">Kosha Counseling</option>
                  <option value="Soul Curriculum">Soul Curriculum</option>
                  <option value="Release Karmic Patterns">Release Karmic Patterns</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <input
                placeholder="Booking URL (example: Yoga-Therapy)"
                className={`${glassInput} mb-4`}
                value={eventForm.bookingUrl}
                onChange={(e) =>
                  setEventForm({ ...eventForm, bookingUrl: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className={`${glassInput} mb-6 resize-y`}
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${glassPanel} p-3`}>
                  <DayPicker
                    mode="single"
                    selected={eventForm.date}
                    onSelect={(d) => setEventForm({ ...eventForm, date: d })}
                    disabled={{ before: new Date() }}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-3 font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={manualEvent}
                      disabled={isPastDate(eventForm.date)}
                      onChange={() => setManualEvent(!manualEvent)}
                      className="accent-[#7A1F2B]"
                    />

                    Manual Time Selection
                  </label>

                  {!manualEvent ? (
                    <>
                      <select
                        className={`${glassSelect} mb-3`}
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

                            let slotClass =
                              "border-white/70 bg-white/70 text-slate-700 hover:bg-white/90";

                            if (status === "blocked") {
                              slotClass =
                                "border-[#7A1F2B]/60 bg-[#7A1F2B]/15 text-[#7A1F2B] cursor-not-allowed";
                            } else if (status === "event") {
                              slotClass =
                                "border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed";
                            } else if (past) {
                              slotClass =
                                "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed";
                            } else if (eventForm.startTime === slot) {
                              slotClass = "border-[#7A1F2B] bg-[#7A1F2B] text-white";
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
                        className={`${glassInput} mb-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                        value={eventForm.startTime}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, startTime: e.target.value })
                        }
                      />

                      <input
                        type="time"
                        disabled={isPastDate(eventForm.date)}
                        className={`${glassInput} disabled:opacity-70 disabled:cursor-not-allowed`}
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
                  disabled={eventSubmitting}
                  className={`px-6 py-2 rounded-full text-sm font-semibold border border-[#7A1F2B] ring-1 ring-black/5 transition
                    ${eventSubmitting
                      ? "bg-white/70 text-slate-400 cursor-not-allowed"
                      : "bg-[#7A1F2B] text-white hover:bg-[#651823]"
                    }`}
                >
                  {eventSubmitting
                    ? "Saving..."
                    : editingEventId
                      ? "Update Event"
                      : "Add Event"}
                </button>
                {editingEventId && (
                  <button
                    onClick={resetEvent}
                    className={`${glassBtnMuted} px-6`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* LIST */}
          <div className="flex justify-center">
            <div className={`${glassTableWrap} w-full max-w-7xl`}>
              <div className="px-4 pt-4">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="w-full md:w-auto">
                    <input
                      type="text"
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      placeholder="Search events..."
                      className="w-full sm:w-64 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-full px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    />
                  </div>
                  <div className="w-full md:w-auto flex md:justify-end">
                    <select
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                      className="w-full md:w-auto bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-full px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="all">All</option>
                      <option value="past">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className={glassTableHead}>
                    {[
                      "Title",
                      "Schedule",
                      "Mode",
                      "Price & Slots",
                      "Age",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-center tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedEvents.map((e) => (
                    <tr
                      key={e._id}
                      className="border-b border-slate-200/80 hover:bg-white/70 transition-colors duration-200"
                    >
                      {/* TITLE */}
                      <td className="p-3 text-center font-medium text-sm text-slate-700">
                        <div className="flex flex-col gap-1">
                          <span>{e.title}</span>
                          <span className="text-sm text-[#7A1F2B] font-semibold">
                            {e.code || "-"}
                          </span>
                        </div>
                      </td>

                      {/* SCHEDULE */}
                      <td className="p-3 text-center text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-slate-700">{e.date}</span>
                          <span className="text-slate-600">
                            {format12Hour(e.startTime)} – {format12Hour(e.endTime)}
                          </span>
                          <span className="text-xs text-slate-500 truncate">
                            {e.location || "Location N/A"}
                          </span>
                        </div>
                      </td>

                      {/* MODE */}
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#7A1F2B]/10 text-[#7A1F2B] border border-[#7A1F2B]/20">
                          {e.mode || "-"}
                        </span>
                      </td>

                      {/* PRICING + SLOTS */}
                      <td className="p-3 text-center text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-700 font-semibold">
                            ${e.price || 0}
                          </span>

                          <span className="text-slate-600 text-xs">
                            Cap: {e.capacity || "-"}
                          </span>

                          <span
                            className={`text-xs font-semibold ${e.availability === 0
                              ? "text-rose-600"
                              : e.availability < 5
                                ? "text-amber-600"
                                : "text-emerald-600"
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
                        <div className="grid grid-cols-2 gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/dashboard/manage-events/${e._id}/bookings`)}
                            className="px-2 py-1 text-[11px] rounded-full bg-white/70 border border-slate-200 ring-1 ring-black/5 text-slate-600 hover:bg-white/90"
                          >
                            Bookings
                          </button>

                          <button
                            onClick={() => editEvent(e)}
                            className="px-2 py-1 text-[11px] rounded-full bg-white/70 border border-[#7A1F2B]/40 ring-1 ring-black/5 text-[#7A1F2B] hover:bg-white/90"
                          >
                            Edit Event
                          </button>

                          <button
                            onClick={() => {
                              if (e.bookingUrl) {
                                navigate(`/dashboard/cms/edit/${e.bookingUrl}`);
                              } else {
                                Swal.fire("No Page Linked", "This event does not have a Booking URL set.", "info");
                              }
                            }}
                            className="px-2 py-1 text-[11px] rounded-full bg-white/70 border border-amber-200 ring-1 ring-black/5 text-amber-700 hover:bg-white/90"
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
                            className="px-2 py-1 text-[11px] rounded-full bg-white/70 border border-rose-200 ring-1 ring-black/5 text-rose-600 hover:bg-white/90"
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
          <div className="container mx-auto px-4 mt-6 mb-12 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (eventPage > 1) setEventPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={eventPage <= 1}
                className={`px-4 py-2 rounded-full text-sm border border-white/70 bg-white/70 ring-1 ring-black/5 ${eventPage <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/90"
                  }`}
              >
                Prev
              </button>

              <div className="px-3 py-2 rounded-full text-sm border border-white/70 bg-white/70 ring-1 ring-black/5 text-slate-700">
                Page {eventPage} of {Math.max(1, Math.ceil(eventTotal / EVENT_LIMIT))}
              </div>

              <button
                onClick={() => {
                  const totalPages = Math.max(1, Math.ceil(eventTotal / EVENT_LIMIT));
                  if (eventPage < totalPages) setEventPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={eventPage >= Math.ceil(eventTotal / EVENT_LIMIT)}
                className={`px-4 py-2 rounded-full text-sm border border-white/70 bg-white/70 ring-1 ring-black/5 ${eventPage >= Math.ceil(eventTotal / EVENT_LIMIT)
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

      {/* ================= BLOCKED ================= */}
      {activeTab === "blocked" && (
        <>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowBlockForm((v) => !v)}
              className={glassBtnPrimarySoft}
            >
              {showBlockForm ? "Close Block Form" : "Block Time Slot"}
            </button>
          </div>

          {/* FORM */}
          {showBlockForm && (
            <div ref={blockFormRef} className={`${glassPanel} p-6 mb-8`}>
              <h2 className="text-xl font-semibold text-[#7A1F2B] mb-4">
                {editingBlockId ? "Edit Blocked Slot" : "Block Time Slot"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${glassPanel} p-3`}>
                  <DayPicker
                    mode="single"
                    selected={blockForm.date}
                    onSelect={(d) => setBlockForm({ ...blockForm, date: d })}
                    disabled={{ before: new Date() }}
                  />
                </div>

                <div>
                  <input
                    placeholder="Reason (optional)"
                    className={`${glassInput} mb-3`}
                    value={blockForm.reason}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, reason: e.target.value })
                    }
                  />

                  <label className="flex items-center gap-2 mb-3 font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={manualBlock}
                      disabled={isPastDate(blockForm.date)}
                      onChange={() => setManualBlock(!manualBlock)}
                      className="accent-[#7A1F2B]"
                    />
                    Manual Time Selection
                  </label>

                  {!manualBlock ? (
                    <>
                      <select
                        className={`${glassSelect} mb-3`}
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
                            let slotClass =
                              "border-white/70 bg-white/70 text-slate-700 hover:bg-white/90";
                            if (status === "blocked") {
                              slotClass =
                                "border-[#7A1F2B]/60 bg-[#7A1F2B]/15 text-[#7A1F2B] cursor-not-allowed";
                            } else if (status === "event") {
                              slotClass =
                                "border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed";
                            } else if (past) {
                              slotClass =
                                "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed";
                            } else if (blockForm.startTime === slot) {
                              slotClass = "border-[#7A1F2B] bg-[#7A1F2B] text-white";
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
                        className={`${glassInput} mb-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                        value={blockForm.startTime}
                        onChange={(e) =>
                          setBlockForm({ ...blockForm, startTime: e.target.value })
                        }
                      />
                      <input
                        type="time"
                        disabled={isPastDate(blockForm.date)}
                        className={`${glassInput} disabled:opacity-70 disabled:cursor-not-allowed`}
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
                    disabled={blockSubmitting}
                    className={`px-6 py-2 rounded-full text-sm font-semibold border border-[#7A1F2B] ring-1 ring-black/5 transition
                      ${blockSubmitting
                        ? "bg-white/70 text-slate-400 cursor-not-allowed"
                        : "bg-[#7A1F2B] text-white hover:bg-[#651823]"
                      }`}
                  >
                    {blockSubmitting
                      ? "Saving..."
                      : editingBlockId
                        ? "Update Block"
                        : "Block Slot"}
                  </button>
                  {editingBlockId && (
                    <button
                      onClick={resetBlock}
                      className={`${glassBtnMuted} px-6`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* LIST */}
          <div className="flex justify-center">
            <div className={`${glassTableWrap} w-full max-w-5xl`}>
              <div className="px-4 pt-4">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="w-full md:w-auto">
                    <input
                      type="text"
                      value={blockSearch}
                      onChange={(e) => setBlockSearch(e.target.value)}
                      placeholder="Search blocked slots..."
                      className="w-full sm:w-64 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-full px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    />
                  </div>
                  <div className="w-full md:w-auto flex md:justify-end">
                    <select
                      value={blockFilter}
                      onChange={(e) => setBlockFilter(e.target.value)}
                      className="w-full md:w-auto bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-full px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="all">All</option>
                      <option value="past">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className={glassTableHead}>
                    {["Date", "Time", "Reason", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-center"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedBlocked.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-slate-200/80 hover:bg-white/70 transition-colors duration-200"
                    >
                      <td className="p-3 text-center font-medium">{b.date}</td>
                      <td className="text-center">
                        {format12Hour(b.startTime)} – {format12Hour(b.endTime)}
                      </td>
                      <td className="text-center">{b.reason || "-"}</td>
                      <td className="flex gap-2 justify-center p-2">
                        <button
                          onClick={() => editBlock(b)}
                          className="px-3 py-1 text-xs rounded-full bg-white/70 border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90"
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
                          className="px-3 py-1 text-xs rounded-full bg-white/70 border border-rose-200 ring-1 ring-black/5 text-rose-600 hover:bg-white/90"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}

                  {blocked.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center p-6 text-slate-500">
                        No blocked slots found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-6 mb-12 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (blockPage > 1) setBlockPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={blockPage <= 1}
                className={`px-4 py-2 rounded-full text-sm border border-white/70 bg-white/70 ring-1 ring-black/5 ${blockPage <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/90"
                  }`}
              >
                Prev
              </button>
              <div className="px-3 py-2 rounded-full text-sm border border-white/70 bg-white/70 ring-1 ring-black/5 text-slate-700">
                Page {blockPage} of {Math.max(1, Math.ceil(blockTotal / BLOCK_LIMIT))}
              </div>
              <button
                onClick={() => {
                  const totalPages = Math.max(1, Math.ceil(blockTotal / BLOCK_LIMIT));
                  if (blockPage < totalPages) setBlockPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={blockPage >= Math.ceil(blockTotal / BLOCK_LIMIT)}
                className={`px-4 py-2 rounded-full text-sm border border-white/70 bg-white/70 ring-1 ring-black/5 ${blockPage >= Math.ceil(blockTotal / BLOCK_LIMIT)
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
  );
};

export default ManageEvents;
