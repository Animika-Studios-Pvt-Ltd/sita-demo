import { Outlet } from 'react-router-dom'
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
  const [backendReady, setBackendReady] = useState(false)
  const [dataPreloaded, setDataPreloaded] = useState(false)
  const [appReady, setAppReady] = useState(false)
  const [preloadedData, setPreloadedData] = useState({})

  useEffect(() => {
    clarity.init("tke6pwgfvi")
  }, [])

  useEffect(() => {
    const checkBackendHealth = async () => {
      const maxRetries = 10
      const retryDelay = 3000

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Connect to Server
          </h1>
          <p className="text-gray-600 mb-6">
            The backend service is currently unavailable. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#C76F3B] text-white px-6 py-2 rounded hover:bg-[#A85F2F] transition-colors"
          >
            Retry Connection
          </button>
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
          <main className="min-h-screen max-w-screen-3xl mx-auto px-0 py-1 font-primary">
            <Outlet />
          </main>
          <Footer />
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
