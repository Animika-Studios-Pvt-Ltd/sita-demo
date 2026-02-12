import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  Save,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Type,
  Code,
  HelpCircle,
  Ticket,
  Calendar,
  BookOpen,
  Book,
  FileText,
  Mic,
  Settings,
  Check,
} from "lucide-react";

const RESERVED_SLUGS = [
  "about", "ayurveda-nutrition", "kosha-counseling", "release-karmic-patterns",
  "soul-curriculum", "yoga-therapy", "corporate-training", "group-sessions",
  "private-sessions", "shakthi-leadership", "teacher-training", "podcasts",
  "privacy-policy", "disclaimer", "contact", "consult-sita", "engage-sita",
  "study-with-sita", "publications", "store", "books", "cart", "checkout",
  "ebook", "my-orders", "blogs", "articles", "booking", "my-bookings",
  "events", "my-profile", "auth", "admin", "login", "register", "cms"
];

// Import form components
import HeroForm from "./forms/HeroForm";
import FaqForm from "./forms/FaqForm";
import HtmlForm from "./forms/HtmlForm";
import LinksForm from "./forms/LinksForm";
import BookingForm from "./forms/BookingForm";
import DynamicContentForm from "./forms/DynamicContentForm";
/* ================= GLASS BUTTON STYLES ================= */
const glassBtn =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/70 backdrop-blur-xl " +
  "border-1 border-[#7A1F2B] " +
  "ring-1 ring-black/5 " +
  "text-slate-700 " +
  "hover:bg-white/90 transition-colors duration-200 ";

const glassBtnPrimary =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold " +
  "bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl " +
  "border-1 border-[#7A1F2B] " +
  "ring-1 ring-black/5 " +
  "text-[#7A1F2B] " +
  "shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] " +
  "hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] " +
  "transition-colors duration-200 ";

const glassBtnWarning =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/70 backdrop-blur-xl " +
  "border-1 border-[#7A1F2B] " +
  "ring-1 ring-black/5 " +
  "text-amber-700 " +
  "hover:bg-white/90 transition-colors duration-200 ";

const glassIconBtn =
  "p-2 rounded-full " +
  "bg-white/70 backdrop-blur-xl " +
  "border border-white/70 " +
  "ring-1 ring-black/5 " +
  "text-slate-600 " +
  "hover:bg-white/90 hover:text-[#7A1F2B] " +
  "transition-colors duration-200";

const glassDeleteBtn =
  "p-2 rounded-full " +
  "bg-white/70 backdrop-blur-xl " +
  "border border-white/70 " +
  "ring-1 ring-black/5 " +
  "text-red-600 " +
  "hover:bg-white/90 transition-colors duration-200";

export default function EnhancedCmsEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageSlug, setPageSlug] = useState(slug || "");
  const [pageStatus, setPageStatus] = useState("draft");
  const [createdFrom, setCreatedFrom] = useState("manage-pages");
  const [sections, setSections] = useState(() => {
    // Should be empty initially, but will be populated if new page
    return slug ? [] : [{
      id: `section-hero-${Date.now()}`,
      key: "hero",
      content: getDefaultContent("hero"),
    }];
  });

  // Navigation & Metadata State
  const [showSettings, setShowSettings] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    addToHeader: false,
    addToFooter: false,
    headerPosition: 0,
    headerRow: "bottom", // "top" or "bottom"
    headerParent: "", // "" for root, or slug/key of parent
    isDropdownParent: false, // NEW
    footerPosition: 0,
    order: 0,
    navigationTitle: "", // NEW
  });

  const [dropdownParents, setDropdownParents] = useState([]); // NEW: List of potential parent dropdowns

  const [loading, setLoading] = useState(!!slug);
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState(() => {
    // If new page, expand the initial hero section
    return slug ? new Set() : new Set(sections?.map(s => s.id) || []);
  });

  /* ================= SLUG CHECK ================= */
  const [slugStatus, setSlugStatus] = useState("idle"); // idle, checking, available, taken, error

  useEffect(() => {
    // Only check for NEW pages
    if (slug || !pageSlug.trim()) {
      setSlugStatus("idle");
      return;
    }

    const checkSlug = async () => {
      // 1. Check Reserved Slugs
      if (RESERVED_SLUGS.includes(pageSlug)) {
        setSlugStatus("reserved");
        return;
      }

      setSlugStatus("checking");
      try {
        await api.get(`/api/cms/admin/${pageSlug}`);
        // If 200 OK -> Page exists -> Taken
        setSlugStatus("taken");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // 404 -> Page not found -> Available
          setSlugStatus("available");
        } else {
          console.error("Slug check error:", err);
          setSlugStatus("error");
        }
      }
    };

    const timer = setTimeout(checkSlug, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [pageSlug, slug]);

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/api/cms/admin/${slug}`)
      .then((res) => {
        // Handle both response formats (res.data or res directly)
        const page = res.data || res;
        if (!page) {
          console.error("❌ No page data received");
          Swal.fire("Error", "Failed to load page data", "error");
          setLoading(false);
          return;
        }
        if (!page.sections) {
          console.error("❌ No sections in page data:", page);
          Swal.fire("Warning", "Page has no sections", "warning");
          setSections([]);
          setLoading(false);
          return;
        }
        let sectionsArray = (page.sections || []).map((s, idx) => ({
          id: `section-${idx}-${Date.now()}`,
          key: s.key,
          content: s.content,
        }));

        // ✅ ENSURE HERO SECTION EXISTS
        if (!sectionsArray.some(s => s.key === 'hero')) {
          const heroSection = {
            id: `section-hero-${Date.now()}`,
            key: 'hero',
            content: getDefaultContent('hero'),
          };
          sectionsArray = [heroSection, ...sectionsArray];
        }

        setSections(sectionsArray);
        setPageStatus(page.status || "draft");
        setCreatedFrom(page.createdFrom || "manage-pages");

        // Set Navigation Details
        setDetails({
          title: page.title || "",
          addToHeader: page.addToHeader || false,
          addToFooter: page.addToFooter || false,
          headerPosition: page.headerPosition || 0,
          headerRow: page.headerRow || "bottom",
          headerParent: page.headerParent || "",
          isDropdownParent: page.isDropdownParent || false,
          footerPosition: page.footerPosition || 0,
          order: page.order || 0,
          navigationTitle: page.navigationTitle || "", // NEW
        });

        // ✅ DEFAULT EXPAND HERO
        const initialExpanded = new Set(sectionsArray.map((s) => s.id));
        setExpandedSections(initialExpanded);

        setLoading(false);
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          err.response?.data?.message || err.message || "Failed to load page",
          "error"
        );
        setLoading(false);
      });

    // ✅ FETCH DROPDOWN PARENTS
    api.get("/api/cms/navigation")
      .then(res => {
        const navPages = res.data || [];
        // Filter pages that are marked as parents
        const parents = navPages.filter(p => p.isDropdownParent && p.slug !== slug); // Exclude self
        setDropdownParents(parents);
      })
      .catch(err => console.error("Failed to load dropdown parents", err));

  }, [slug]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // 1. Prevent moving the Hero section (which is at index 0)
    if (result.source.index === 0) {
      return;
    }

    // 2. Prevent dropping anything into index 0 (replacing/pushing Hero)
    if (result.destination.index === 0) {
      return;
    }

    const items = Array.from(sections);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setSections(items);
  };

  const moveSection = (index, direction) => {
    // direction: -1 for up, 1 for down
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= sections.length) return;

    // Constraints:
    // 1. Cannot move Hero (index 0)
    if (index === 0) return;

    // 2. Cannot move something INTO index 0 (above Hero)
    if (newIndex === 0) return;

    const items = Array.from(sections);
    const [movedItem] = items.splice(index, 1);
    items.splice(newIndex, 0, movedItem);
    setSections(items);
  };

  const addSection = (type) => {
    // Prevent adding a second Hero section
    if (type === "hero" && sections.some((s) => s.key === "hero")) {
      Swal.fire("Action Blocked", "Only one Hero section is allowed.", "warning");
      return;
    }

    const newSection = {
      id: `section-${Date.now()}`,
      key: type,
      content: getDefaultContent(type),
    };

    // ✅ FORCE HERO TO TOP
    if (type === "hero") {
      setSections([newSection, ...sections]);
    } else {
      setSections([...sections, newSection]);
    }

    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const deleteSection = (id) => {
    // 1. Prevent deleting Hero section
    const section = sections.find(s => s.id === id);
    if (section && section.key === 'hero') {
      Swal.fire("Action Blocked", "The Hero section cannot be deleted.", "warning");
      return;
    }

    Swal.fire({
      title: "Delete this section?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setSections(sections.filter((s) => s.id !== id));
      }
    });
  };

  const updateSection = (id, field, value) => {
    setSections(
      sections.map((s) => {
        if (s.id === id) {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [parent, child] = parts;
              const updated = {
                ...s,
                content: {
                  ...s.content,
                  [parent]: {
                    ...(s.content[parent] || {}),
                    [child]: value,
                  },
                },
              };
              return updated;
            }
            else if (parts.length === 3) {
              const [parent, child, grandchild] = parts;
              const updated = {
                ...s,
                content: {
                  ...s.content,
                  [parent]: {
                    ...(s.content[parent] || {}),
                    [child]: {
                      ...(s.content[parent]?.[child] || {}),
                      [grandchild]: value,
                    },
                  },
                },
              };
              return updated;
            }
          }

          const updated = {
            ...s,
            content: { ...s.content, [field]: value },
          };
          return updated;
        }
        return s;
      })
    );
  };

  const toggleSection = (id) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  async function save(status = "published") {
    if (!pageSlug.trim()) {
      Swal.fire("Error", "Page Link is required", "error");
      return;
    }

    // ---------------------------------------------------------
    // VALIDATION: HERO SECTION
    // ---------------------------------------------------------
    const heroSection = sections.find(s => s.key === "hero");
    if (heroSection) {
      // 1. Image is ALWAYS required
      if (!heroSection.content.backgroundImage) {
        Swal.fire("Validation Error", "Hero Banner Image is required.", "warning");
        return;
      }

      // 2. CTA Button is REQUIRED if createdFrom === 'manage-events'
      if (createdFrom === "manage-events") {
        if (!heroSection.content.primaryCta?.label?.trim()) {
          Swal.fire("Validation Error", "CTA Button Label is required for Event Pages.", "warning");
          return;
        }
        // If you also want to enforce a link/action:
        // if (!heroSection.content.primaryCta?.href && !heroSection.content.primaryCta?.eventId) {
        //   Swal.fire("Validation Error", "CTA Button must have a link or event.", "warning");
        //   return;
        // }
      }
    }

    try {
      // Keep as array to preserve multiple sections with same key
      const sectionsArray = sections.map((s) => ({
        key: s.key,
        content: s.content,
      }));

      const payload = {
        slug: pageSlug,
        sections: sectionsArray, // Send as array, not object
        status,
        ...details,
        // Sanitization
        headerPosition: Number(details.headerPosition) || 0,
        footerPosition: Number(details.footerPosition) || 0,
        order: Number(details.order) || 0,
      };

      let response;
      if (slug) {
        // Edit existing page
        response = await api.put(`/api/cms/pages/${slug}`, payload);
      } else {
        // Create new page
        response = await api.post("/api/cms/pages", payload);
      }

      Swal.fire({
        icon: "success",
        title: status === "published" ? "Published!" : "Saved as Draft",
        html: `
        <p>Page saved successfully!</p>
        <p class="text-sm text-gray-600 mt-2">Sections saved: ${sectionsArray.length}</p>
      `,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/dashboard/manage-pages"));
    } catch (err) {
      console.error("❌ Save error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Failed to save page",
        "error"
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-montserrat text-slate-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A1F2B] mx-auto mb-4"></div>
          <div className="text-lg text-slate-600">Loading page...</div>
        </div>
      </div>
    );
  }



  return (
    <div className="font-montserrat text-slate-700">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">

            {/* LEFT */}
            <div className="flex-1 max-w-md">
              <label className="block text-md font-medium text-slate-700 mb-1">
                Event Page Link
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) =>
                    setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                  disabled={!!slug}
                  className={`w-full px-4 py-2 rounded-lg bg-white/70 backdrop-blur-xl border ring-1 ring-black/5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 ${slugStatus === "taken" || slugStatus === "reserved"
                    ? "border-red-400 focus:ring-red-200"
                    : slugStatus === "available"
                      ? "border-emerald-400 focus:ring-emerald-200"
                      : "border-white/70"
                    }`}
                  placeholder="example-about-us"
                />

                {/* STATUS INDICATOR */}
                {!slug && pageSlug && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold">
                    {slugStatus === "checking" && (
                      <span className="text-slate-400">Checking...</span>
                    )}
                    {slugStatus === "available" && (
                      <span className="text-emerald-600 flex items-center gap-1">
                        Available
                      </span>
                    )}
                    {(slugStatus === "taken" || slugStatus === "reserved") && (
                      <span className="text-red-500 flex items-center gap-1">
                        {slugStatus === "reserved" ? "Reserved" : "Taken"}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* HELPER TEXT */}
              {slugStatus === "taken" && !slug && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  This link is already in use. Please choose another.
                </p>
              )}
              {slugStatus === "reserved" && !slug && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  This page name is reserved for system use.
                </p>
              )}
              {slugStatus === "available" && !slug && (
                <p className="text-xs text-emerald-600 mt-1 ml-1">
                  This link is available!
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className={glassBtn} onClick={() => navigate("/dashboard/manage-pages")}>
                Cancel
              </button>

              <button className={glassBtn} onClick={() => setShowSettings(!showSettings)}>
                <Settings size={16} />
                Settings
              </button>

              {/* <button className={glassBtn} onClick={() => setPreviewMode(!previewMode)}>
                <Eye size={16} />
                {previewMode ? "Edit Mode" : "Preview"}
              </button> */}

              {(!slug || pageStatus === "draft") && (
                <button className={glassBtnWarning} onClick={() => save("draft")}>
                  Save Draft
                </button>
              )}

              <button className={glassBtnPrimary} onClick={() => save("published")}>
                <Save size={16} />
                Publish
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!previewMode ? (
          <>
            {/* Page Settings Panel - Redesigned */}
            {showSettings && (
              <div className="mb-8 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/50 ring-1 ring-black/5 shadow-xl animate-in fade-in slide-in-from-top-4 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Settings size={20} className="text-[#7A1F2B]" />
                    Page Settings
                  </h3>
                  <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-[#7A1F2B] transition-colors">
                    Close
                  </button>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BOX 1: Header Navigation */}
                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${details.addToHeader ? 'bg-[#7A1F2B] text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <Settings size={18} />
                        </div>
                        <h4 className="font-bold text-slate-700 text-lg">Header Navigation</h4>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={details.addToHeader}
                            onChange={(e) => setDetails({ ...details, addToHeader: e.target.checked })}
                          />
                          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${details.addToHeader ? 'bg-[#7A1F2B]' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${details.addToHeader ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                          <span className="font-medium text-slate-600 group-hover:text-[#7A1F2B] transition-colors">
                            {details.addToHeader ? "Enabled" : "Disabled"}
                          </span>
                        </label>

                        {details.addToHeader && (
                          <div className="animate-in fade-in slide-in-from-top-2 space-y-4 pt-2 border-t border-slate-200/50">

                            {/* Row Selection */}
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDetails({ ...details, headerRow: "top" })}
                                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-xl border transition-all ${details.headerRow === "top"
                                    ? 'bg-white border-[#7A1F2B] text-[#7A1F2B] shadow-sm'
                                    : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                  Top Row
                                </button>
                                <button
                                  onClick={() => setDetails({ ...details, headerRow: "bottom" })}
                                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-xl border transition-all ${details.headerRow === "bottom"
                                    ? 'bg-white border-[#7A1F2B] text-[#7A1F2B] shadow-sm'
                                    : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                  Main Row
                                </button>
                              </div>
                            </div>

                            {/* Dropdown Logic (only for Main Row) */}
                            {details.headerRow === "bottom" && (
                              <div className="space-y-3">
                                {/* Create New Dropdown Toggle */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={details.isDropdownParent}
                                    onChange={(e) => setDetails({ ...details, isDropdownParent: e.target.checked, headerParent: "" })}
                                    className="rounded border-slate-300 text-[#7A1F2B] focus:ring-[#7A1F2B]"
                                  />
                                  <span className="text-sm font-medium text-slate-700">Make this a Dropdown Menu?</span>
                                </label>

                                {/* Dropdown Menu Title Input */}
                                {details.isDropdownParent && (
                                  <div className="animate-in fade-in slide-in-from-top-1 ml-6 mt-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dropdown Menu Title</label>
                                    <input
                                      type="text"
                                      value={details.navigationTitle}
                                      onChange={(e) => setDetails({ ...details, navigationTitle: e.target.value })}
                                      placeholder="e.g. Services"
                                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-[#7A1F2B]"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                      This text will be the clickable label in the navigation bar.
                                    </p>
                                  </div>
                                )}

                                {/* OR Select Parent (if not a dropdown itself) */}
                                {!details.isDropdownParent && (
                                  <div className="animate-in fade-in slide-in-from-top-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parent Dropdown</label>
                                    <select
                                      value={details.headerParent || ""}
                                      onChange={(e) => setDetails({ ...details, headerParent: e.target.value })}
                                      className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-[#7A1F2B]"
                                    >
                                      <option value="">None (Root Level)</option>
                                      <option value="sitaFactor">The Sita Factor</option>
                                      <option value="workshops">Workshops</option>
                                      {/* Dynamic Parents */}
                                      {dropdownParents.map(parent => (
                                        <option key={parent.slug} value={parent.slug}>
                                          {parent.navigationTitle || parent.title || parent.slug}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOX 2: Footer Navigation */}
                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${details.addToFooter ? 'bg-[#7A1F2B] text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <Settings size={18} />
                        </div>
                        <h4 className="font-bold text-slate-700 text-lg">Footer Navigation</h4>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${details.addToFooter ? 'bg-[#7A1F2B]' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${details.addToFooter ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                          <span className="font-medium text-slate-600 group-hover:text-[#7A1F2B] transition-colors">
                            {details.addToFooter ? "Enabled" : "Disabled"}
                          </span>
                          <input type="checkbox" className="hidden" checked={details.addToFooter} onChange={(e) => setDetails({ ...details, addToFooter: e.target.checked })} />
                        </label>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          Enabling this will add the page link to the "Resources" or "Quick Links" section of the site footer.
                        </p>
                      </div>
                    </div>

                    {/* BOX 3: Global Order */}
                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all">
                      <h4 className="font-bold text-slate-700 text-lg mb-4">Global Order</h4>
                      <div className="relative">
                        <input
                          type="number"
                          value={details.order}
                          onChange={(e) => setDetails({ ...details, order: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded">
                          Index
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Lower numbers appear first. Negative numbers allowed.
                      </p>
                    </div>

                    {/* BOX 4: Display Title */}
                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all">
                      <h4 className="font-bold text-slate-700 text-lg mb-4">Display Title</h4>
                      <div className="relative">
                        <input
                          type="text"
                          value={details.navigationTitle}
                          onChange={(e) => setDetails({ ...details, navigationTitle: e.target.value })}
                          placeholder={pageSlug || "Page Title"}
                          className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 font-medium focus:outline-none focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B] ${details.addToHeader && details.headerRow === 'top' && (details.navigationTitle || "").length > 7 ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500" : "border-slate-200"}`}
                        />
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded ${details.addToHeader && details.headerRow === 'top' && (details.navigationTitle || "").length > 7 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                          {(details.navigationTitle || "").length} / {details.addToHeader && details.headerRow === 'top' ? "7" : "Any"}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Overrides the page name in menus. {details.addToHeader && details.headerRow === 'top' && "Top Row items are limited to 7 characters."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Section Toolbar */}
            <div className="mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5">
              <h3 className="text-md font-semibold text-[#7A1F2B]">
                Add Section
              </h3>

              <p className="mt-1 mb-4 text-sm text-slate-600 leading-relaxed">
                Click a section type below to add it to your page.
                You can add multiple sections and customize each one after adding.
              </p>

              <div className="flex flex-wrap gap-2">
                <AddSectionButton
                  icon={Type}
                  label="Hero"
                  onClick={() => addSection("hero")}
                  disabled={sections.some(s => s.key === "hero")}
                />
                <AddSectionButton icon={Code} label="HTML" onClick={() => addSection("html")} />
                <AddSectionButton icon={HelpCircle} label="FAQ" onClick={() => addSection("faq")} />
                <AddSectionButton icon={Calendar} label="Events" onClick={() => addSection("events")} />
                <AddSectionButton icon={BookOpen} label="Blogs" onClick={() => addSection("blogs")} />
                <AddSectionButton icon={Book} label="Books" onClick={() => addSection("books")} />
                <AddSectionButton icon={FileText} label="Articles" onClick={() => addSection("articles")} />
                <AddSectionButton icon={Mic} label="Podcasts" onClick={() => addSection("podcasts")} />
                {/* <AddSectionButton icon={LinkIcon} label="Links" onClick={() => addSection("links")} /> */}
                {/* <AddSectionButton icon={Ticket} label="Booking" onClick={() => addSection("booking")} /> */}
              </div>
            </div>

            {/* Sections List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-white/70 ring-1 ring-black/5 transition-all ${snapshot.isDragging
                              ? "shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] scale-[1.02]"
                              : "shadow-sm"
                              }`}
                          >
                            <SectionCard
                              section={section}
                              index={index}
                              totalSections={sections.length}
                              dragHandleProps={provided.dragHandleProps}
                              onDelete={() => deleteSection(section.id)}
                              onUpdate={(field, value) => updateSection(section.id, field, value)}
                              isExpanded={expandedSections.has(section.id)}
                              onToggle={() => toggleSection(section.id)}
                              onMove={moveSection}
                              pageSlug={pageSlug}
                              createdFrom={createdFrom}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Empty State */}
            {sections.length === 0 && (
              <div className="text-center py-16 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/70 ring-1 ring-black/5">
                <Code size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 text-lg font-medium mb-2">No sections yet</p>
                <p className="text-slate-500">Click "Add Section" above to get started building your page</p>
              </div>
            )}
          </>
        ) : (
          <PreviewPanel sections={sections} />
        )}
      </div>
    </div >
  );
}

function AddSectionButton({ icon: Icon, label, onClick, disabled }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    onClick();

    // Reset animation state after a short delay to show the effect
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAdding}
      className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ring-1 ring-black/5 transition-all duration-300
        ${disabled
          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          : isAdding
            ? "bg-[#7A1F2B] text-white border-[#7A1F2B] scale-95 shadow-inner"
            : "bg-white/70 backdrop-blur-xl border-white/70 text-slate-700 hover:bg-white/90 hover:text-[#7A1F2B] hover:shadow-md hover:-translate-y-0.5"
        }`}
    >
      <div className={`flex items-center gap-2 transition-all duration-300 ${isAdding ? "opacity-0 translate-y-4 fixed" : "opacity-100 translate-y-0"}`}>
        <Icon size={16} />
        {label}
      </div>

      {isAdding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}

// Section Card Component
function SectionCard({ section, index, totalSections, dragHandleProps, onDelete, onUpdate, isExpanded, onToggle, onMove, pageSlug, createdFrom }) {
  const getSectionIcon = (key) => {
    const icons = {
      hero: Type,
      faq: HelpCircle,
      html: Code,
      links: LinkIcon,
      booking: Ticket,
      events: Calendar,
      blogs: BookOpen,
      books: Book,
      articles: FileText,
      podcasts: Mic,
    };
    const Icon = icons[key] || Type;
    return <Icon size={20} />;
  };

  const getSectionColor = () => {
    return "text-[#7A1F2B] bg-white/70 border border-white/70 ring-1 ring-black/5";
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-xl rounded-t-2xl border-b border-white/70">
        <div
          {...dragHandleProps}
          className={`cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors duration-200 ${section.key === "hero" ? "invisible pointer-events-none" : ""}`}
        >
          <GripVertical size={20} />
        </div>

        {section.key !== "hero" && (
          <div className="flex flex-col gap-1 mr-2">
            <button
              onClick={() => onMove(index, -1)}
              disabled={index <= 1} // Cannot move up if index is 1 (index 0 is Hero)
              className={`p-0.5 rounded hover:bg-gray-200 transition ${index <= 1 ? "opacity-30 cursor-not-allowed" : ""}`}
              title="Move Up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => onMove(index, 1)}
              disabled={index >= totalSections - 1}
              className={`p-0.5 rounded hover:bg-gray-200 transition ${index >= totalSections - 1 ? "opacity-30 cursor-not-allowed" : ""}`}
              title="Move Down"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        )}

        <div className={`p-2 rounded-lg ${getSectionColor(section.key)}`}>
          {getSectionIcon(section.key)}
        </div>

        <span className="font-semibold text-slate-800 capitalize flex-1">
          {section.key} Section
        </span>

        <button
          onClick={onToggle}
          className={glassIconBtn}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {section.key !== "hero" && (
          <button
            onClick={onDelete}
            className={glassDeleteBtn}
            title="Delete Section"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-6 bg-white/70 backdrop-blur-xl">
          {section.key === "hero" && (
            <HeroForm content={section.content} onUpdate={onUpdate} pageSlug={pageSlug} createdFrom={createdFrom} />
          )}
          {section.key === "faq" && (
            <FaqForm content={section.content} onUpdate={onUpdate} />
          )}
          {section.key === "html" && (
            <HtmlForm content={section.content} onUpdate={onUpdate} />
          )}
          {section.key === "links" && (
            <LinksForm content={section.content} onUpdate={onUpdate} />
          )}
          {section.key === "booking" && (
            <BookingForm content={section.content} onUpdate={onUpdate} pageSlug={pageSlug} />
          )}
          {["events", "blogs", "books", "articles", "podcasts"].includes(section.key) && (
            <DynamicContentForm content={section.content} onUpdate={onUpdate} type={section.key} />
          )}
        </div>
      )}
    </div>
  );
}

// Default Content Generator
function getDefaultContent(type) {
  const defaults = {
    hero: {
      title: "Welcome to Our Platform",
      subtitle: "Build amazing things with our tools",
      primaryCta: { label: "Get Started", href: "/signup" },
      secondaryCta: { label: "Learn More", href: "/about" },
      style: {
        backgroundColor: "#2563eb",
        textColor: "#ffffff",
        padding: "py-20",
      },
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "What is this platform about?", a: "This platform helps you achieve your goals." },
        { q: "How do I get started?", a: "Simply sign up and follow the onboarding process." },
      ],
    },
    html: {
      content:
        "<div><h2>Custom HTML Content</h2><p>Add your HTML content here. Use the editor toolbar to format text, add images, and more.</p></div>",
      css: "",
      style: {
        backgroundColor: "#ffffff",
        padding: "py-12",
        maxWidth: "max-w-7xl",
      },
    },
    links: {
      title: "Quick Links",
      items: [
        { label: "Documentation", href: "/docs" },
        { label: "Support", href: "/support" },
        { label: "Blog", href: "/blog" },
        { label: "Blog", href: "/blog" },
      ],
    },
    booking: {
      eventId: "",
      buttonText: "Book Now",
      alignment: "center"
    },
    events: { title: "Upcoming Events", count: 3 },
    blogs: { title: "Latest Blogs", count: 3 },
    books: { title: "Recent Books", count: 3 },
    articles: { title: "Featured Articles", count: 3 },
    podcasts: { title: "Recent Podcasts", count: 3 },
  };
  return defaults[type] || {};
}

// Preview Panel Component
function PreviewPanel({ sections }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/70 ring-1 ring-black/5 overflow-hidden">
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/70 p-4 text-center">
        <Eye size={24} className="inline-block mr-2 text-[#7A1F2B]" />
        <span className="font-semibold text-[#7A1F2B]">Preview Mode</span>
        <p className="text-sm text-slate-500 mt-1">This is how your data is structured</p>
      </div>

      <div className="p-6">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6 pb-6 border-b last:border-b-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase font-semibold text-slate-500 bg-white/70 border border-white/70 ring-1 ring-black/5 px-2 py-1 rounded">
                {section.key}
              </span>
            </div>
            <pre className="bg-white/80 p-4 rounded-lg text-sm overflow-auto border border-white/70 ring-1 ring-black/5 text-slate-700">
              {JSON.stringify(section.content, null, 2)}
            </pre>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <Code size={48} className="mx-auto mb-4 opacity-50" />
            <p>No sections to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
