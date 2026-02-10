import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Play, Mic, Calendar, User } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

// Helper: Generate embed URL
const getEmbedUrl = (url) => {
  if (!url) return null;
  try {
    if (url.includes("open.spotify.com/episode")) {
      const parts = url.split("open.spotify.com/");
      return `https://open.spotify.com/embed/${parts[1]}`;
    }
    if (url.includes("podcasts.apple.com")) {
      return url.replace("podcasts.apple.com", "embed.podcasts.apple.com");
    }
    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return null; // Not supported for embed
  } catch (e) {
    console.error("Error parsing URL for embed", e);
    return null;
  }
};

// Component: Individual Podcast Card
const PodcastCard = ({ podcast, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getEmbedUrl(podcast.podcastLink);
  const isUpcoming = new Date(podcast.releaseDate) > new Date();

  // Determine proper thumbnail: Custom upload > Fallback placeholder
  const thumbnailSrc = podcast.thumbnail
    ? podcast.thumbnail.startsWith("http")
      ? podcast.thumbnail
      : `${BACKEND_BASE_URL}${podcast.thumbnail}`
    : "/placeholder.jpg"; // You might want a better default

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={(index % 2) * 100} // Alternating delay
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#8b171b]/10 hover:border-[#8b171b]/30 shadow-sm hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 relative">
      {/* SCHEDULED BADGE */}
      {isUpcoming && (
        <div className="absolute top-4 right-4 z-20 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
          UPCOMING
        </div>
      )}
      {/* Media Area - Facade Pattern */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {isPlaying && embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="encrypted-media; clipboard-write; picture-in-picture; autoplay"
            allowFullScreen
            title={podcast.title}
            className="absolute inset-0 w-full h-full animate-in fade-in duration-500"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={thumbnailSrc}
              alt={podcast.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

            {/* Play Button - hide if upcoming */}
            {!isUpcoming && (
              <button
                onClick={() =>
                  embedUrl
                    ? setIsPlaying(true)
                    : window.open(podcast.podcastLink, "_blank")
                }
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border-[1.5px] border-white text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 group-active:scale-95 backdrop-blur-[2px]"
                aria-label="Play Podcast">
                <Play
                  fill="currentColor"
                  strokeWidth={0}
                  className="ml-1"
                  size={24}
                />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        {/* Meta Tags */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-montserratLight text-slate-500 mb-4 tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#8b171b]" />
            {new Date(podcast.releaseDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {podcast.host && (
            <span className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
              <User size={14} className="text-[#8b171b]" />
              {podcast.host}
            </span>
          )}
        </div>

        <h3 className="font-serifSita text-2xl text-[#2d2d2d] group-hover:text-[#8b171b] mb-4 leading-tight transition-colors duration-300">
          {podcast.title}
        </h3>

        <div className="font-montserratLight text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 flex-grow">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeDescription(podcast.description),
            }}
          />
        </div>

        <div className="pt-6 border-t border-slate-100 mt-auto flex justify-between items-center group/btn">
          {isUpcoming ? (
            <span className="text-slate-400 font-medium text-sm flex items-center gap-2 cursor-not-allowed">
              Coming Soon <Calendar size={16} />
            </span>
          ) : (
            <button
              onClick={() =>
                embedUrl
                  ? setIsPlaying(true)
                  : window.open(podcast.podcastLink, "_blank")
              }
              className="text-[#8b171b] font-medium text-sm flex items-center gap-2 group-hover/btn:translate-x-1 transition-transform duration-300">
              {embedUrl ? "Play Episode" : "Listen on Platform"}{" "}
              <ArrowRight size={16} />
            </button>
          )}

          <Mic
            size={20}
            className="text-slate-300 group-hover:text-[#8b171b]/20 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

const PodcastsPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const podcastsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 120,
      debounceDelay: 50,
    });

    setTimeout(() => AOS.refreshHard(), 400);
  }, []);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  useEffect(() => {
    if (podcasts?.length) {
      setTimeout(() => AOS.refreshHard(), 200);
    }
  }, [podcasts]);

  const fetchPodcasts = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/podcasts`);
      const data = await res.json();

      const now = new Date();
      // Filter suspended
      const activePodcasts = data.filter((podcast) => !podcast.suspended);

      // Sort by Date Descending (Future -> Past)
      const sorted = activePodcasts.sort(
        (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
      );

      setPodcasts(sorted);
    } catch (err) {
      console.error("Failed to fetch podcasts", err);
    }
  };

  const indexOfLastPodcast = currentPage * podcastsPerPage;
  const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
  const currentPodcasts = podcasts.slice(
    indexOfFirstPodcast,
    indexOfLastPodcast,
  );
  const totalPages = Math.ceil(podcasts.length / podcastsPerPage);

  return (
    <>
      <section className="sita-inner-hero">
        <div className="sita-hero-inner-bg" data-aos="fade-in"></div>
        <div className="sita-inner-hero-image">
          <div
            className="sita-inner-hero-image-banner"
            data-aos="zoom-out"
            data-aos-duration="1500">
            <img src="/about-banner.webp" alt="About Banner" />
          </div>
        </div>
      </section>

      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Podcasts" }]}
      />

      <div className="container py-4">
        <div className="max-w-7xl mx-auto px-4  mb-10">
          <div className="text-center mb-8" data-aos="fade-up">
            <h2 className="font-serifSita text-[#8b171b] text-3xl md:text-4xl lg:text-5xl leading-tight mb-3">
              Podcats by Sita
            </h2>
            <img
              src="/sita-motif.webp"
              alt="Sita Motif"
              className="mx-auto mt-1 w-40 sm:w-48 mb-6"
            />
          </div>

          {/* PODCAST GRID */}
          {podcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {currentPodcasts.map((podcast, index) => (
                <PodcastCard
                  key={podcast._id}
                  podcast={podcast}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 font-montserratLight">
              <Mic size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">New episodes coming soon.</p>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div
              className="flex justify-center items-center gap-3 mt-20"
              data-aos="fade-up">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-full disabled:opacity-30 hover:border-[#8b171b] hover:text-[#8b171b] transition-colors">
                <ArrowLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${currentPage === num
                        ? "bg-[#8b171b] text-white shadow-lg shadow-[#8b171b]/30"
                        : "text-slate-600 hover:bg-slate-100"
                      }`}>
                    {num}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-full disabled:opacity-30 hover:border-[#8b171b] hover:text-[#8b171b] transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PodcastsPage;
