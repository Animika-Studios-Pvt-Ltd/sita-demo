import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImage from 'figma:asset/sita.png';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    isActive(path)
      ? 'text-[#A67365]'
      : 'text-gray-700 hover:text-[#A67365] transition-colors';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center py-3">

          {/* Logo (BIGGER) */}
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="Sita" style={{ height: '85px' }} />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-8 ml-16">

            <Link to="/" className={linkClass('/')}>Home</Link>

            <Link to="/about" className={linkClass('/about')}>
              About Sita
            </Link>

            {/* SITA FACTOR DROPDOWN */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#A67365]"
              >
                The Sita Factor
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden">
                  <Link to="/sita-factor" className="block px-4 py-2 hover:bg-gray-50">Overview</Link>
                  <Link to="/yoga-therapy" className="block px-4 py-2 hover:bg-gray-50">Yoga Therapy</Link>
                  <Link to="/ayurveda" className="block px-4 py-2 hover:bg-gray-50">Ayurveda</Link>
                  <Link to="/kosha-counseling" className="block px-4 py-2 hover:bg-gray-50">Kosha Counseling</Link>
                </div>
              )}
            </div>

            <Link to="/services" className={linkClass('/services')}>
              Services
            </Link>

            <Link to="/events" className={linkClass('/events')}>
              Events
            </Link>

            {/* BOOK A MEETING */}
            <Link
              to="/book-meeting"
              className={linkClass('/book-meeting')}
            >
              Book a Meeting
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#A67365] hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE NAV (unchanged) */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2">About Sita</Link>

            <div className="px-3 pt-3 text-sm font-semibold text-[#A67365]">
              The Sita Factor
            </div>

            <Link to="/sita-factor" onClick={() => setIsOpen(false)} className="block px-6 py-2">Overview</Link>
            <Link to="/yoga-therapy" onClick={() => setIsOpen(false)} className="block px-6 py-2">Yoga Therapy</Link>
            <Link to="/ayurveda" onClick={() => setIsOpen(false)} className="block px-6 py-2">Ayurveda</Link>
            <Link to="/kosha-counseling" onClick={() => setIsOpen(false)} className="block px-6 py-2">Kosha Counseling</Link>

            <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2">Services</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="block px-3 py-2">Events</Link>

            <Link to="/book-meeting" onClick={() => setIsOpen(false)} className="block px-3 py-2">
              Book a Meeting
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}
