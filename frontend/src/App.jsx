import { Outlet, useLocation } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import { useEffect, useState } from 'react'
import Loading from './components/Loading'
import ScrollToTop from './components/ScrollToTop'
import clarity from '@microsoft/clarity'
import { DataProvider } from './context/DataContext'

function App() {
  const location = useLocation()
  const [backendReady, setBackendReady] = useState(false)
  const [dataPreloaded, setDataPreloaded] = useState(false)
  const [appReady, setAppReady] = useState(false)
  const [preloadedData, setPreloadedData] = useState({})

  // Global Admin Auth Check (Hybrid: LS -> Cookie)
  useEffect(() => {
    const syncAdminAuth = async () => {
      // Always verify with backend to ensure cookie/LS match
      // This handles both:
      // 1. Login Sync: Cookie exists -> Set LS
      // 2. Logout Sync: Cookie missing -> Clear LS

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/admin-auth/verify`,
          {
            credentials: 'include',
            method: 'GET'
          }
        );

        const currentToken = localStorage.getItem('adminToken');

        if (response.ok) {
          const data = await response.json();
          if (data.valid && data.token) {
            // If we have a valid cookie but no LS (or different), sync it
            if (currentToken !== data.token) {
              localStorage.setItem('adminToken', data.token);
              window.dispatchEvent(new Event("admin-auth-change")); // Custom event
            }
          }
        } else {
          // If backend says invalid/no-cookie, but we have LS, we must logout
          if (currentToken) {
            localStorage.removeItem('adminToken');
            window.dispatchEvent(new Event("admin-auth-change"));
          }
        }
      } catch (e) {
        // Network error? Keep LS for now to avoid flickering, or separate logic
      }
    };

    syncAdminAuth();

    // Listen for storage events (cross-tab same-origin)
    const handleStorageChange = () => {
      // Re-run sync if storage changes
      syncAdminAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, []);

  useEffect(() => {
    clarity.init("tke6pwgfvi")
  }, [])

  useEffect(() => {
    const checkBackendHealth = async () => {
      const maxRetries = 15
      const retryDelay = 800

      const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 60000)

          const response = await fetch(
            `${backendUrl}/api/health`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal
            }
          )

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()
            setBackendReady(true)
            return
          } else {
            console.warn(`⚠️ Health check status: ${response.status}`)
          }
        } catch (error) {
          if (error.name === 'AbortError') {
          } else {
          }
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }

      console.error('❌ Backend health check failed after 10 attempts')
      setBackendReady(false)
      setAppReady(true)
    }

    checkBackendHealth()
  }, [])
  useEffect(() => {
    if (!backendReady) return

    const preloadAllData = async () => {
      try {
        const baseUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')

        const safeFetch = async (url, name) => {
          try {
            const response = await fetch(url)
            if (!response.ok) {
              console.error(`❌ ${name} failed with status: ${response.status}`)
              return null
            }
            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
              console.error(`❌ ${name} returned non-JSON content`)
              return null
            }
            return response
          } catch (error) {
            console.error(`❌ ${name} fetch error:`, error.message)
            return null
          }
        }

        const [
          booksRes, blogsRes, pagesRes, reviewsRes
        ] = await Promise.all([
          safeFetch(`${baseUrl}/api/books`, 'Books'),
          safeFetch(`${baseUrl}/api/blogs`, 'Blogs'),
          safeFetch(`${baseUrl}/api/pages`, 'Pages'),
          safeFetch(`${baseUrl}/api/reviews/all?approved=true`, 'Reviews')
        ])

        const data = {
          books: booksRes ? await booksRes.json() : [],
          blogs: blogsRes ? await blogsRes.json() : [],
          pages: pagesRes ? await pagesRes.json() : [],
          reviews: reviewsRes ? await reviewsRes.json() : []
        }

        setPreloadedData(data)
        setDataPreloaded(true)

        setTimeout(() => setAppReady(true), 300)

      } catch (error) {
        console.error('❌ Preload error:', error)
        setPreloadedData({
          banner: null,
          books: [],
          blogs: [],
          letters: [],
          corners: [],
          readerThoughts: null,
          author: null,
          pages: [],
          reviews: []
        })
        setDataPreloaded(false)
        setAppReady(true)
      }
    }

    preloadAllData()
  }, [backendReady])

  if (!appReady) {
    return <Loading />
  }

  if (!backendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#e5c4b5]/30 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#f4ebce]/50 rounded-full blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-[#8b171b]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl w-full mx-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 text-center">
            {/* 404 Visual */}
            <div className="relative mb-6">
              <h1 className="text-[150px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b171b] via-[#8b171b] to-[#8b171b] select-none opacity-20 blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-110">
                404
              </h1>
              <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8b171b] via-[#f6981e] to-[#8b171b] relative z-10">
                404
              </h1>
            </div>

            {/* Content */}
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight normal-case">
              Page Not Found
            </h2>

            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = 'https://sitashakti.com'}
                className="group relative px-8 py-3.5 bg-[#8b171b] text-white rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#8b171b]/20 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b171b] to-[#f6981e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </span>
              </button>

              <button
                onClick={() => navigate(-1)}
                className="group px-8 py-3.5 bg-white text-[#8b171b] border border-[#8b171b]/30 rounded-full font-medium transition-all hover:bg-[#8b171b] hover:text-black hover:border-[#8b171b] hover:shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 group-hover:-translate-x-1 hover:text-black transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </button>
            </div>

            {/* Decorative bottom text */}
            <p className="mt-12 text-xs text-[#8b171b]/40 uppercase tracking-widest font-medium">
              Error Code: 404 <br />
              backend service
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <DataProvider data={preloadedData}>
        <div className="frontend-wrapper">
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen max-w-screen-3xl mx-auto px-0 py-0 font-primary">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <Analytics />
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
