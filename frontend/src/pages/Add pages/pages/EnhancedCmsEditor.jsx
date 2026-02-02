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
} from "lucide-react";

// Import form components
import HeroForm from "./forms/HeroForm";
import FaqForm from "./forms/FaqForm";
import HtmlForm from "./forms/HtmlForm";
import LinksForm from "./forms/LinksForm";
import BookingForm from "./forms/BookingForm";
/* ================= GLASS BUTTON STYLES ================= */
const glassBtn =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/20 backdrop-blur-md " +
  "border border-slate-500/60 " +
  "ring-1 ring-inset ring-white/40 " +
  "text-slate-700 " +
  "hover:bg-blue-50/70 hover:border-blue-300 hover:text-blue-700 " +
  "transition ";

const glassBtnPrimary =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/20 backdrop-blur-md " +
  "border border-blue-700/70 " +
  "ring-1 ring-inset ring-blue-200/70 " +
  "text-blue-700 " +
  "hover:bg-blue-100/80 hover:text-blue-800 " +
  "transition ";

const glassBtnWarning =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium " +
  "bg-white/20 backdrop-blur-md " +
  "border border-amber-700/70 " +
  "ring-1 ring-inset ring-amber-200/60 " +
  "text-amber-700 " +
  "hover:bg-amber-100/80 hover:text-amber-800 " +
  "transition ";

const glassIconBtn =
  "p-2 rounded-full " +
  "bg-white/20 backdrop-blur-md " +
  "border border-slate-500/60 " +
  "ring-1 ring-inset ring-white/40 " +
  "text-slate-600 " +
  "hover:bg-blue-50/70 hover:text-blue-700 " +
  "transition";

const glassDeleteBtn =
  "p-2 rounded-full " +
  "bg-rose-50/80 backdrop-blur-sm " +
  "border border-[1.5px] border-rose-300 " +
  "ring-1 ring-inset ring-rose-200 " +
  "text-rose-700 " +
  "hover:bg-rose-100 transition";

export default function EnhancedCmsEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageSlug, setPageSlug] = useState(slug || "");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(!!slug);
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());

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
        const sectionsArray = (page.sections || []).map((s, idx) => ({
          id: `section-${idx}-${Date.now()}`,
          key: s.key,
          content: s.content,
        }));
        setSections(sectionsArray);
        setExpandedSections(new Set(sectionsArray.map((s) => s.id)));
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
  }, [slug]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setSections(items);
  };

  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      key: type,
      content: getDefaultContent(type),
    };
    setSections([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const deleteSection = (id) => {
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
      };

      const response = await api.post("/api/cms/pages", payload);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border border-slate-400/70 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">

            {/* LEFT */}
            <div className="flex-1 max-w-md">
              <label className="block text-md font-medium text-black-600 mb-1">
                Event Page Link
              </label>
              <input
                type="text"
                value={pageSlug}
                onChange={(e) =>
                  setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                disabled={!!slug}
                className="
            w-full px-4 py-2 rounded-lg
            bg-white/80 backdrop-blur
            border border-slate-300/60
            text-slate-800
            focus:outline-none focus:ring-2 focus:ring-blue-300
          "
                placeholder="example-about-us"
              />
              {slug && (
                <p className="text-xs text-slate-500 mt-1">
                  Page URL: /{slug}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className={glassBtn} onClick={() => navigate("/dashboard/manage-pages")}>
                Cancel
              </button>

              {/* <button className={glassBtn} onClick={() => setPreviewMode(!previewMode)}>
                <Eye size={16} />
                {previewMode ? "Edit Mode" : "Preview"}
              </button> */}

              <button className={glassBtnWarning} onClick={() => save("draft")}>
                Save Draft
              </button>

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
            {/* Add Section Toolbar */}
            <div className="mb-6 p-4 rounded-2xl bg-white/70 backdrop-blur border border-slate-300/70">
              <h3 className="text-md font-semibold text-black-700">
                Add Section
              </h3>

              <p className="
  mt-1 mb-4
  text-sm text-slate-600
  leading-relaxed
">
                Click a section type below to add it to your page.
                You can add multiple sections and customize each one after adding.
              </p>

              <div className="flex flex-wrap gap-2">
                <AddSectionButton icon={Type} label="Hero" onClick={() => addSection("hero")} />
                <AddSectionButton icon={HelpCircle} label="FAQ" onClick={() => addSection("faq")} />
                <AddSectionButton icon={Code} label="HTML" onClick={() => addSection("html")} />
                <AddSectionButton icon={LinkIcon} label="Links" onClick={() => addSection("links")} />
                <AddSectionButton icon={Ticket} label="Booking" onClick={() => addSection("booking")} />
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
                            className={`bg-white rounded-lg border-2 transition-all ${snapshot.isDragging
                              ? "border-blue-500 shadow-2xl scale-105"
                              : "border-gray-200 shadow"
                              }`}
                          >
                            <SectionCard
                              section={section}
                              dragHandleProps={provided.dragHandleProps}
                              onDelete={() => deleteSection(section.id)}
                              onUpdate={(field, value) => updateSection(section.id, field, value)}
                              isExpanded={expandedSections.has(section.id)}
                              onToggle={() => toggleSection(section.id)}
                              pageSlug={pageSlug}
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
              <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Code size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">No sections yet</p>
                <p className="text-gray-400">Click "Add Section" above to get started building your page</p>
              </div>
            )}
          </>
        ) : (
          <PreviewPanel sections={sections} />
        )}
      </div>
    </div>
  );
}

function AddSectionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2
        px-4 py-2
        rounded-full
        text-sm font-medium

        bg-white/20 backdrop-blur-md
        border border-[1.5px] border-slate-300
        ring-1 ring-inset ring-white/30

        text-slate-700

        hover:bg-blue-50/70
        hover:border-blue-300
        hover:text-blue-700

        transition
      "
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// Section Card Component
function SectionCard({ section, dragHandleProps, onDelete, onUpdate, isExpanded, onToggle, pageSlug }) {
  const getSectionIcon = (key) => {
    const icons = {
      hero: Type,
      faq: HelpCircle,
      html: Code,
      links: LinkIcon,
      booking: Ticket,
    };
    const Icon = icons[key] || Type;
    return <Icon size={20} />;
  };

  const getSectionColor = (key) => {
    const colors = {
      hero: "text-purple-600 bg-purple-50",
      faq: "text-green-600 bg-green-50",
      html: "text-blue-600 bg-blue-50",
      links: "text-orange-600 bg-orange-50",
      booking: "text-indigo-600 bg-indigo-50",
    };
    return colors[key] || "text-gray-600 bg-gray-50";
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-t-lg border-b">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition"
        >
          <GripVertical size={20} />
        </div>

        <div className={`p-2 rounded-lg ${getSectionColor(section.key)}`}>
          {getSectionIcon(section.key)}
        </div>

        <span className="font-semibold text-gray-800 capitalize flex-1">
          {section.key} Section
        </span>

        <button
          onClick={onToggle}
          className={glassIconBtn}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button
          onClick={onDelete}
          className={glassDeleteBtn}
          title="Delete Section"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-6 bg-white">
          {section.key === "hero" && (
            <HeroForm content={section.content} onUpdate={onUpdate} pageSlug={pageSlug} />
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
    }
  };
  return defaults[type] || {};
}

// Preview Panel Component
function PreviewPanel({ sections }) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center">
        <Eye size={24} className="inline-block mr-2" />
        <span className="font-semibold">Preview Mode</span>
        <p className="text-sm text-blue-100 mt-1">This is how your data is structured</p>
      </div>

      <div className="p-6">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6 pb-6 border-b last:border-b-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {section.key}
              </span>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto border border-gray-200">
              {JSON.stringify(section.content, null, 2)}
            </pre>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <Code size={48} className="mx-auto mb-4 opacity-50" />
            <p>No sections to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
