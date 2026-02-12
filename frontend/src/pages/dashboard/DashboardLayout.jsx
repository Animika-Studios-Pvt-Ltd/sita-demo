import React, { useState, useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import DashboardIcon from "@mui/icons-material/Dashboard"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"
import ImageIcon from "@mui/icons-material/Image"
import SecurityIcon from "@mui/icons-material/Security"
import LogoutIcon from "@mui/icons-material/Logout"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import useIdleTimeout from "../../hooks/useIdleTimeout"
import Swal from "sweetalert2"
import { FaHistory } from "react-icons/fa";

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminTheme, setAdminTheme] = useState(() => localStorage.getItem("adminTheme") || "light")

  useIdleTimeout()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    localStorage.setItem("adminTheme", adminTheme)
  }, [adminTheme])

  useEffect(() => {
    const verifyToken = async () => {
      // 1. Check LocalStorage
      const adminToken = localStorage.getItem("adminToken")

      // If we have a token, we can validate it (optional, but good practice to verify headers)
      // OR if we don't have a token, we try the cookie method

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin-auth/verify`,
          {
            headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
            withCredentials: true
          }
        )

        if (response.data.valid) {
          setIsAuthenticated(true)
          setIsLoading(false)
          // Ensure LS is synced if we recovered via cookie
          if (response.data.token && !adminToken) {
            localStorage.setItem("adminToken", response.data.token)
          }
        } else {
          throw new Error("Invalid token")
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        localStorage.removeItem("adminToken")
        setIsAuthenticated(false)
        navigate("/", { replace: true })
      }
    }

    verifyToken()
  }, [navigate])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "bg-[#7A1F2B] hover:bg-[#641823] text-white px-6 py-2 border-1 border-[#641823] rounded-xl ml-3",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 border-1 border-[#641823] rounded-xl mr-3",
      },

      buttonsStyling: false,
    })

    if (!result.isConfirmed) return

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin-auth/logout`,
        {},
        { withCredentials: true }
      )
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("lastActivity")
      navigate("/", { replace: true })
    }
  }


  const isActive = (path) => location.pathname === path
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-montserrat">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-b-gray-800"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  const adminLogo =
    adminTheme === "dark"
      ? "/sita-admin-logo-4.webp"
      : "/sita-admin-logo-1.webp"

  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-montserrat leading-snug admin-scope"
      data-admin-theme={adminTheme}
    >
      {isMobile && mobileSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileSidebar(false)}
        ></div>
      )}
      <aside
        className={`fixed top-0 h-screen bg-white/70 backdrop-blur-xl text-slate-700 flex flex-col justify-between pt-4 pb-6 px-3 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] z-40 transition-all duration-300 ${isMobile
          ? mobileSidebar
            ? "w-64 left-0"
            : "w-0 -left-64"
          : isExpanded
            ? "w-64 left-0"
            : "w-20 left-0"
          } overflow-hidden border border-white/60 ring-1 ring-black/5`}
      >
        <div>
          <div
            className={`relative mb-10 ${isExpanded || mobileSidebar ? "px-2" : "px-0"}`}
          >
            <div className="flex flex-col items-center gap-2">
              <img
                src={adminLogo}
                alt="Admin Logo"
                className={`w-full ${isExpanded || mobileSidebar
                  ? "max-w-[110px]"
                  : "max-w-[52px]"
                  } h-auto object-contain transition-all duration-300`}
              />

              {(isExpanded || mobileSidebar) && (
                <div className="relative w-full flex items-center justify-center">

                  {!isMobile && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="absolute right-0 top-3/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-all duration-200 rounded-full p-1.5 bg-white/60 border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/80"
                      aria-label="Toggle sidebar"
                    >
                      {isExpanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                    </button>
                  )}
                </div>
              )}
            </div>

            {!isMobile && !(isExpanded || mobileSidebar) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 mx-auto block text-slate-500 hover:text-slate-800 transition-all duration-200 rounded-full p-1.5 bg-white/60 border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/80"
                aria-label="Toggle sidebar"
              >
                {isExpanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </button>
            )}
          </div>

          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-2.5 rounded-xl transition-all duration-200 border border-transparent backdrop-blur-md ${isActive("/dashboard") ? "bg-gradient-to-br from-[#7A1F2B]/25 via-white/90 to-white/80 text-[#7A1F2B] border-[#7A1F2B]/80 ring-1 ring-black/5 shadow-sm relative overflow-hidden" : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:border-white/60 hover:ring-1 hover:ring-black/5"
                }`}
            >
              {isActive("/dashboard") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A1F2B]/60"></div>}
              <DashboardIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Dashboard</span>}
            </Link>

            <Link
              to="/dashboard/manage-books"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-2.5 rounded-xl transition-all duration-200 border border-transparent backdrop-blur-md ${isActive("/dashboard/manage-books")
                  ? "bg-gradient-to-br from-[#7A1F2B]/25 via-white/90 to-white/80 text-[#7A1F2B] border-[#7A1F2B]/80 ring-1 ring-black/5 shadow-sm relative overflow-hidden"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:border-white/60 hover:ring-1 hover:ring-black/5"
                }`}
            >
              {isActive("/dashboard/manage-books") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A1F2B]/60"></div>}
              <MenuBookIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Manage Books</span>}
            </Link>

            <Link
              to="/dashboard/add-blogs"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-2.5 rounded-xl transition-all duration-200 border border-transparent backdrop-blur-md ${isActive("/dashboard/add-blogs")
                  ? "bg-gradient-to-br from-[#7A1F2B]/25 via-white/90 to-white/80 text-[#7A1F2B] border-[#7A1F2B]/80 ring-1 ring-black/5 shadow-sm relative overflow-hidden"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:border-white/60 hover:ring-1 hover:ring-black/5"
                }`}
            >
              {isActive("/dashboard/add-blogs") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A1F2B]/60"></div>}
              <LibraryBooksIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Manage Blogs</span>}
            </Link>

            <Link
              to="/dashboard/cms"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-2.5 rounded-xl transition-all duration-200 border border-transparent backdrop-blur-md ${isActive("/dashboard/cms")
                  ? "bg-gradient-to-br from-[#7A1F2B]/25 via-white/90 to-white/80 text-[#7A1F2B] border-[#7A1F2B]/80 ring-1 ring-black/5 shadow-sm relative overflow-hidden"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:border-white/60 hover:ring-1 hover:ring-black/5"
                }`}
            >
              {isActive("/dashboard/cms") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A1F2B]/60"></div>}
              <ImageIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">CMS Module</span>}
            </Link>
          </nav>
        </div>

        <div className={`${isExpanded || mobileSidebar ? "px-4 space-y-2" : "flex flex-col items-center space-y-2"} transition-all duration-300 border-t border-white/60 pt-6`}>
          <Link
            to="/dashboard/settings/mfa"
            className={`no-underline flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all duration-300 border border-transparent backdrop-blur-md ${isActive("/dashboard/settings/mfa")
              ? "bg-gradient-to-br from-[#7A1F2B]/25 via-white/90 to-white/80 text-[#7A1F2B] border-[#7A1F2B]/80 ring-1 ring-black/5 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:border-white/60 hover:ring-1 hover:ring-black/5"
              } ${isExpanded || mobileSidebar ? "justify-start" : "justify-center"}`}
          >
            <SecurityIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Security</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-2.5 text-[#8b171b] hover:text-[#8b171b] hover:bg-red-50/70 rounded-xl w-full transition-all duration-300 border border-transparent backdrop-blur-md hover:border-red-200/60 hover:ring-1 hover:ring-red-200/60 ${isExpanded || mobileSidebar ? "justify-start" : "justify-center"
              }`}
            aria-label="Logout"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>

        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isExpanded && !isMobile ? "ml-64" : !isMobile ? "ml-20" : "ml-0"
          }`}
      >
        <header
          className={`fixed top-0 z-20 flex flex-col items-center justify-center px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/70 shadow-sm transition-all duration-300 ${isExpanded && !isMobile ? "left-64" : !isMobile ? "left-20" : "left-0"
            } right-0`}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => setAdminTheme(adminTheme === "light" ? "dark" : "light")}
              className={`relative inline-flex items-center w-16 h-8 rounded-full border-1 shadow-sm overflow-hidden transition-all duration-200 ${adminTheme === "dark"
                ? "bg-[#f6971d] border-[#f6971d] hover:bg-[#eab308]"
                : "bg-white/80 border-[#7A1F2B] hover:bg-white/90"
                }`}
              aria-label="Toggle admin theme"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-7 w-7 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 ${adminTheme === "dark"
                  ? "translate-x-8 bg-white text-[#7A1F2B]"
                  : "translate-x-0 bg-white text-[#7A1F2B]"
                  }`}
              >
                {adminTheme === "dark" ? <LightModeIcon sx={{ fontSize: 14 }} /> : <DarkModeIcon sx={{ fontSize: 14 }} />}
              </span>
            </button>
            {isMobile && (
              <button
                onClick={() => setMobileSidebar(true)}
                className="text-slate-700 hover:text-slate-900 rounded-full p-2 bg-white/70 border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/90 transition-all duration-200"
                aria-label="Open menu"
              >
                <MenuIcon fontSize="medium" />
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-10 pt-[20px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout



