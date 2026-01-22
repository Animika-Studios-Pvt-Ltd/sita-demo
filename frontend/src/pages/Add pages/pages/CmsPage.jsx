// src/components/Dashboard/admin/pages/CmsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchCmsPage } from "../../../utils/cmsApi";
import { fetchTenantInfo, getTenantSubdomain } from "../../../utils/tenantApi";
import Header from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SectionRenderer from "../Cms/SectionRenderer";

export default function CmsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cmsEnabled, setCmsEnabled] = useState(null);
  const [error, setError] = useState(null);

  // System routes that should NOT be handled as CMS pages
  const SYSTEM_ROUTES = new Set([
    "admin", "login", "callback", "mfa-verify", "super-admin",
    "doctor", "patient", "receptionist", "home", "index"
  ]);

  console.log('🎯 CmsPage rendered:', {
    slug,
    pathname: location.pathname,
    isSystemRoute: SYSTEM_ROUTES.has(slug)
  });

  // Block system routes
  if (SYSTEM_ROUTES.has(slug)) {
    console.log('🚫 System route blocked:', slug);
    return null;
  }

  // Block if no slug
  if (!slug) {
    console.warn("⚠️ CmsPage rendered without slug");
    return null;
  }

  useEffect(() => {
    const checkCmsAndLoadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get subdomain
        const subdomain = getTenantSubdomain();

        if (!subdomain) {
          console.warn('⚠️ No subdomain detected');
          setError('No subdomain detected');
          setLoading(false);
          return;
        }

        console.log('🔍 Checking CMS for:', subdomain, 'slug:', slug);

        // Get tenant info to check CMS status
        const tenant = await fetchTenantInfo(subdomain);

        const isCmsEnabled = tenant?.features?.cms && tenant?.cms?.enabled !== false;

        console.log('🔍 CMS Status:', isCmsEnabled ? 'Enabled ✅' : 'Disabled 🚫');

        setCmsEnabled(isCmsEnabled);

        if (!isCmsEnabled) {
          console.log('🚫 CMS disabled, redirecting to home...');
          navigate('/', { replace: true });
          return;
        }

        // ✅ CMS is enabled - Load CMS page
        console.log("📄 Fetching CMS page:", slug);

        const data = await fetchCmsPage(slug);

        console.log('📦 CMS API Response:', data);

        if (!data) {
          console.warn("⚠️ No data returned for slug:", slug);
          setError('Page not found');
          setCms(null);
          setLoading(false);
          return;  // ✅ This will now work correctly
        }

        if (!data.sections || data.sections.length === 0) {
          console.warn("⚠️ No sections in page:", slug);
          setError('Page has no content');
          setCms(null);
          setLoading(false);
          return;
        }

        console.log("✅ CMS page loaded successfully:", slug, "Sections:", data.sections.length);
        setCms(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("❌ CMS load error:", err);
        setError(err.message || 'Failed to load page');
        setCms(null);
        setLoading(false);
      }
    };

    checkCmsAndLoadPage();
  }, [slug, navigate]);

  // Loading state
  if (loading || cmsEnabled === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading {slug}...</p>
        </div>
      </div>
    );
  }

  // CMS disabled
  if (!cmsEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-yellow-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">CMS Not Available</h2>
          <p className="text-gray-600 mb-6">
            Content management is currently disabled for this site.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Page not found or error
  if (!cms || error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-gray-400 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
            <p className="text-gray-500 mb-2">
              The page <span className="font-mono text-blue-600">/{slug}</span> does not exist or is unpublished.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Render CMS page
  console.log('✅ Rendering CMS page:', slug, 'with', cms.sections.length, 'sections');

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {cms.sections.map((section, i) => {
          console.log(`🎨 Rendering section ${i}:`, section.key, section.content);
          return <SectionRenderer key={section._id || i} section={section} />;
        })}
      </main>
    </div>
  );
}
