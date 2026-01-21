import { useEffect, useState } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LetterFromLangshott = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const lettersPerPage = 9;

  useEffect(() => {
    AOS.init({
      duration: 1400,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/letters`);
        const data = await response.json();
        const lettersData = Array.isArray(data) ? data : [];
        const activeLetters = lettersData
          .filter((letter) => !letter.suspended)
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)); // newest first
        setLetters(activeLetters);
      } catch (error) {
        console.error("Failed to fetch letters:", error);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  // When page changes, scroll to top of container (similar behavior to BlogsPage)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleCopyLink = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Pagination calculations
  const indexOfLast = currentPage * lettersPerPage;
  const indexOfFirst = indexOfLast - lettersPerPage;
  const currentLetters = letters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(letters.length / lettersPerPage);

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="container" data-aos="fade-up" data-aos-duration="1000">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center">
        <div
          className="breadcrumb-container w-full text-left mb-0 font-figtree font-lite"
          data-aos="fade-right"
          data-aos-duration="1500">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0 flex flex-wrap gap-2 text-sm sm:text-base">
              <li className="breadcrumb-item">
                <a href="/" className="text-gray">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/publications" className="!text-gray-600">
                  Letters from Langshott
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div
          className="relative inline-block"
          data-aos="zoom-in"
          data-aos-duration="1500">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-playfair font-light text-black leading-snug mb-4 mt-4">
            Letters from Langshott
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 lg:w-32 h-auto [opacity:0.15] mb-2"
          />
        </div>

        <div
          className="max-w-8xl mx-auto min-h-screen mt-10 w-full"
          data-aos="fade-up"
          data-aos-duration="1600">
          {letters.length === 0 ? (
            <p
              className="italic text-gray-500 text-center"
              data-aos="fade-in"
              data-aos-duration="1200">
              No active letters available.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-auto min-h-[160px]">
                {currentLetters.map(
                  ({
                    _id,
                    title,
                    uploadedAt,
                    fileUrl,
                    downloadUrl,
                    fileName,
                  }) => {
                    const downloadFileName = fileName
                      ?.toLowerCase()
                      .endsWith(".pdf")
                      ? fileName
                      : `${fileName || "download"}.pdf`;

                    return (
                      <div
                        key={_id}
                        className={`bg-white border-1 border-gray-300 rounded-lg p-2 flex flex-col w-full transition duration-300 transform 
              hover:scale-105 hover:border-[#c76f3b]`}
                        data-aos="fade-up"
                        data-aos-duration="1600"
                        onMouseEnter={() => setHoveredId(_id)}
                        onMouseLeave={() => setHoveredId(null)}>
                        <div className="flex items-start gap-4">
                          <div
                            className="w-[120px] h-[160px] rounded overflow-hidden flex-shrink-0 cursor-pointer"
                            onClick={() => window.open(fileUrl, "_blank")}>
                            <img
                              src={
                                hoveredId === _id ? "/2-Letter-gif.gif" : "/Letter.webp"
                              }
                              alt="PDF Preview"
                              className="transition-all duration-300 ease-in-out"
                            />
                          </div>
                          <div className="flex-1 flex flex-col items-start">
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 break-words overflow-hidden line-clamp-2 text-left">
                              {title}
                            </h3>
                            <p className="text-xs sm:text-sm lg:text-sm text-gray-500 mb-2">
                              {new Date(uploadedAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>

                            <div className="flex justify-start gap-3 mt-4 flex-wrap">
                              <a
                                href={downloadUrl}
                                download={downloadFileName}
                                className="flex flex-col items-center no-underline text-gray-600 hover:text-green-600 text-[11px] sm:text-sm md:text-base font-medium px-2">
                                <DownloadOutlinedIcon className="!text-[18px] sm:!text-[20px] md:!text-[22px] mb-[4px]" />
                                Download
                              </a>
                              <button
                                onClick={() => handleCopyLink(fileUrl, _id)}
                                className={`flex flex-col items-center no-underline ${copiedId === _id
                                  ? "text-gray-700"
                                  : "text-gray-700 hover:text-[#2563eb]"
                                  } text-[11px] sm:text-sm md:text-base font-medium px-2`}>
                                <LinkIcon className="!text-[18px] sm:!text-[20px] md:!text-[22px] mb-[4px]" />
                                {copiedId === _id ? "Copied!" : "Copy Link"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Pagination */}
              <div
                className="flex justify-center items-center gap-2 sm:gap-2 lg:gap-3 mt-10 flex-wrap"
                data-aos="fade-up"
                data-aos-duration="1500">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition">
                  <ArrowLeft size={16} strokeWidth={2} />
                </button>

                {currentPage > 3 && <span className="text-gray-400 select-none">...</span>}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((num) => {
                    if (currentPage <= 2) {
                      return num <= 3;
                    } else if (currentPage >= totalPages - 1) {
                      return num >= totalPages - 2;
                    } else {
                      return (
                        num === currentPage - 1 ||
                        num === currentPage ||
                        num === currentPage + 1
                      );
                    }
                  })
                  .map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm sm:text-base transition
          ${currentPage === num
                          ? "bg-[#993333] text-white"
                          : "border border-transparent text-black hover:border-black hover:bg-gray-100"
                        }`}>
                      {num}
                    </button>
                  ))}

                {currentPage < totalPages - 2 && <span className="text-gray-400 select-none">...</span>}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition">
                  <ArrowRight size={16} strokeWidth={2} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterFromLangshott;
