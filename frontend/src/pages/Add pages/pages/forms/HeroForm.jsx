import React, { useState, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import { api } from "../../../../utils/api";
import axios from "axios";

export default function HeroForm({ content, onUpdate, pageSlug }) {
  const [uploadingBg, setUploadingBg] = useState(false);
  const [events, setEvents] = useState([]);

  // Fetch events for the CTA dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/events`);
        setEvents(res.data);

        // Auto-link event logic
        if (pageSlug && !content.primaryCta?.eventId) {
          const match = res.data.find(e => e.bookingUrl === pageSlug);
          if (match) {
            onUpdate("primaryCta.eventId", match._id);
          }
        }

      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchEvents();
  }, [pageSlug]); // Depend on pageSlug so it re-runs if slug changes

  // Upload background image
  const handleBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBg(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.upload("/api/cms/upload", formData);
      if (response.url) {
        onUpdate("backgroundImage", response.url);
      }
    } catch (error) {
      alert("❌ Upload failed: " + error.message);
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-[#7A1F2B] border-b border-white/70 pb-2">Hero / Banner Details</h3>

      {/* 1. Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Banner Image
        </label>
        {content.backgroundImage ? (
          <div className="relative">
            <img
              src={content.backgroundImage}
              alt="Background"
              className="w-full h-48 object-cover rounded-xl border border-white/70 ring-1 ring-black/5"
            />
            <button
              type="button"
              onClick={() => onUpdate("backgroundImage", "")}
              className="absolute top-2 right-2 bg-[#7A1F2B] text-white p-2 rounded-full hover:bg-[#5d1620] transition shadow-sm"
              title="Remove Image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-white/70 ring-1 ring-black/5 rounded-xl cursor-pointer hover:bg-white/90 transition-colors bg-white/70 backdrop-blur-xl">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-600">
              {uploadingBg ? "Uploading..." : "Click to Upload Banner Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              className="hidden"
              disabled={uploadingBg}
            />
          </label>
        )}
      </div>

      {/* 2. Event Title */}
      <FormField
        label="Event Title"
        value={content.title || ""}
        onChange={(val) => onUpdate("title", val)}
        placeholder="Enter event title"
        helpText="The main heading for your hero section."
      />

      {/* 3. Description */}
      <FormField
        label="Description"
        value={content.subtitle || ""}
        onChange={(val) => onUpdate("subtitle", val)}
        placeholder="Enter a brief description..."
        multiline
        rows={4}
        helpText="A short description or subtitle displayed below the title."
      />

      {/* 4. CTA Button (Book Now) */}
      <div className="pt-4 border-t border-white/70">
        <h4 className="text-md font-medium text-slate-700 mb-3">CTA Button (Book Now)</h4>

        <div className="space-y-4">
          {/* Label */}
          <FormField
            label="Button Label"
            value={content.primaryCta?.label || "Book Now"}
            onChange={(val) => onUpdate("primaryCta.label", val)}
            placeholder="Book Now"
          />

          {/* Event Selection */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Event (for Booking)
            </label>
            <select
              value={content.primaryCta?.eventId || ""}
              onChange={(e) => onUpdate("primaryCta.eventId", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">-- Choose an Event --</option>
              {events.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.title} ({new Date(e.date).toLocaleDateString()})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Selecting an event will open the Booking Modal when clicked.
            </p>
          </div> */}

          {/* Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Button Color"
              value={content.primaryCta?.bgColor || "#3b82f6"}
              onChange={(val) => onUpdate("primaryCta.bgColor", val)}
            />
            <ColorPicker
              label="Text Color"
              value={content.primaryCta?.textColor || "#ffffff"}
              onChange={(val) => onUpdate("primaryCta.textColor", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Form Field
function FormField({ label, value, onChange, placeholder, multiline = false, rows = 3, helpText }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 resize-y text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 text-sm"
        />
      )}
      {helpText && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}

// Color Picker Component
function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 rounded cursor-pointer border border-white/70 ring-1 ring-black/5 p-1 bg-white/70"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 font-mono text-sm text-slate-700"
        />
      </div>
    </div>
  );
}
