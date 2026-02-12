import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiEdit, FiTrash2, FiHeadphones, FiCalendar, FiLink, FiUser, FiX } from "react-icons/fi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicIcon from "@mui/icons-material/Mic"; // Restoring MicIcon
import { useNavigate } from "react-router-dom";
import { FaSpotify, FaApple } from "react-icons/fa";
import { usePodcastThumbnail, SPOTIFY_FALLBACK, APPLE_FALLBACK } from "../../../hooks/usePodcastThumbnail";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Restoring original design tokens
const glassPanel = "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl";
const glassHeader = `${glassPanel} p-6 md:p-8 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]`;
const glassCard = `${glassPanel} p-5 md:p-6 transition-all duration-300 hover:shadow-lg`;
const actionPill =
  "flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium " +
  "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm " +
  "hover:bg-white/90 transition-colors duration-200";

const Podcasts = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: { title: "", host: "", podcastLink: "", releaseDate: "", description: "", thumbnail: null },
  });

  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Changed from viewMode to showForm toggle
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const fetchPodcasts = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/podcasts`);
      const data = await res.json();
      setPodcasts(data.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)));
    } catch (err) {
      console.error("Failed to fetch podcasts", err);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const onSubmit = async (data) => {
    if (!description) {
      Swal.fire("Error", "Description is required", "error");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("host", data.host);
      formData.append("podcastLink", data.podcastLink);
      formData.append("releaseDate", data.releaseDate);
      formData.append("description", description);

      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const url = editingId
        ? `${BACKEND_BASE_URL}/api/podcasts/edit/${editingId}`
        : `${BACKEND_BASE_URL}/api/podcasts/create-podcast`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire(
          editingId ? "Podcast Updated" : "Podcast Scheduled",
          editingId ? "Podcast updated successfully!" : "Podcast scheduled successfully!",
          "success"
        );
        reset();
        setImagePreview(null);
        setDescription("");
        setEditingId(null);
        setShowForm(false);
        fetchPodcasts();
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save podcast", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (podcast) => {
    setEditingId(podcast.slug);
    setValue("title", podcast.title);
    setValue("host", podcast.host);
    setValue("podcastLink", podcast.podcastLink);
    const dateStr = new Date(podcast.releaseDate).toISOString().split('T')[0];
    setValue("releaseDate", dateStr);
    setDescription(podcast.description);

    if (podcast.thumbnail) {
      const imageUrl = podcast.thumbnail.startsWith("http")
        ? podcast.thumbnail
        : `${BACKEND_BASE_URL}${podcast.thumbnail}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setValue("thumbnail", [file]);
  };

  const handleDelete = async (slug) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the podcast!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/podcasts/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        Swal.fire("Deleted!", "Podcast has been deleted.", "success");
        fetchPodcasts();
      } else {
        Swal.fire("Error", "Failed to delete podcast", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete podcast", "error");
    }
  };

  const handleSuspend = async (podcast) => {
    const action = podcast.suspended ? "unsuspend" : "suspend";

    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this podcast?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/podcasts/suspend/${podcast.slug}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = {};
      try {
        data = await res.json();
      } catch (_) { }

      if (res.ok) {
        Swal.fire("Success", `Podcast ${action}ed successfully`, "success");
        fetchPodcasts();
      } else {
        Swal.fire("Error", data.message || `Failed to ${action} podcast`, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", `Failed to ${action} podcast`, "error");
    }
  };

  const PodcastCard = ({ podcast }) => {
    const [expanded, setExpanded] = useState(false);
    const isScheduled = new Date(podcast.releaseDate) > new Date();

    // Use the custom hook
    const thumbnailUrl = usePodcastThumbnail(podcast, BACKEND_BASE_URL);

    const getThumbnailContent = () => {
      if (thumbnailUrl === SPOTIFY_FALLBACK) {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#1DB954] text-white">
            <FaSpotify size={32} />
          </div>
        );
      }
      if (thumbnailUrl === APPLE_FALLBACK) {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#872ec4] text-white">
            <FaApple size={32} />
          </div>
        );
      }

      const uploadedThumbnail = podcast.thumbnail
        ? (podcast.thumbnail.startsWith("http") ? podcast.thumbnail : `${BACKEND_BASE_URL}${podcast.thumbnail}`)
        : null;

      const displayThumbnail = uploadedThumbnail || (thumbnailUrl !== SPOTIFY_FALLBACK && thumbnailUrl !== APPLE_FALLBACK ? thumbnailUrl : null);

      if (displayThumbnail) {
        return (
          <img
            src={displayThumbnail}
            alt={podcast.title}
            className="w-full h-full object-cover"
          />
        );
      }

      return (
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <MicIcon style={{ fontSize: 48 }} />
        </div>
      );
    };

    return (
      <div className={`${glassCard} flex flex-col md:flex-row gap-6`}>
        <div className="md:w-48 md:h-48 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden relative group border border-slate-200">
          {getThumbnailContent()}
          {isScheduled && (
            <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-amber-200">
              SCHEDULED
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{podcast.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <FiUser /> {podcast.host || "Unknown Host"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar /> {new Date(podcast.releaseDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => handleEdit(podcast)}
                className={`${actionPill} text-blue-700`}
              >
                <FiEdit fontSize="small" /> Edit
              </button>
              <button
                onClick={() => handleSuspend(podcast)}
                className={`${actionPill} ${podcast.suspended ? "text-teal-700" : "text-amber-700"}`}
              >
                {podcast.suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={() => handleDelete(podcast.slug)}
                className={`${actionPill} text-red-600`}
              >
                <FiTrash2 fontSize="small" /> Delete
              </button>
            </div>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 blog-description">
            <div dangerouslySetInnerHTML={{ __html: expanded ? podcast.description : podcast.description.slice(0, 150) + (podcast.description.length > 150 ? "..." : "") }} />
            {podcast.description.length > 150 && (
              <button onClick={() => setExpanded(!expanded)} className="text-[#7A1F2B] font-medium text-xs mt-1 hover:underline">
                {expanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          <div className="flex items-center mt-auto pt-4 border-t border-slate-100/50">
            <a href={podcast.podcastLink} target="_blank" rel="noreferrer" className="text-[#7A1F2B] hover:underline text-sm font-medium flex items-center gap-2">
              <FiHeadphones /> Listen to Episode
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-10 px-4 font-montserrat text-slate-700 pb-20">
      <button
        onClick={() => navigate("/dashboard/cms")}
        className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium mb-6"
      >
        <ArrowBackIcon className="w-4 h-4" />
        Back
      </button>

      <div className={glassHeader}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B]">
                <MicIcon />
              </span>
              Podcasts
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-1">
              Manage episodes, schedule releases, and track publishing status.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#7A1F2B] text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-[#7A1F2B]/20 hover:shadow-xl hover:bg-[#8D2431] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            {showForm ? <><FiX /> Cancel</> : <><FiHeadphones /> New Episode</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className={glassPanel + " p-8 relative overflow-hidden"}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7A1F2B] to-amber-500"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              {editingId ? "Edit Episode" : "Schedule New Episode"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Episode Title</label>
                  <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20 focus:border-[#7A1F2B] transition-all"
                    placeholder="e.g. The Journey Begins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Host Name</label>
                  <input
                    type="text"
                    {...register("host")}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20 focus:border-[#7A1F2B] transition-all"
                    placeholder="e.g. Sita"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Release Date (Schedule)</label>
                  <input
                    type="date"
                    {...register("releaseDate", { required: "Date is required" })}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20 focus:border-[#7A1F2B] transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Select a future date to schedule this episode.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Podcast/Audio Link</label>
                  <input
                    type="url"
                    {...register("podcastLink", { required: "Link is required" })}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20 focus:border-[#7A1F2B] transition-all"
                    placeholder="https://spotify.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#7A1F2B] hover:bg-[#7A1F2B]/5 transition-all">
                    <div className="text-center">
                      <span className="text-2xl block mb-1">+</span>
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md border border-slate-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setImagePreview(null); setValue("thumbnail", null) }} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 hover:text-red-600"><FiX size={12} /></button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Show Notes / Description</label>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                  <ReactQuill theme="snow" value={description} onChange={setDescription} className="border-none" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-[#7A1F2B] text-white font-bold rounded-xl shadow-lg hover:bg-[#8D2431] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? "Saving..." : (editingId ? "Update Episode" : "Schedule Episode")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {podcasts.length === 0 ? (
          <div className={glassCard + " text-center py-16"}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-300 mb-4">
              <MicIcon style={{ fontSize: 40 }} />
            </div>
            <h3 className="text-lg font-semibold text-slate-600">No episodes found</h3>
            <p className="text-slate-500">Start by scheduling your first podcast episode.</p>
          </div>
        ) : (
          podcasts.map((podcast) => (
            <PodcastCard key={podcast._id} podcast={podcast} />
          ))
        )}
      </div>
    </div>
  );
};

export default Podcasts;
