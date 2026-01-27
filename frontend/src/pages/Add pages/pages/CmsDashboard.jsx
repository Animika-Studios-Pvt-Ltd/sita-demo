// src/components/Dashboard/admin/pages/CmsDashboard.jsx

import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CmsList from "./CmsList";
import EnhancedCmsEditor from "./EnhancedCmsEditor";

export default function CmsDashboard() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Simple hardcoded check or just allow access since we are in admin
  const cmsAccess = {
    loading: false,
    allowed: true,
    error: null,
  };

  const isEditing =
    location.pathname.includes("/edit") ||
    location.pathname.includes("/new");

  const backPath = isEditing ? "/dashboard/manage-pages" : "/admin/dashboard";

  /* ================= MAIN LAYOUT ================= */
  return (
    <div className="min-h-screen mt-10 rounded-lg flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50 overflow-x-hidden">

      {/* ================= HEADER (COPIED STYLE) ================= */}
      <header className="sticky rounded-lg top-0 z-40 bg-gradient-to-r from-orange-400 to-orange-600 hover:orange-600 shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">

            {/* Back button */}
            <button
              onClick={() => navigate(backPath)}
              className="
    inline-flex items-center gap-2
    px-2.5 py-1.5 text-xs sm:text-sm rounded-full
    bg-white/10 text-white
    hover:bg-white/20
    border border-white/20
    transition
  "
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white text-center">
                {isEditing
                  ? slug
                    ? "Edit Page"
                    : "Create Page"
                  : "Content Management"}
              </h1>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => navigate("/dashboard/cms/new")}
                    className="
          inline-flex items-center gap-2
          px-3 py-1.5 sm:px-4 sm:py-2
          rounded-full
          bg-white/15 backdrop-blur-md
          border border-white/30
          text-white text-xs sm:text-sm
          hover:bg-white/25
          transition shadow-sm
        "
                  >
                    + New Page
                  </button>

                  <button
                    onClick={() => navigate("/admin/site-settings")}
                    className="
          inline-flex items-center gap-2
          px-3 py-1.5 sm:px-4 sm:py-2
          rounded-full
          bg-white/15 backdrop-blur-md
          border border-white/30
          text-white text-xs sm:text-sm
          hover:bg-white/25
          transition shadow-sm
        "
                  >
                    Site Settings
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm p-3 sm:p-5">
            {isEditing ? <EnhancedCmsEditor /> : <CmsList />}
          </div>
        </div>
      </main>

      {/* Footer removed as per cleanup */}
    </div>
  );
}
