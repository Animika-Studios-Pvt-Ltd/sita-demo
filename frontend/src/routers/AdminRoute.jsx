import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageNotFound from './PageNotFound';

const AdminRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin-auth/verify`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PageNotFound />;
  }
  return children;
};

export default AdminRoute;
