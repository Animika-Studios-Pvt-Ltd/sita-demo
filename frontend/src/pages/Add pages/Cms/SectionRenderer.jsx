// frontend/src/components/Cms/SectionRenderer.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import BookingModal from '../../../components/BookingModal';
import SitaBreadcrumb from '../../breadcrumbs/SitaBreadcrumb';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ChevronDown, ChevronUp, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import BlockIcon from "@mui/icons-material/Block";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "../../../redux/features/cart/cartSlice";
import parse from 'html-react-parser';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useParams, useLocation } from 'react-router-dom';

const sanitizeDescription = (html) => {
  if (!html) return "";
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

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
    case 'events':
      return <EventsSection content={content} />;
    case 'blogs':
      return <BlogsSection content={content} />;
    case 'books':
      return <BooksSection content={content} />;
    case 'articles':
      return <ArticlesSection content={content} />;
    case 'podcasts':
      return <PodcastsSection content={content} />;
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
      <section className="booking-inner-hero">
        <div className="booking-inner-hero-bg"></div>
        <div className="booking-inner-hero-image">
          <img src={backgroundImage || "/images/about-banner.webp"} alt="Hero Banner" />
        </div>
      </section>

      {/* 2. Breadcrumbs using SitaBreadcrumb - Now after image */}
      <SitaBreadcrumb items={breadcrumbItems} />

      {/* 3. Hero Content (Workshop Section style) - Now after image */}
      <section className="booking-section" style={{ padding: '40px 0' }}>
        <div className="container text-center sita-factor-content" data-aos="fade-up">
          {title && <h2>{title}</h2>}
          <img src="/sita-motif.webp" alt="Sita Motif" className="motif mx-auto justify-center my-3 block" style={{ width: 'auto', height: 'auto' }} />

          {subtitle && <p className="sita-factor-text mb-4">{subtitle}</p>}

          {primaryCta.label && (
            <div className="mt-4">
              <button
                onClick={handleCtaClick}
                className="px-6 py-3 masterclass-card-btn shadow-md transition hover:-translate-y-1 inline-block"
                style={ctaStyle}
              >
                {primaryCta.label}
              </button>
            </div>
          )}
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
  const padding = 'py-[40px]';
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

  // Parser options to inject classes
  const parserOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag') {
        if (domNode.name === 'h1') {
          // Add sita-factor-heading class to h1 and increase size by 5px (30px + 5px = 35px)
          const existingClass = domNode.attribs.class || '';
          domNode.attribs.class = `${existingClass} sita-factor-heading`.trim();
          domNode.attribs.style = `${domNode.attribs.style || ''}; font-size: 35px;`;
        }
        if (domNode.name === 'h2') {
          // Add sita-factor-highlight class to h2
          const existingClass = domNode.attribs.class || '';
          domNode.attribs.class = `${existingClass} sita-factor-highlight`.trim();
        }
      }
    }
  };

  return (
    <section className={`${padding} w-full container sita-factor-content`} style={{ backgroundColor }}>
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
                <div className="html-content">
                  {parse(column.content || '', parserOptions)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Single column layout (backward compatible)
          <div className="html-content">
            {parse(columns[0]?.content || content.content || '', parserOptions)}
          </div>
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
    <section className="py-[40px] bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 sita-factor-highlight" style={{ fontFamily: 'Montserrat-Light' }}>{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <span style={{ fontFamily: 'Montserrat-Regular' }}>{item.label}</span>
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
  const { title = 'FAQs', items = [], style = { fontFamily: 'Montserrat-Light' } } = content;
  const [openIndex, setOpenIndex] = useState(null);

  // Extract styles with defaults
  const backgroundColor = style.backgroundColor || '#ffffff';
  const titleColor = style.titleColor || '#1f2937';
  const questionColor = style.questionColor || '#1f2937';
  const answerColor = style.answerColor || '#6b7280';
  const accentColor = style.accentColor || '#8b171b';
  const padding = style.padding || 'py-[40px]';

  if (items.length === 0) return null;

  return (
    <section className={`${padding} sita-faq-section`} style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="text-3xl font-bold text-center mb-12 sita-factor-highlight"
            style={{ color: '#8b171b', fontFamily: 'Montserrat-Light' }}
          >
            {title}
          </h2>
        )}

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: accentColor + '30', fontFamily: 'Montserrat-Regular' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Montserrat-Regular' }}
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
                  <p style={{ color: answerColor, fontFamily: 'Montserrat-Light' }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === DYNAMIC CONTENT SECTIONS ===

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const DynamicSectionLayout = ({ title, children, linkTo, linkText = "View All" }) => (
  <section className="py-[40px] bg-white">
    <div className="container mx-auto px-4">
      {title && (
        <div className="text-center mb-12">
          <h2 className="font-serifSita text-[#8b171b] text-3xl md:text-4xl leading-tight mb-2">
            {title.toUpperCase()}
          </h2>
          <img src="/sita-motif.webp" alt="Motif" className="mx-auto w-32 md:w-40" />
        </div>
      )}

      {children}

      {linkTo && (
        <div className="text-center mt-12">
          <Link
            to={linkTo}
            className="inline-block px-8 py-3 bg-[#8b171b] text-white font-montserratLight rounded-full hover:bg-[#a62024] transition-colors"
          >
            {linkText}
          </Link>
        </div>
      )}
    </div>
  </section>
);


function EventsSection({ content }) {
  const [events, setEvents] = useState([]);
  const count = content.count || 3;
  const { id } = useParams(); // Get current page ID (if any)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();

        // Filter upcoming AND exclude current event
        const upcoming = data.filter(e => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const [y, m, d] = e.date.split("-").map(Number);
          const eventDate = new Date(y, m - 1, d);

          if (id && e._id === id) return false;
          if (id && e.bookingUrl === id) return false;

          return eventDate >= today;
        });

        setEvents(upcoming.slice(0, count));
        setTimeout(() => AOS.refresh(), 100);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, [count, id]);

  if (events.length === 0) return null;

  const showCarousel = events.length > 3;

  const EventCard = ({ event }) => {
    const dateObj = new Date(event.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const eventImage = event.imageUrl || "https://images.unsplash.com/photo-1544367563-12123d8965cd";

    return (
      <div className="group rounded-2xl overflow-hidden bg-white shadow-md flex flex-col border-1 border-transparent transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#8b171b] h-full">
        {/* IMAGE */}
        <div className="relative w-full aspect-[16/9] overflow-hidden shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url(${eventImage?.startsWith("http") ? eventImage : `${BACKEND_BASE_URL}${eventImage}`})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col space-y-3 flex-1">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#8b171b] line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-start gap-3 flex-1">
            <div className="px-3 py-2 bg-[#8b171b] text-white rounded-lg text-center shrink-0">
              <div className="text-xs uppercase">{month}</div>
              <div className="text-lg font-bold">{day}</div>
            </div>

            <div className="text-sm text-gray-600 flex-1">
              <div>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div>Location: {event.location || "Location TBA"}</div>
              {Number(event.availability) > 0 && (
                <p className="text-sm text-gray-700 mt-1">
                  Available Slots: <span className="font-semibold text-[#8b171b]">{event.availability}</span>
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-2">
            {Number(event.availability) === 0 ? (
              <span className="block w-full text-center py-2 bg-gray-500 text-white rounded-lg">Bookings Closed</span>
            ) : event.bookingUrl ? (
              <Link to={`/booking/${event.bookingUrl || event._id}`} className="block w-full text-center no-underline py-2 bg-[#8b171b] text-white font-semibold rounded-lg transition-all duration-300 hover:bg-[#a62024] hover:scale-[1.02]">
                Book Now
              </Link>
            ) : (
              <span className="block w-full text-center py-2 bg-lime-600 text-white rounded-lg">Coming Soon</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DynamicSectionLayout title={content.title}>
      {showCarousel ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 px-2"
        >
          {events.map(event => (
            <SwiperSlide key={event._id} className="h-auto pb-8">
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </DynamicSectionLayout>
  );
}


function BlogsSection({ content }) {
  const [currentBlogs, setCurrentBlogs] = useState([]);
  const count = content.count || 3;
  const { id } = useParams();

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const latest = data
          .filter(b => !b.suspended && b._id !== id && b.slug !== id) // Exclude current
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, count);
        setCurrentBlogs(latest);
        // Refresh AOS to ensure new elements animate
        setTimeout(() => AOS.refresh(), 100);
      } catch (err) {
        console.error("Failed to fetch latest blogs", err);
      }
    };
    fetchLatestBlogs();
  }, [count, id]);

  if (currentBlogs.length === 0) return null;

  return (
    <DynamicSectionLayout title={null}>
      {/* HEADER */}
      <div className="" data-aos="fade-up" data-aos-duration="1200">
        <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
          {content.title || "Latest Blogs"}
        </h2>
        <img
          src="/sita-motif.webp"
          alt="Sita Motif"
          className="mx-auto mt-1 w-40 sm:w-48 mb-8"
        />
      </div>

      {/* BLOG GRID */}
      <div className="row">
        {currentBlogs.map((blog, index) => {
          const btnColors = [
            "pink",
            "peach",
            "rose",
          ];
          const btnColor = btnColors[index % btnColors.length]; // Cycle colors

          return (
            <div
              key={blog._id}
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}>
              <div className="sita-blog-card">
                <div className="sita-blog-image">
                  <img
                    src={
                      blog.image?.startsWith("http")
                        ? blog.image
                        : `${BACKEND_BASE_URL}${blog.image}`
                    }
                    className="img-fluid w-100"
                    alt={blog.title}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <p className="blog-date">
                    {new Date(blog.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>

                <h4>{blog.title}</h4>

                <div className="blog-description-wrapper">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: sanitizeDescription(
                        blog.description.length > 150
                          ? blog.description.slice(0, 150) + "..."
                          : blog.description,
                      ),
                    }}
                  />
                </div>

                <span className="blog-author mb-3">
                  - {blog.author || "Sita Severson"}
                </span>

                <Link
                  to={`/blogs/${blog.slug || blog._id}`}
                  className={`sita-blog-btn ${btnColor}`}
                  style={{ minWidth: "150px", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                  {blog.readMoreText || "Read More"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </DynamicSectionLayout>
  );
}


function BooksSection({ content }) {
  const { data: booksData } = useFetchAllBooksQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { id } = useParams();

  // Refresh AOS when books data loads
  useEffect(() => {
    if (booksData) {
      setTimeout(() => AOS.refresh(), 100);
    }
  }, [booksData]);

  const count = content.count || 3;

  // Handle inconsistent API response structure (array vs object with books array)
  const books = booksData?.books || booksData || [];

  // Memoize latestBooks to prevent re-renders ideally, but inside render is fine for now
  const latestBooks = Array.isArray(books)
    ? [...books]
      .filter(b => !b.suspended && b._id !== id && b.slug !== id) // Exclude current
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, count)
    : [];

  const handleAddToCart = (book) => {
    if (book.suspended || book.stock <= 0) return;
    const exists = cartItems.find((item) => item._id === book._id);
    if (exists) { navigate("/cart"); return; }
    dispatch(addToCart(book));
  };

  const handleBuyNow = (book) => {
    if (book.suspended || book.stock <= 0) return;
    dispatch(clearCart());
    dispatch(addToCart(book));
    navigate("/checkout");
  };

  if (latestBooks.length === 0) return null;

  const showCarousel = latestBooks.length > 3;

  const BookCard = ({ book }) => {
    const inCart = cartItems.find((item) => item._id === book._id);
    const isSuspended = book.suspended;
    const isOutOfStock = book.stock <= 0;

    return (
      <div className="group relative bg-white mb-0 overflow-hidden transition-all duration-500 h-full flex flex-col items-center">
        <Link to={`/books/${book.slug || book._id}`} className="block w-full">
          <div className="relative w-full aspect-[2/3] max-w-[280px] mx-auto overflow-hidden group book-flip" style={{ perspective: "1200px" }}>
            <div className="book-flip-inner transition-transform duration-700 preserve-3d">
              <div className={`book-flip-front absolute w-full h-full backface-hidden ${isSuspended ? "opacity-60 grayscale" : ""}`}>
                <img src={book?.coverImage || "/placeholder-book.jpg"} alt={book?.title} className="w-full h-full object-cover rounded-md shadow-md" />
              </div>
              <div className="book-flip-back absolute w-full h-full backface-hidden rotate-y-180 rounded-md flex flex-col items-center justify-center">
                <img src={book?.backImage || book?.coverImage || "/default-back.webp"} alt={`${book?.title} back`} className="w-full h-full object-cover" />
                <span className="absolute flex items-center justify-center text-white font-bold uppercase tracking-widest">VIEW BOOK</span>
              </div>
            </div>
            {isSuspended && (
              <div className="absolute top-3 right-3 bg-[#993333] text-white px-3 py-1 rounded-md text-xs font-semibold z-30 flex items-center gap-1">
                <BlockIcon fontSize="small" /> Out of Stock
              </div>
            )}
          </div>
        </Link>

        <div className="text-center mt-4 w-full px-2 flex-grow flex flex-col">
          <h3 className="text-lg md:text-lg font-medium text-gray-700 mb-2 font-figtree break-words line-clamp-2 h-[3.5rem] flex items-center justify-center">
            {book?.title}
          </h3>

          {!isSuspended && (
            <div className="inline-flex justify-center items-center gap-2 w-full flex-wrap md:flex-nowrap mb-3 mt-auto">
              {book?.oldPrice > book?.newPrice && (
                <span className="text-gray-500 line-through text-base sm:text-lg font-figtree font-light">₹{book?.oldPrice}</span>
              )}
              <span className="text-[#993333] font-figtree font-light text-lg sm:text-xl font-semibold">₹{book?.newPrice}</span>
              {book?.oldPrice > book?.newPrice && (
                <span className="text-xs sm:text-sm bg-[#993333] text-white px-1.5 py-0.5 font-figtree font-light rounded-sm">
                  {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}% off
                </span>
              )}
            </div>
          )}
          {isSuspended && <div className="mb-3 py-1 mt-auto"><span className="text-[#993333] font-figtree font-medium text-base">Currently Out of Stock</span></div>}
        </div>

        <div className="text-center mt-auto w-full px-1 mb-4">
          <div className="flex justify-center gap-2 mt-1 px-0 flex-nowrap w-full">
            {isSuspended ? (
              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded cursor-not-allowed opacity-70" disabled>
                <BlockIcon fontSize="small" /> Out of Stock
              </button>
            ) : isOutOfStock ? (
              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm bg-gray-400 text-white rounded opacity-70" disabled>
                <RemoveShoppingCartOutlinedIcon fontSize="small" /> Out of Stock
              </button>
            ) : (
              <>
                <button onClick={inCart ? () => navigate("/cart") : () => handleAddToCart(book)} className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded transition-colors shadow-sm ${inCart ? "bg-[#C76F3B] hover:bg-[#A35427] text-white" : "bg-[#C76F3B] hover:bg-[#A35427] text-white"}`}>
                  {inCart ? <StorefrontOutlinedIcon fontSize="small" /> : <ShoppingCartOutlinedIcon fontSize="small" />} {inCart ? "Go to Cart" : "Add to Cart"}
                </button>
                <button onClick={() => handleBuyNow(book)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white font-semibold rounded hover:bg-[#662222] transition-colors shadow-sm">
                  <ShoppingBagOutlinedIcon fontSize="small" /> Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DynamicSectionLayout title={content.title}>
      {showCarousel ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000 }}
          breakpoints={{
            540: { slidesPerView: 2 },
            920: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {latestBooks.map(book => (
            <SwiperSlide key={book._id} className="h-auto px-2 py-2">
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {latestBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </DynamicSectionLayout>
  );
}

function ArticlesSection({ content }) {
  const [articles, setArticles] = useState([]);
  const count = content.count || 3;

  useEffect(() => {
    // Placeholder fetching logic - API might not exist yet
    fetch(`${API_URL}/api/articles`)
      .then(res => {
        if (!res.ok) throw new Error("No articles API");
        return res.json();
      })
      .then(data => setArticles(data.slice(0, count)))
      .catch(() => setArticles([]));
  }, [count]);

  if (articles.length === 0) return null; // Hide if no data

  return (
    <DynamicSectionLayout title={content.title} linkTo="/articles">
      {/* Placeholder Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article._id} className="p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600">{article.excerpt}</p>
          </div>
        ))}
      </div>
    </DynamicSectionLayout>
  );
}

function PodcastsSection({ content }) {
  const [podcasts, setPodcasts] = useState([]);
  const count = content.count || 3;

  useEffect(() => {
    // Placeholder fetching logic - API might not exist yet
    fetch(`${API_URL}/api/podcasts`)
      .then(res => {
        if (!res.ok) throw new Error("No podcasts API");
        return res.json();
      })
      .then(data => setPodcasts(data.slice(0, count)))
      .catch(() => setPodcasts([]));
  }, [count]);

  if (podcasts.length === 0) return null; // Hide if no data

  return (
    <DynamicSectionLayout title={content.title} linkTo="/podcasts">
      {/* Placeholder Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {podcasts.map(pod => (
          <div key={pod._id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50">
            <div className="w-12 h-12 bg-[#8b171b] rounded-full flex items-center justify-center text-white">
              <Mic size={20} />
            </div>
            <div>
              <h4 className="font-bold">{pod.title}</h4>
              <p className="text-xs text-gray-500">{pod.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </DynamicSectionLayout>
  );
}
