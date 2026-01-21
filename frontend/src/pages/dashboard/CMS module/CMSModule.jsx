import React from "react";
import { Link, useLocation } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const CMSModule = () => {
  const location = useLocation();

  const modules = [
    {
      name: "Review Management",
      icon: <StarIcon fontSize="large" className="text-indigo-600" />,
      route: "/dashboard/manage-reviews",
    },
    {
      name: "Trust Certificates",
      icon: <WorkspacePremiumIcon fontSize="large" className="text-green-600" />,
      route: "/dashboard/certificates/trust-certificate",
    },
    {
      name: "Manage Pages",
      icon: <DescriptionIcon fontSize="large" className="text-purple-600" />,
      route: "/dashboard/manage-pages",
    },
  ];

  const isCardActive = (route) => location.pathname === route;

  return (
    <div className="container mx-auto mt-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        CMS Module
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <Link
            to={module.route}
            key={index}
            className={`group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 transition-all duration-300 no-underline
              ${isCardActive(module.route)
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none"
                : "bg-white hover:bg-gray-50"
              }
            `}
          >
            <div
              className={`p-3 rounded-full mb-2 transition-colors duration-300
                ${isCardActive(module.route)
                  ? "bg-white/20"
                  : "bg-gray-100 group-hover:bg-gray-200"
                }
              `}
            >
              {module.icon}
            </div>

            <h4
              className={`text-sm md:text-base font-semibold text-center
                ${isCardActive(module.route)
                  ? "text-white"
                  : "text-gray-800 group-hover:text-purple-600"
                }
              `}
            >
              {module.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CMSModule;
