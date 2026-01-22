import React, { useEffect, useState, useRef } from "react";
import { api } from "../../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import VisualPageBuilder from "./forms/VisualPageBuilder";
import { ArrowLeft, Eye, Save } from "lucide-react";


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


export default function CmsEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const visualBuilderRef = useRef(null);


  const [pageSlug, setPageSlug] = useState(slug || "");
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);


  // Initial data for the visual builder
  const [initialData, setInitialData] = useState({
    html: "",
    css: "",
    components: null,
  });


  useEffect(() => {
    if (!slug) return;


    api
      .get(`/api/cms/admin/pages/${slug}`)
      .then((res) => {
        console.log("📄 Loaded page data:", res);
        const firstSection = res.sections?.[0];
        if (firstSection?.content) {
          setInitialData({
            html: firstSection.content.html || "",
            css: firstSection.content.css || "",
            components: firstSection.content.components || null,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load page:", err);
        Swal.fire("Error", "Failed to load page", "error");
        setLoading(false);
      });
  }, [slug]);


  async function saveVisualMode(status = "published") {
    if (!pageSlug.trim()) {
      Swal.fire({
        icon: "error",
        title: "Page Slug Required",
        text: "Please enter a page slug before saving",
      });
      return;
    }


    if (!visualBuilderRef.current) {
      Swal.fire("Error", "Editor not ready", "error");
      return;
    }


    setSaving(true);
    try {
      const html = visualBuilderRef.current.getHtml();
      const css = visualBuilderRef.current.getCss();
      const components = visualBuilderRef.current.getComponents();


      console.log("💾 Saving visual editor data:", {
        html: html?.substring(0, 100) + "...",
        css: css?.substring(0, 100) + "...",
        components: components ? "Present" : "None",
      });


      await api.post("/api/cms/pages", {
        slug: pageSlug,
        sections: [
          {
            key: "main",
            content: {
              html,
              css,
              components: JSON.stringify(components),
            },
          },
        ],
        status,
        editorType: "visual",
      });


      Swal.fire({
        icon: "success",
        title: status === "published" ? "Published!" : "Saved as Draft",
        html: `
          <div>
            <p class="mb-2">Page saved successfully!</p>
            <p class="text-sm text-gray-600">Your page is now live at /${pageSlug}</p>
          </div>
        `,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/dashboard/manage-pages"));
    } catch (err) {
      console.error("❌ Save error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save page",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }


  const handlePreview = () => {
    if (!visualBuilderRef.current) {
      alert("Editor not ready");
      return;
    }


    const html = visualBuilderRef.current.getHtml();
    const css = visualBuilderRef.current.getCss();


    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>${css}</style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };


  const handleViewCode = () => {
    const editor = visualBuilderRef.current?.getEditor();
    if (editor) {
      editor.runCommand("core:open-code");
    } else {
      alert("Editor not ready");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading page...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* CONTROL BAR WITH SAVE, PREVIEW, VIEW CODE */}
      <div className="bg-white border-b px-4 py-2 flex items-center gap-4 shadow-sm z-10">
        <button onClick={() => navigate("/dashboard/manage-pages")} className={glassBtn}>
          <ArrowLeft size={18} />
          Back
        </button>


        <input
          type="text"
          value={pageSlug}
          onChange={(e) => setPageSlug(e.target.value)}
          placeholder="page-url"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!slug}
        />


        <button
          onClick={() => saveVisualMode("draft")}
          disabled={saving}
          className={glassBtnWarning}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Draft"}
        </button>


        <button
          onClick={() => saveVisualMode("published")}
          disabled={saving}
          className={glassBtnPrimary}
        >
          <Save size={18} />
          {saving ? "Publishing..." : "Publish"}
        </button>


        <button onClick={handlePreview} className={glassBtn}>
          <Eye size={18} />
          Preview
        </button>


        <div className="ml-auto text-sm text-gray-600">
          {slug && `Page URL: /${slug}`}
        </div>
      </div>


      {/* ✅ FIXED: Changed overflow-hidden to overflow-auto for scrolling */}
      <div className="flex-1 overflow-auto">
        <VisualPageBuilder
          ref={visualBuilderRef}
          pageId={slug}
          initialHtml={initialData.html}
          initialCss={initialData.css}
          initialComponents={initialData.components}
        />
      </div>
    </div>
  );
}
