// frontend/src/components/Cms/SectionRenderer.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import BookingModal from '../../../components/BookingModal';
import SitaBreadcrumb from '../../breadcrumbs/SitaBreadcrumb';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function SectionRenderer({ section }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  if (!section || !section.key) return null;

  const { key, content } = section;

  switch (key) {
    case 'hero':
      return <HeroSection content={content} />;
    case 'html':
      return <HtmlSection content={content} />;
    case 'links':
      return <LinksSection content={content} />;
    case 'faq':
      return <FaqSection content={content} />;
    case 'booking':
      return <BookingSection content={content} />;
    case 'main':
      return <MainSection content={content} />;
    default:
      return null;
  }
}

// Booking Section Component
function BookingSection({ content }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { eventId, buttonText = "Book Now", alignment = "center" } = content;

  if (!eventId) return null;

  return (
    <>
      <section className={`py-12 px-4 text-${alignment}`}>
        <div className="container mx-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 inline-block"
          >
            {buttonText}
          </button>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={eventId}
      />
    </>
  );
}

// Hero Section Component (Updated)
function HeroSection({ content }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const {
    title = '',
    subtitle = '',
    backgroundImage = '/images/about-banner.webp',
    primaryCta = {},
  } = content;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Workshops", path: "/" },
    { label: title || "Page", path: null }
  ];

  const handleCtaClick = () => {
    if (primaryCta.eventId) {
      setSelectedEventId(primaryCta.eventId);
      setIsModalOpen(true);
    } else if (primaryCta.href) {
      window.location.href = primaryCta.href;
    }
  };

  const ctaStyle = {
    backgroundColor: primaryCta.bgColor || "#3b82f6",
    color: primaryCta.textColor || "#ffffff",
  };

  return (
    <>
      {/* 1. Hero Image - Always first */}
      <section className="sita-inner-hero">
        <div className="sita-hero-inner-bg"></div>
        <div className="sita-inner-hero-image">
          <img src={backgroundImage || "/images/about-banner.webp"} alt="Hero Banner" />
        </div>
      </section>

      {/* 2. Breadcrumbs using SitaBreadcrumb - Now after image */}
      <SitaBreadcrumb items={breadcrumbItems} />

      {/* 3. Hero Content (Workshop Section style) - Now after image */}
      <section className="sita-workshop-section" style={{ padding: '40px 0' }}>
        <div className="container">
          {title && <h2 className="text-center">{title}</h2>}
          <img src="/sita-motif.webp" alt="Sita Motif" className="motif mx-auto my-3 block" style={{ width: 'auto', height: 'auto' }} />

          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              {subtitle && <p className="mb-4">{subtitle}</p>}

              {primaryCta.label && (
                <div className="mt-4">
                  <button
                    onClick={handleCtaClick}
                    className="px-6 py-3 masterclass-card-btn font-bold shadow-md transition hover:-translate-y-1 inline-block"
                    style={ctaStyle}
                  >
                    {primaryCta.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={selectedEventId}
      />
    </>
  );
}

// HTML Section Component with Bootstrap Grid Support
function HtmlSection({ content }) {
  // Extract styling options
  const backgroundColor = content.style?.backgroundColor || '#ffffff';
  const padding = content.style?.padding || 'py-12';
  const maxWidth = content.style?.maxWidth || 'max-w-7xl';
  const columnGap = content.columnGap || 'gap-6';

  // Handle both old (single content) and new (columns array) formats
  const hasColumns = content.columns && Array.isArray(content.columns) && content.columns.length > 0;
  const columns = hasColumns
    ? content.columns
    : [{ id: 'col-1', content: content.content || '', colSize: 12 }];

  // Helper function to convert Bootstrap column size to Tailwind classes
  const getColClass = (colSize) => {
    const size = colSize || 12;
    const sizeMap = {
      1: 'md:col-span-1',
      2: 'md:col-span-2',
      3: 'md:col-span-3',
      4: 'md:col-span-4',
      5: 'md:col-span-5',
      6: 'md:col-span-6',
      7: 'md:col-span-7',
      8: 'md:col-span-8',
      9: 'md:col-span-9',
      10: 'md:col-span-10',
      11: 'md:col-span-11',
      12: 'col-span-12',
    };
    return `col-span-12 ${sizeMap[size] || 'md:col-span-6'}`;
  };

  return (
    <section className={`${padding} w-full`} style={{ backgroundColor }}>
      {/* Inject custom CSS if provided */}
      {content.css && (
        <style dangerouslySetInnerHTML={{ __html: content.css }} />
      )}

      <div className={`${maxWidth} mx-auto px-4`}>
        {columns.length > 1 ? (
          // Multi-column Bootstrap-style grid layout
          <div className={`grid grid-cols-12 ${columnGap}`}>
            {columns.map((column, index) => (
              <div
                key={column.id || `col-${index}`}
                className={getColClass(column.colSize)}
              >
                <div
                  className="html-content"
                  dangerouslySetInnerHTML={{ __html: column.content || '' }}
                />
              </div>
            ))}
          </div>
        ) : (
          // Single column layout (backward compatible)
          <div
            className="html-content"
            dangerouslySetInnerHTML={{
              __html: columns[0]?.content || content.content || ''
            }}
          />
        )}
      </div>
    </section>
  );
}

// Main Section Component (for Visual Page Builder)
function MainSection({ content }) {
  return (
    <section className="w-full">
      {/* Inject custom CSS */}
      {content.css && (
        <style dangerouslySetInnerHTML={{ __html: content.css }} />
      )}
      {/* Inject HTML content */}
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </section>
  );
}

// Links Section Component
function LinksSection({ content }) {
  const { title = 'Quick Links', items = [] } = content;

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <span className="font-semibold">{item.label}</span>
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section Component (with styling support)
function FaqSection({ content }) {
  const { title = 'FAQs', items = [], style = {} } = content;
  const [openIndex, setOpenIndex] = useState(null);

  // Extract styles with defaults
  const backgroundColor = style.backgroundColor || '#ffffff';
  const titleColor = style.titleColor || '#1f2937';
  const questionColor = style.questionColor || '#1f2937';
  const answerColor = style.answerColor || '#6b7280';
  const accentColor = style.accentColor || '#3b82f6';
  const padding = style.padding || 'py-16';

  if (items.length === 0) return null;

  return (
    <section className={`${padding}`} style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
        )}

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: accentColor + '30' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span
                  className="font-semibold pr-4"
                  style={{ color: questionColor }}
                >
                  {item.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: accentColor }}
                  />
                ) : (
                  <ChevronDown
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: accentColor }}
                  />
                )}
              </button>
              {openIndex === i && (
                <div
                  className="p-4 border-t"
                  style={{
                    borderColor: accentColor + '30',
                    backgroundColor: backgroundColor === '#ffffff' ? '#f9fafb' : backgroundColor
                  }}
                >
                  <p style={{ color: answerColor }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
