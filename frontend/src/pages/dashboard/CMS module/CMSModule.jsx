import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import WidgetsIcon from "@mui/icons-material/Widgets";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from '@mui/icons-material/Groups';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';


const CMSModule = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("home");

  const moduleGroups = {
    home: [
      {
        name: "Foundation — Our Roots & Mission",
        icon: <ImageIcon fontSize="large" className="text-purple-600" />,
        route: "/dashboard/admin-banner"
      },
      {
        name: "Reader Thoughts — Voices of Inspiration",
        icon: <DescriptionIcon fontSize="large" className="text-green-600" />,
        route: "/dashboard/reader-thoughts"
      },
      {
        name: "Featured Thoughts — Gems from Our Corners",
        icon: <BookIcon fontSize="large" className="text-pink-600" />,
        route: "/dashboard/admin-corners"
      },
      {
        name: "About the Author — Story Behind the Words",
        icon: <PersonIcon fontSize="large" className="text-teal-600" />,
        route: "/dashboard/edit-author"
      },
    ],

    other: [
      { name: "Sufi Wisdom Corners", icon: <WidgetsIcon fontSize="large" className="text-teal-600" />, route: "/dashboard/admin-sufi-corner" },
      { name: "Inspiration Hub", icon: <LightbulbIcon fontSize="large" className="text-orange-500" />, route: "/dashboard/manage-inspiration" },
      { name: "Author Profiles", icon: <HistoryEduIcon fontSize="large" className="text-purple-400" />, route: "/dashboard/author-page" },
      { name: "The Foundation", icon: <GroupsIcon fontSize="large" className="text-indigo-600" />, route: "/dashboard/admin-Foundation" },
      { name: "Review Management", icon: <StarIcon fontSize="large" className="text-indigo-600" />, route: "/dashboard/manage-reviews" },
      { name: "Trust Certificates", icon: <WorkspacePremiumIcon fontSize="large" className="text-green-600" />, route: "/dashboard/certificates/trust-certificate" },
      { name: "Manage Pages", icon: <DescriptionIcon fontSize="large" className="text-purple-600" />, route: "/dashboard/manage-pages" },
    ],
  };

  const isCardActive = (route) => location.pathname === route;

  return (
    <div className="container mx-auto mt-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">CMS Module</h2>
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["home", "other"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300
              ${activeCategory === category
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {category === "home" ? <HomeIcon /> : <WidgetsIcon />}
            {category === "home" ? "Home Pages" : "Other Pages"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {moduleGroups[activeCategory].map((module, index) => (
          <Link
            to={module.route}
            key={index}
            className={`group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 transition-all duration-300 no-underline
              ${isCardActive(module.route) ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none" : "bg-white hover:bg-gray-50"}
            `}
          >
            <div className={`p-3 rounded-full mb-2 transition-colors duration-300
              ${isCardActive(module.route) ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"}`}
            >
              {module.icon}
            </div>

            <h4 className={`text-sm md:text-base font-semibold text-center
              ${isCardActive(module.route) ? "text-white" : "text-gray-800 group-hover:text-purple-600"}`}
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
