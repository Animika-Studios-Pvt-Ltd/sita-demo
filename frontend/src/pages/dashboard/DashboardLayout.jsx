import React, { useState, useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import DashboardIcon from "@mui/icons-material/Dashboard"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LogoutIcon from "@mui/icons-material/Logout"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ImageIcon from "@mui/icons-material/Image"
import SecurityIcon from "@mui/icons-material/Security"
import useIdleTimeout from "../../hooks/useIdleTimeout"

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useIdleTimeout()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const verifyToken = async () => {
      const adminToken = localStorage.getItem("adminToken")

      if (!adminToken) {
        navigate("/", { replace: true })
        return
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin-auth/verify`,
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.data.valid) {
          setIsAuthenticated(true)
          setIsLoading(false)
        } else {
          localStorage.removeItem("adminToken")
          localStorage.removeItem("lastActivity")
          navigate("/", { replace: true })
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        localStorage.removeItem("adminToken")
        localStorage.removeItem("lastActivity")
        navigate("/", { replace: true })
      }
    }

    verifyToken()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("lastActivity")
    setIsAuthenticated(false)
    navigate("/Langshott-Foundation-Author-Anilkumar-Admin", { replace: true })
  }

  const isActive = (path) => location.pathname === path
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-figtree font-normal leading-snug">
      {isMobile && mobileSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileSidebar(false)}
        ></div>
      )}
      <aside
        className={`fixed top-0 h-screen bg-gray-800 text-white flex flex-col justify-between py-6 px-3 shadow-lg z-40 transition-all duration-300 ${isMobile
          ? mobileSidebar
            ? "w-60 left-0"
            : "w-0 -left-60"
          : isExpanded
            ? "w-60 left-0"
            : "w-20 left-0"
          } overflow-hidden`}
      >
        <div>
          <div
            className={`flex items-center mb-10 ${isExpanded && !isMobile ? "justify-between px-2" : "flex-col space-y-3"
              }`}
          >
            <div className="flex items-center gap-3">
              <img
                src="/adminprofile.jpg"
                alt="Admin Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              {(isExpanded && !isMobile) || mobileSidebar ? (
                <span className="text-lg font-playfair font-light text-white leading-tight">
                  Admin
                </span>
              ) : null}
            </div>

            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-300 hover:text-white"
                aria-label="Toggle sidebar"
              >
                {isExpanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </button>
            )}
          </div>

          <nav className="space-y-3">
            <Link
              to="/dashboard"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard") ? "bg-purple-600 text-white" : "hover:bg-purple-600 text-gray-300 hover:text-white"
                }`}
            >
              <DashboardIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-base">Dashboard</span>}
            </Link>

            <Link
              to="/dashboard/manage-books"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/manage-books")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
                }`}
            >
              <MenuBookIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-base">Manage Books</span>}
            </Link>

            <Link
              to="/dashboard/add-blogs"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/add-blogs")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
                }`}
            >
              <LibraryBooksIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-base">Manage Blogs</span>}
            </Link>

            <Link
              to="/dashboard/manage-letters"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/manage-letters")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
                }`}
            >
              <MailOutlineIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-base">Manage Letters</span>}
            </Link>

            <Link
              to="/dashboard/cms"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/cms")
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 text-gray-300 hover:text-white"
                }`}
            >
              <ImageIcon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-base">CMS Module</span>}
            </Link>
          </nav>
        </div>

        <div className={`${isExpanded || mobileSidebar ? "px-4 space-y-3" : "flex flex-col items-center space-y-3"} transition-all duration-300`}>
          <Link
            to="/dashboard/settings/mfa"
            className={`no-underline flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-300 ${isActive("/dashboard/settings/mfa")
              ? "bg-orange-600 text-white"
              : "text-orange-400 hover:text-white hover:bg-orange-600"
              } ${isExpanded || mobileSidebar ? "justify-start" : "justify-center"}`}
          >
            <SecurityIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && <span className="text-base">Security</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 text-red-500 hover:text-white hover:bg-red-600 rounded-lg w-full transition-all duration-300 ${isExpanded || mobileSidebar ? "justify-start" : "justify-center"
              }`}
            aria-label="Logout"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && <span className="text-base">Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isExpanded && !isMobile ? "ml-60" : !isMobile ? "ml-20" : "ml-0"
          }`}
      >
        <header
          className={`fixed top-0 z-20 flex flex-col items-center justify-center px-6 py-4 bg-white shadow-sm transition-all duration-300 ${isExpanded && !isMobile ? "left-60" : !isMobile ? "left-20" : "left-0"
            } right-0`}
        >
          {/* <div className="relative w-full flex flex-col items-center justify-center text-center py-6">
            <img
              src="/1-langshott-foundation-logo.webp"
              alt="Langshott Logo"
              className="absolute w-40 sm:w-48 md:w-48 lg:w-48 h-auto opacity-20 object-contain"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                filter: "brightness(0)",
                zIndex: 0,
              }}
            />

            <h1
              className="relative z-10 text-[20px] sm:text-[22px] md:text-[22px] lg:text-[24px] font-playfair font-semibold text-black leading-snug max-w-3xl px-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome to{" "}
              <span className="text-indigo-700">Sita</span> Admin Panel
            </h1>
          </div> */}
          {isMobile && (
            <button
              onClick={() => setMobileSidebar(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
              aria-label="Open menu"
            >
              <MenuIcon fontSize="medium" />
            </button>
          )}
        </header>
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-10 pt-[100px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
