import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CmsList from "./pages/CmsList";
import { useEffect, useState } from "react";

const AdminManagePages = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);// Tablet & below blocked
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="container mt-[40px] font-montserrat text-slate-700">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">

          {/* HEADER (Always Visible) */}
          <button
            onClick={() => navigate("/dashboard/cms")}
            className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
          >
            <ArrowBackIcon className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#7A1F2B] mb-10">
            Manage Pages
          </h2>

          {/* CONTENT */}
          {isMobile ? (
            <div className="flex items-center justify-center mt-20">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] border border-white/70 ring-1 ring-black/5 p-8 max-w-md w-full text-center">
                <h3 className="text-lg font-semibold text-[#7A1F2B] mb-4">
                  Desktop View Required
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  This CMS Page Manager is optimized for Desktop devices.
                </p>

                <p className="text-xs text-slate-400">
                  Please switch to a larger screen to continue.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] border border-white/70 ring-1 ring-black/5 p-6">
              <CmsList />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminManagePages;
