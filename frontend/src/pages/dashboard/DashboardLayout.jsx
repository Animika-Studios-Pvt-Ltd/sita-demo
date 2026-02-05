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
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin-auth/logout`,
        {},
        { withCredentials: true }
      )
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("lastActivity")
      setIsAuthenticated(false)
      navigate("/", { replace: true })
    }
  }

  const isActive = (path) => location.pathname === path
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-montserrat">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D0842]"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-montserrat leading-snug">
      {isMobile && mobileSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileSidebar(false)}
        ></div>
      )}
      <aside
        className={`fixed top-0 h-screen bg-[#0D0842] text-white flex flex-col justify-between py-6 px-3 shadow-2xl z-40 transition-all duration-300 ${isMobile
          ? mobileSidebar
            ? "w-64 left-0"
            : "w-0 -left-64"
          : isExpanded
            ? "w-64 left-0"
            : "w-20 left-0"
          } overflow-hidden border-r border-[#1a1655]`}
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
                className="w-12 h-12 rounded-full object-cover border-2 border-[#c86836]"
              />
              {(isExpanded && !isMobile) || mobileSidebar ? (
                <div className="flex flex-col">
                  <span className="text-lg font-pt-serif font-bold text-white leading-tight">
                    Sita Admin
                  </span>
                  <span className="text-xs text-[#c86836] font-montserrat font-medium">
                    Foundation Dashboard
                  </span>
                </div>
              ) : null}
            </div>

            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-[#c86836] transition-colors"
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
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard") ? "bg-[#c86836] text-white shadow-md relative overflow-hidden" : "hover:bg-[#1a1655] text-gray-300 hover:text-white"
                }`}
            >
              {isActive("/dashboard") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>}
              <DashboardIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Dashboard</span>}
            </Link>

            <Link
              to="/dashboard/manage-books"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/manage-books")
                  ? "bg-[#c86836] text-white shadow-md relative overflow-hidden"
                  : "hover:bg-[#1a1655] text-gray-300 hover:text-white"
                }`}
            >
              {isActive("/dashboard/manage-books") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>}
              <MenuBookIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Manage Books</span>}
            </Link>

            <Link
              to="/dashboard/add-blogs"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/add-blogs")
                  ? "bg-[#c86836] text-white shadow-md relative overflow-hidden"
                  : "hover:bg-[#1a1655] text-gray-300 hover:text-white"
                }`}
            >
              {isActive("/dashboard/add-blogs") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>}
              <LibraryBooksIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Manage Blogs</span>}
            </Link>

            <Link
              to="/dashboard/cms"
              className={`no-underline flex items-center ${isExpanded || mobileSidebar ? "gap-4 px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-all duration-300 ${isActive("/dashboard/cms")
                  ? "bg-[#c86836] text-white shadow-md relative overflow-hidden"
                  : "hover:bg-[#1a1655] text-gray-300 hover:text-white"
                }`}
            >
              {isActive("/dashboard/cms") && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>}
              <ImageIcon className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">CMS Module</span>}
            </Link>
          </nav>
        </div>

        <div className={`${isExpanded || mobileSidebar ? "px-4 space-y-2" : "flex flex-col items-center space-y-2"} transition-all duration-300 border-t border-[#1a1655] pt-6`}>
          <Link
            to="/dashboard/settings/mfa"
            className={`no-underline flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-300 ${isActive("/dashboard/settings/mfa")
              ? "bg-[#c86836] text-white shadow-md"
              : "text-gray-300 hover:text-white hover:bg-[#1a1655]"
              } ${isExpanded || mobileSidebar ? "justify-start" : "justify-center"}`}
          >
            <SecurityIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Security</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg w-full transition-all duration-300 ${isExpanded || mobileSidebar ? "justify-start" : "justify-center"
              }`}
            aria-label="Logout"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            {(isExpanded || mobileSidebar) && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isExpanded && !isMobile ? "ml-64" : !isMobile ? "ml-20" : "ml-0"
          }`}
      >
        <header
          className={`fixed top-0 z-20 flex flex-col items-center justify-center px-6 py-4 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 ${isExpanded && !isMobile ? "left-64" : !isMobile ? "left-20" : "left-0"
            } right-0`}
        >
          {isMobile && (
            <button
              onClick={() => setMobileSidebar(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0842] hover:text-[#c86836]"
              aria-label="Open menu"
            >
              <MenuIcon fontSize="medium" />
            </button>
          )}
        </header>
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-10 pt-[20px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
