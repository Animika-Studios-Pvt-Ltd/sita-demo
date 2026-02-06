import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicIcon from "@mui/icons-material/Mic";

const glassPanel =
  "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl";
const glassHeader = `${glassPanel} p-6 md:p-8 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]`;
const glassCard = `${glassPanel} p-5 md:p-6`;

const Podcasts = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-10 px-4 font-montserrat text-slate-700">
      <button
        onClick={() => navigate("/dashboard/cms")}
        className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
      >
        <ArrowBackIcon className="w-4 h-4" />
        Back
      </button>

      <div className="mt-6">
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
                Manage podcast episodes, metadata, and publishing status.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={glassCard}>
            <h3 className="text-lg font-semibold text-[#7A1F2B] mb-2">No episodes yet</h3>
            <p className="text-sm text-slate-600">
              Create your first podcast episode to get started.
            </p>
          </div>
          <div className={glassCard}>
            <h3 className="text-lg font-semibold text-[#7A1F2B] mb-2">Publishing status</h3>
            <p className="text-sm text-slate-600">
              Drafts, scheduled releases, and published episodes will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
