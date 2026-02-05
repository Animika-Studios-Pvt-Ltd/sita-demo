import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CMSModule = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const modules = [
    {
      name: "Review Management",
      icon: StarIcon,
      route: "/dashboard/manage-reviews",
    },
    {
      name: "Trust Certificates",
      icon: WorkspacePremiumIcon,
      route: "/dashboard/certificates/trust-certificate",
    },
    {
      name: "Manage Event Pages",
      icon: DescriptionIcon,
      route: "/dashboard/manage-pages",
    },
    {
      name: "Workshop / Event Calendar",
      icon: DescriptionIcon,
      route: "/dashboard/manage-events", // ✅ NEW
    },
  ];

  const isCardActive = (route) => location.pathname === route;

  return (
    <div className="container mx-auto mt-10 px-4 font-montserrat text-slate-700">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
      >
        <ArrowBackIcon className="w-4 h-4" />
        Back
      </button>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#7A1F2B] mb-10">
        CMS Module
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {modules.map((module, index) => {
          const isActive = isCardActive(module.route);
          const Icon = module.icon;
          return (
          <Link
            to={module.route}
            key={index}
              className={`group flex flex-col items-center justify-center text-center min-h-[130px] p-4 rounded-2xl border transition-colors duration-200 no-underline bg-white/70 backdrop-blur-xl ring-1 ring-black/5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]
              ${isActive
                ? "border-[#7A1F2B] bg-gradient-to-br from-[#7A1F2B]/10 via-white/95 to-white/80"
                : "border-white/70 hover:bg-white/90"
              }`}
          >
            <div
                className={`p-3 rounded-full mb-2 border transition-colors duration-200
                ${isActive
                  ? "bg-white/80 border-[#7A1F2B]/40"
                  : "bg-white/80 border-white/70 group-hover:bg-white"
                }`}
            >
              <Icon
                fontSize="large"
                className={`${isActive ? "text-[#7A1F2B]" : "text-slate-400 group-hover:text-[#7A1F2B]"}`}
              />
            </div>

            <h4
              className={`text-sm md:text-base font-semibold
                ${isActive
                  ? "text-[#7A1F2B]"
                  : "text-slate-700 group-hover:text-[#7A1F2B]"
                }`}
            >
              {module.name}
            </h4>
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CMSModule;
