import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import BookingModal from "../../components/BookingModal";
import "../../assets/c.css";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DynamicPage = ({ page: propPage }) => {
  const { slug } = useParams();
  const [page, setPage] = useState(propPage || null);
  const [loading, setLoading] = useState(!propPage);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const openBooking = (eventId) => {
    if (!eventId) return;
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (propPage) return;
    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_URL}/api/pages/${slug}`);
        if (!res.ok) throw new Error("Page not found");
        const data = await res.json();
        setPage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug, propPage]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!page) return null;

  const renderBanner = () => {
    if (!page.bannerImage || page.bannerPosition === "hide") return null;
    return (
      <div
        className={`w-full overflow-hidden rounded-lg mb-8 ${page.bannerPosition === "top" ? "mt-0" : "mt-10"
          }`}
        style={{ height: "400px" }}
      >
        <img
          src={page.bannerImage.src}
          alt={page.bannerImage.alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  const renderMainContent = () => {
    if (!page.content) return null;
    return (
      <div className="max-w-8xl mx-auto mb-10 p-4 text-gray-800 text-sm sm:text-base md:text-base lg:text-lg break-words">
        <div className="pl-5">
          {parse(page.content, {
            replace: (domNode) => {
              if (domNode.attribs?.style) {
                domNode.attribs.style = domNode.attribs.style
                  .split(";")
                  .filter((s) => !s.includes("background"))
                  .join(";");
              }
              return domNode;
            },
          })}
        </div>
      </div>
    );
  };

  const renderTopBannerWithContent = () => {
    if (!page.bannerImage || ["bottom", "hide"].includes(page.bannerPosition)) return null;
    const isRight = page.bannerPosition === "top-right";

    return (
      <div
        className={`flex flex-col md:flex-row ${isRight ? "md:flex-row-reverse" : ""} gap-4 md:gap-6 mb-8`}
      >
        <div className="flex-1 w-full md:w-1/2 h-[200px] xs:h-[180px] sm:h-[250px] md:h-[400px] overflow-hidden rounded-lg">
          <img
            src={page.bannerImage.src}
            alt={page.bannerImage.alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 w-full md:w-1/2 min-w-0">{renderMainContent()}</div>
      </div>
    );
  };

  const renderSections = () => {
    if (!page.sections || !Array.isArray(page.sections)) return null;

    return page.sections.map((sec, idx) => {
      const key = (sec.key || "").toLowerCase();

      // 1. BOOKING SECTION
      if (key === 'booking' && sec.content) {
        const alignClass = `text-${sec.content.alignment || 'center'}`;

        return (
          <div key={idx} className={`max-w-7xl mx-auto mb-10 p-4 ${alignClass}`}>
            <button
              onClick={() => openBooking(sec.content.eventId)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
            >
              {sec.content.buttonText || "Book Now"}
            </button>
          </div>
        );
      }

      // 2. HERO SECTION
      if (key === 'hero' && sec.content) {
        const bgImage = sec.content.backgroundImage || "/images/about-banner.webp";
        const cta = sec.content.primaryCta || {};
        const ctaStyle = {
          backgroundColor: cta.bgColor || "#3b82f6",
          color: cta.textColor || "#ffffff",
        };

        const breadcrumbItems = [
          { label: "Home", path: "/" },
          { label: page.title || "Page", path: null }
        ];

        return (
          <React.Fragment key={idx}>
            <section className="sita-inner-hero">
              <div className="sita-hero-inner-bg"></div>
              <div className="sita-inner-hero-image">
                <img src={bgImage} alt="Hero Banner" />
              </div>
            </section>

            <SitaBreadcrumb items={breadcrumbItems} />

            <section className="sita-workshop-section" style={{ padding: '40px 0' }}>
              <div className="container">
                {sec.content.title && <h2 className="text-center">{sec.content.title}</h2>}
                <img src="/images/sita-motif.webp" alt="Sita Motif" className="motif mx-auto my-3 block" style={{ width: 'auto', height: 'auto' }} />
                <div className="row justify-content-center text-center">
                  <div className="col-lg-8">
                    {sec.content.subtitle && <p className="mb-4">{sec.content.subtitle}</p>}

                    {cta.label && (
                      <div className="mt-4">
                        {cta.eventId ? (
                          <button
                            onClick={() => openBooking(cta.eventId)}
                            className="px-6 py-3 rounded-full font-bold shadow-md transition hover:-translate-y-1 inline-block"
                            style={ctaStyle}
                          >
                            {cta.label}
                          </button>
                        ) : (
                          <a
                            href={cta.href || "#"}
                            className="px-6 py-3 rounded-full font-bold shadow-md transition hover:-translate-y-1 inline-block"
                            style={ctaStyle}
                          >
                            {cta.label}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        );
      }

      // 3. GENERIC / LEGACY SECTIONS
      return (
        <div
          key={idx}
          className="max-w-8xl mx-auto mb-10 mt-0 p-4 sm:p-6 rounded-lg"
          style={{ backgroundColor: sec.backgroundColor || "#fff" }}
        >
          {sec.title?.trim() && (
            <div className="text-center mb-2 mt-4 relative inline-block w-full">
              <h1 className="text-[28px] xs:text-[26px] sm:text-[30px] md:text-[36px] lg:text-[50px] font-playfair font-light text-black leading-snug mb-2 break-words">
                {sec.title}
              </h1>
            </div>
          )}

          {sec.subtitle?.trim() && (
            <h3 className="text-[14px] xs:text-[13px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-Figtree font-regular leading-snug text-gray-600 italic text-center mb-4 px-2 sm:px-6">
              {sec.subtitle}
            </h3>
          )}

          <div
            className={`flex flex-col gap-6 md:gap-8 items-center md:items-stretch md:flex-row md:justify-between flex-wrap ${sec.layout === "image-left"
              ? "md:flex-row"
              : sec.layout === "image-right"
                ? "md:flex-row-reverse"
                : ""
              }`}
          >
            {sec.images?.map((img, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-full md:w-auto ${img.alignment === "left"
                  ? "self-start"
                  : img.alignment === "right"
                    ? "self-end"
                    : "self-center"
                  }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="rounded-lg object-cover w-full max-w-full xs:h-auto sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                />
              </div>
            ))}

            {sec.contentBlocks && sec.contentBlocks.length > 0 && (
              <div className="flex-1 w-full mt-4 md:w-auto min-w-0">
                <div
                  className="mb-4 break-words text-sm sm:text-base md:text-base lg:text-lg p-2 sm:p-3 rounded-md"
                  style={{
                    textAlign: sec.contentBlocks[0].alignment || "left",
                    backgroundColor: sec.backgroundColor || "transparent",
                  }}
                >
                  {parse(sec.contentBlocks[0].text || "", {
                    replace: (domNode) => {
                      if (domNode.attribs?.style) {
                        domNode.attribs.style = domNode.attribs.style
                          .split(";")
                          .filter((s) => !s.includes("background"))
                          .join(";");
                      }
                      return domNode;
                    },
                  })}
                </div>
              </div>
            )}
          </div>

          {sec.contentBlocks && sec.contentBlocks.length > 1 && (
            <div className="mt-4 sm:mt-6 max-w-8xl mx-auto px-2 sm:px-4 md:px-0">
              {sec.contentBlocks.slice(1).map((cb, i) => (
                <div
                  key={i}
                  className="mb-4 break-words text-sm sm:text-base md:text-base lg:text-lg p-2 sm:p-3 rounded-md"
                  style={{
                    textAlign: cb.alignment || "left",
                    backgroundColor: sec.backgroundColor || "transparent",
                  }}
                >
                  {parse(cb.text || "", {
                    replace: (domNode) => {
                      if (domNode.attribs?.style) {
                        domNode.attribs.style = domNode.attribs.style
                          .split(";")
                          .filter((s) => !s.includes("background"))
                          .join(";");
                      }
                      return domNode;
                    },
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="font-primary">
      <div className="container mx-auto max-w-8xl px-2 xs:px-4 sm:px-6 md:px-8 py-4 mt-3 sm:py-5 md:py-5">
        <div className="text-center mb-10 relative inline-block w-full">
          {/* Only show title if it's NOT already shown in breadcrumbs/hero effectively? 
               K.html has breadcrumbs then H2 title. 
               DynamicPage shows H1 title here. Matches K.html flow roughly.
           */}
          <h1 className="text-[28px] xs:text-[26px] sm:text-[30px] md:text-[36px] lg:text-[50px] font-playfair font-light text-black leading-snug mb-2 break-words">
            {page.title}
          </h1>
        </div>

        {["top", "top-left", "top-right"].includes(page.bannerPosition)
          ? renderTopBannerWithContent()
          : renderMainContent()}

        {renderSections()}

        {page.bannerPosition === "bottom" && renderBanner()}

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventId={selectedEventId}
        />
      </div>
    </div>
  );
};

export default DynamicPage;
