// src/components/Dashboard/admin/pages/CmsDashboard.jsx

import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CmsList from "./CmsList";
import EnhancedCmsEditor from "./EnhancedCmsEditor";

export default function CmsDashboard() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditing =
    location.pathname.includes("/edit") ||
    location.pathname.includes("/new");

  const backPath = isEditing ? "/dashboard/manage-pages" : "/dashboard/cms";

  /* ================= MAIN LAYOUT ================= */
  return (
    <div className="container mt-[40px] font-montserrat text-slate-700">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <button
                onClick={() => navigate(backPath)}
                className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
              >
                <ArrowBackIcon className="w-4 h-4" />
                Back
              </button>

              <div className="flex-1 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-[#7A1F2B]">
                  {isEditing
                    ? slug
                      ? "Edit Event Page"
                      : "Create Event Page"
                    : "Content Management"}
                </h1>
              </div>

              <div className="flex items-center justify-end gap-2">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => navigate("/dashboard/cms/new")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] text-xs sm:text-sm font-semibold shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] transition-colors duration-200"
                    >
                      + New Page
                    </button>

                    <button
                      onClick={() => navigate("/admin/site-settings")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] text-xs sm:text-sm font-semibold shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] transition-colors duration-200"
                    >
                      Site Settings
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/70 ring-1 ring-black/5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] p-4 sm:p-6">
            {isEditing ? <EnhancedCmsEditor /> : <CmsList />}
          </div>
        </div>
      </div>
    </div>
  );
}
