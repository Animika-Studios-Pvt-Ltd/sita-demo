import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CmsList from "./pages/CmsList";

const AdminManagePages = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="relative mb-8 flex items-center">
        {/* BACK BUTTON (LEFT) */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-800
                     hover:from-blue-800 hover:to-blue-600 transition-all duration-300
                     text-white px-3 py-1.5 z-10"
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>

        {/* CENTER TITLE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Pages
          </h1>
          <p className="text-gray-500 text-sm">
            Organize and manage your Events content.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <CmsList />
      </div>
    </div>
  );
};

export default AdminManagePages;
