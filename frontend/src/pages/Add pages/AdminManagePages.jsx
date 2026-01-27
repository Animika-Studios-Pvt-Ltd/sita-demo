import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CmsList from "./pages/CmsList";

const AdminManagePages = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 pt-0 mt-10">
      {/* HEADER */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/cms")}
          className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
        >
          <ArrowBackIcon className="w-2 h-2" />
          Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center"> Manage Pages</h2>
        <p className="text-sm text-gray-600 mt-1 text-center">
          Organize and manage your Events content.
        </p>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <CmsList />
      </div>
    </div>
  );
};

export default AdminManagePages;
