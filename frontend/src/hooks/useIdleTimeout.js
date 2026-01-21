import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 1 hour)
 * @returns {Object} - Contains resetTimer function for manual reset
 */
const useIdleTimeout = (timeout = 3600000) => {
  const navigate = useNavigate()
  const location = useLocation()
  const timeoutRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const isInitializedRef = useRef(false)

  // Only log in development
  const isDev = process.env.NODE_ENV === 'development'
  const log = (...args) => {
  }

  log('🔧 useIdleTimeout initialized:', timeout / 60000, 'minutes')
  const logout = useCallback(() => {
    log('🚨 Logout triggered')

    const exemptPaths = [
      '/dashboard/orders',
    ]

    const currentPath = window.location.pathname

    if (exemptPaths.includes(currentPath)) {
      log('🛡️ Exempt page - logout cancelled')
      return
    }

    log('🚪 Logging out admin...')

    localStorage.removeItem('adminToken')
    localStorage.removeItem('lastActivity')

    navigate('/', { replace: true })
  }, [navigate, isDev])

  const resetTimer = useCallback(() => {
    const exemptPaths = ['/dashboard/orders']
    const currentPath = window.location.pathname

    if (exemptPaths.includes(currentPath)) {
      log('🛡️ Exempt page - timer not set')
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    const now = Date.now()
    lastActivityRef.current = now
    localStorage.setItem('lastActivity', now.toString())

    log('⏱️ Timer reset at', new Date(now).toLocaleTimeString())

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    log(`🔴 Auto-logout in ${timeout / 60000} minutes`)
    timeoutRef.current = setTimeout(() => {
      log('⏰ Inactivity timeout reached')
      logout()
    }, timeout)

  }, [timeout, logout, isDev])

  const handleActivity = useCallback(() => {
    const now = Date.now()
    const lastActivity = lastActivityRef.current
    const timeSinceLastReset = now - lastActivity

    if (timeSinceLastReset > 5000) {
      log('👆 Activity detected')
      resetTimer()
    }
  }, [resetTimer, isDev])

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')

    if (!adminToken) {
      log('No admin token - idle timeout not initialized')
      return
    }

    if (!isInitializedRef.current) {
      log('Admin idle timeout active')
      isInitializedRef.current = true
    }

    log('📍 Current page:', location.pathname)

    const storedActivity = localStorage.getItem('lastActivity')
    if (storedActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(storedActivity, 10)
      log(`Last activity: ${Math.floor(timeSinceLastActivity / 60000)} min ago`)

      const exemptPaths = ['/dashboard/orders']

      if (timeSinceLastActivity > timeout && !exemptPaths.includes(location.pathname)) {
        log('Session expired - logging out')
        logout()
        return
      }
    }

    resetTimer()

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'click', 'touchstart']

    log('👂 Monitoring user activity')

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      log('🧹 Cleaning up idle timeout')
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [location.pathname, timeout, logout, resetTimer, handleActivity, isDev])

  return { resetTimer }
}

export default useIdleTimeout
