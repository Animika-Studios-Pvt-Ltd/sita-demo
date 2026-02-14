import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CmsList from "./pages/CmsList";
import { useEffect, useState } from "react";

const AdminManagePages = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showStaticPages, setShowStaticPages] = useState(false);

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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#7A1F2B] mb-4">
            Manage Pages
          </h2>

          {/* Static Page Code Editors - Collapsible */}
          <div className="mb-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] border border-white/70 ring-1 ring-black/5">
            <button
              onClick={() => setShowStaticPages(!showStaticPages)}
              className="w-full text-left p-6 transition-all flex items-center justify-between group"
            >
              <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-[#7A1F2B]">&lt;/&gt;</span> Static Page Code Editors
              </h3>
              <span className={`transform transition-transform text-slate-500 ${showStaticPages ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showStaticPages && (
              <div className="px-6 pb-6 space-y-6 border-t border-white/50 pt-6">
                {/* Main Pages */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Main Pages</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'home', label: 'Home Page' },
                      { key: 'about', label: 'About Us' },
                      { key: 'contact', label: 'Contact Us' },
                      { key: 'privacy', label: 'Privacy Policy' },
                      { key: 'disclaimer', label: 'Disclaimer' },
                    ].map((page) => (
                      <button
                        key={page.key}
                        onClick={() => navigate(`/dashboard/code-editor/${page.key}`)}
                        className="flex flex-col items-center justify-center p-3 bg-white/50 border border-slate-200 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                      >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-[#7A1F2B]">
                          {page.label}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">{page.key}.jsx</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Services</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'ayurveda', label: 'Ayurveda' },
                      { key: 'kosha', label: 'Kosha Counseling' },
                      { key: 'release', label: 'Release Patterns' },
                      { key: 'soul', label: 'Soul Curriculum' },
                      { key: 'yoga', label: 'Yoga Therapy' },
                    ].map((page) => (
                      <button
                        key={page.key}
                        onClick={() => navigate(`/dashboard/code-editor/${page.key}`)}
                        className="flex flex-col items-center justify-center p-3 bg-white/50 border border-slate-200 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                      >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-[#7A1F2B]">
                          {page.label}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">{page.key}.jsx</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sita Factor */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Sita Factor</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'consult-sita', label: 'Consult Sita' },
                      { key: 'engage-sita', label: 'Engage Sita' },
                      { key: 'study-sita', label: 'Study With Sita' },
                    ].map((page) => (
                      <button
                        key={page.key}
                        onClick={() => navigate(`/dashboard/code-editor/${page.key}`)}
                        className="flex flex-col items-center justify-center p-3 bg-white/50 border border-slate-200 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                      >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-[#7A1F2B]">
                          {page.label}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">{page.key}.jsx</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Workshops */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Workshops</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'corporate-training', label: 'Corporate Training' },
                      { key: 'group-sessions', label: 'Group Sessions' },
                      { key: 'private-sessions', label: 'Private Sessions' },
                      { key: 'shakthi-leadership', label: 'Shakthi Leadership' },
                      { key: 'teacher-training', label: 'Teacher Training' },
                    ].map((page) => (
                      <button
                        key={page.key}
                        onClick={() => navigate(`/dashboard/code-editor/${page.key}`)}
                        className="flex flex-col items-center justify-center p-3 bg-white/50 border border-slate-200 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                      >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-[#7A1F2B]">
                          {page.label}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">{page.key}.jsx</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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
    </div >
  );
};

export default AdminManagePages;
