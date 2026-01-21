import React, { useState, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import getBaseUrl from '../../utils/baseURL';

const EbookReader = () => {
  const { id } = useParams();
  const { getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [ebookUrl, setEbookUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEbookUrl = async () => {
      try {
        setLoading(true);

        const tokenClaims = await getIdTokenClaims();
        const token = tokenClaims?.__raw;

        const response = await axios.get(
          `${getBaseUrl()}/api/books/${id}/ebook`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000
          }
        );

        setEbookUrl(response.data.ebookUrl);
        setLoading(false);

      } catch (err) {
        console.error('Error fetching eBook:', err);
        setError(err.response?.data?.message || 'Failed to load eBook');
        setLoading(false);
      }
    };

    fetchEbookUrl();
  }, [id, getIdTokenClaims]);

  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    const disableKeys = (e) => {
      if (e.ctrlKey && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeys);
    document.addEventListener('selectstart', disableContextMenu);

    const style = document.createElement('style');
    style.innerHTML = `
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeys);
      document.removeEventListener('selectstart', disableContextMenu);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center max-w-md px-6">
          <div className="relative mb-8">
            <div className="text-9xl animate-bounce filter drop-shadow-2xl">📖</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>

          <h2 className="text-white text-3xl font-bold mb-3 animate-pulse">
            Loading Your Book...
          </h2>
          <p className="text-blue-300 text-lg">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md">
          <div className="text-red-500 text-7xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Unable to Load</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg"
          >
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="text-sm text-gray-600">Use arrow keys to navigate</div>
      </div>

      <div className="pt-16 h-full">
        <ReactReader
          url={ebookUrl}
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
          getRendition={(rendition) => {
            rendition.themes.default({
              '::selection': {
                background: 'none'
              }
            });
          }}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-2 rounded-full text-sm">
        ← → arrow keys to turn pages
      </div>
    </div>
  );
};

export default EbookReader;
