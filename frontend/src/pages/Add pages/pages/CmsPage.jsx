// src/components/Dashboard/admin/pages/CmsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchCmsPage } from "../../../utils/cmsApi";
import { fetchTenantInfo, getTenantSubdomain } from "../../../utils/tenantApi";
import Header from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SectionRenderer from "../Cms/SectionRenderer";

export default function CmsPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;
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
              Error Code: 404
            </p>
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
          return <SectionRenderer key={section._id || i} section={section} pageSlug={slug} />;
        })}
      </main>
    </div>
  );
}
