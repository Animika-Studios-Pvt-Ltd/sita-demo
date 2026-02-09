import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CmsList from "./pages/CmsList";

const AdminManagePages = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-[40px] font-montserrat text-slate-700">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          {/* HEADER */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/dashboard/cms")}
              className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
            >
              <ArrowBackIcon className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-[#7A1F2B] mb-2 text-center">
              Manage Pages
            </h2>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Organize and manage your Events content.
            </p>
          </div>

          {/* CONTENT */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] border border-white/70 ring-1 ring-black/5 p-6">
            <CmsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagePages;
