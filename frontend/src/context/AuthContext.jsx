import React, { createContext, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }
  return "http://localhost:5000";
};

const API_BASE_URL = getBaseUrl();

export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const getAuthHeaders = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email phone"
        }
      });
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    } catch (error) {
      console.error('Error getting token:', error);
      return {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  };

  const syncUserToBackend = async () => {
    if (!isAuthenticated || !user) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/sync`,
        {
          sub: user.sub,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          picture: user.picture,
          phone_number: user.phone_number
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('❌ Failed to sync user:', error.message);
      console.error('Full URL:', `${API_BASE_URL}/api/users/sync`);
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      syncUserToBackend();
    }
  }, [isAuthenticated, user]);

  const logout = () => {
    localStorage.removeItem('user');
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const updateUserProfile = async (uid, updateData) => {
    try {
      if (!uid) {
        throw new Error("No user ID provided");
      }

      const config = await getAuthHeaders();
      const encodedUID = encodeURIComponent(uid);

      const response = await axios.put(
        `${API_BASE_URL}/api/users/${encodedUID}`,
        updateData,
        config
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile"
      );
    }
  };
  const value = {
    currentUser: user,
    isAuthenticated,
    isLoading,
    loading: isLoading,
    loginUser: loginWithRedirect,
    loginWithRedirect,
    logout,
    updateUserProfile,
    getAccessTokenSilently,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
