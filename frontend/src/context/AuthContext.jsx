import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

import { getRootDomain } from '../utils/subdomain';

const AuthContext = createContext();

/* ================================
   Hook
================================ */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/* ================================
   API Base URL
================================ */
const getBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000';
  }
  return 'http://localhost:5000'; // replace with prod if needed
};

const API_BASE_URL = getBaseUrl();

/* ================================
   Provider
================================ */
export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();


  // State to track our manual silent auth check
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const syncedRef = useRef(false); // prevents double sync
  const checkSessionRef = useRef(false); // prevents double session check

  /* ================================
     Auto-Login (Cross-Subdomain)
  ================================ */
  /* ================================
     Auto-Login & Sync (Cross-Subdomain & Tabs)
  ================================ */
  useEffect(() => {
    const rootDomain = getRootDomain();

    // Helper to read cookie
    const hasAuthCookie = () => {
      return document.cookie.split(';').some((item) => item.trim().startsWith('sita_authenticated='));
    };

    // 1. If we are authenticated, ensure the cookie is set
    if (isAuthenticated) {
      if (!hasAuthCookie()) {
        const domainAttr = rootDomain ? `; domain=${rootDomain}` : '';
        document.cookie = `sita_authenticated=true${domainAttr}; path=/; max-age=604800; SameSite=Lax`;
      }
      setIsCheckingSession(false);
    }

    // 2. Initial Load: Check session if cookie exists OR if we are on localhost
    // On localhost, we can't share cookies, so we must always try to silent login 
    // to see if the user has an Auth0 session from another subdomain.
    const shouldCheckSession = !isAuthenticated && !isLoading && (hasAuthCookie() || window.location.hostname.includes('localhost'));

    if (shouldCheckSession) {
      // Only try if we haven't already checked to avoid loops
      if (!checkSessionRef.current) {
        checkSessionRef.current = true;
        console.log('🔍 Checking for existing session...');
        getAccessTokenSilently()
          .then(() => console.log('✅ Cross-domain session restored'))
          .catch((err) => {
            // Expected error if not logged in
            // console.log('ℹ️ No existing session found'); 
            const domainAttr = rootDomain ? `; domain=${rootDomain}` : '';
            document.cookie = `sita_authenticated=${domainAttr}; path=/; max-age=0; SameSite=Lax`;
          })
          .finally(() => setIsCheckingSession(false));
      }
    } else if (!isAuthenticated && !isLoading) {
      // No cookie, and not localhost -> definitely not logged in
      setIsCheckingSession(false);
    }

    // 3. Periodic Sync & Focus Check
    const syncSession = async () => {
      if (isLoading) return;

      const cookieExists = hasAuthCookie();
      const isLocalhost = !rootDomain;

      // REMOVED: Auto-logout logic based on missing cookie

      // Check for login if we think we might be logged in elsewhere
      if (!isAuthenticated && (cookieExists || isLocalhost) && !checkSessionRef.current) {
        // Logged in in another tab OR we are on localhost (check indiscriminately)
        // We throttle this with checkSessionRef to avoid hammering Auth0
        if (!checkSessionRef.current) {
          checkSessionRef.current = true;
          console.log('🔄 Checking session state...');
          try {
            await getAccessTokenSilently();
          } catch (e) {
            // Silent auth failed - expected if not logged in
            // console.log('ℹ️ Sync check: No session');
            if (rootDomain) {
              document.cookie = `sita_authenticated=; domain=${rootDomain}; path=/; max-age=0; SameSite=Lax`;
            }
          }
        }
      }
    };

    const intervalId = setInterval(syncSession, 2000); // Check every 2s
    window.addEventListener('focus', syncSession); // Check immediately on tab focus

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', syncSession);
    };

  }, [isLoading, isAuthenticated, getAccessTokenSilently]);

  /* ================================
     Get Auth Headers
  ================================ */
  const getAuthHeaders = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email phone',
        },
      });

      return {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  };

  /* ================================
     Sync Auth0 User → Backend
  ================================ */
  const syncUserToBackend = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/sync`,
        {
          sub: user.sub,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          picture: user.picture,
          phone_number: user.phone_number,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ User synced successfully:', response.data.user.email);
    } catch (error) {
      console.error('❌ Failed to sync user');
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
    }
  };

  /* ================================
     Run sync ONCE after login
  ================================ */
  useEffect(() => {
    if (isAuthenticated && user && !syncedRef.current) {
      syncedRef.current = true;
      syncUserToBackend();
    }
  }, [isAuthenticated, user]);

  /* ================================
     Logout
  ================================ */
  const logout = () => {
    localStorage.removeItem('user');
    syncedRef.current = false;
    checkSessionRef.current = false; // Allow re-check on next login

    // Clear shared cookie
    const rootDomain = getRootDomain();
    const domainAttr = rootDomain ? `; domain=${rootDomain}` : '';
    document.cookie = `sita_authenticated=${domainAttr}; path=/; max-age=0; SameSite=Lax`;

    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  /* ================================
     Update User Profile
  ================================ */
  const updateUserProfile = async (uid, updateData) => {
    try {
      if (!uid) throw new Error('No user ID provided');

      const config = await getAuthHeaders();
      const encodedUID = encodeURIComponent(uid);

      const response = await axios.put(
        `${API_BASE_URL}/api/users/${encodedUID}`,
        updateData,
        config
      );

      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update profile');
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update profile'
      );
    }
  };

  /* ================================
     Context Value
  ================================ */
  const value = {
    currentUser: user,
    isAuthenticated,
    // Combine Auth0 loading + our custom session check
    isLoading: isLoading || isCheckingSession,
    loading: isLoading || isCheckingSession,
    loginUser: loginWithRedirect,
    loginWithRedirect,
    logout,
    updateUserProfile,
    getAccessTokenSilently,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
