import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* The Sita Factor */}
          <div>
            <h3 className="text-[#A67365] mb-4">The Sita Factor</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sita-factor" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  The Sita Factor
                </Link>
              </li>
              <li>
                <Link to="/yoga-therapy" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Yoga Therapy Programs
                </Link>
              </li>
              <li>
                <Link to="/ayurveda" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Ayurveda Integration
                </Link>
              </li>
              <li>
                <Link to="/kosha-counseling" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Kosha Counseling
                </Link>
              </li>
              <li>
                <Link to="/book-meeting" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Book a Meeting
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#A67365] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  About Sita
                </Link>
              </li>
              <li>
                <Link to="/sita-factor" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  The Sita Factor
                </Link>
              </li>
              <li>
                <Link to="/book-meeting" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Contact / Book a Meeting
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[#A67365] mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-[#A67365] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#A67365] mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-gray-600">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <span>contact@sitafactor.com</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Wellness Center, Your City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200
                flex w-full
                items-center justify-between
                text-gray-600 text-sm">
          <p>
            &copy; {new Date().getFullYear()} The Sita Factor. All rights reserved.
          </p>

          <a
            href="https://lumos.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#A67365] transition-colors"
          >
            Created by LUMOS | Lumos.in
          </a>
        </div>
      </div>
    </footer>
  );
}