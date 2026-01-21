import { useEffect, useState } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const Foundation = () => {
  const [data, setData] = useState(null);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    AOS.init({ once: true, easing: "ease-in-out" });
  }, []);

  // Fetch Foundation Data
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    fetch(`${baseUrl}/api/foundation`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load foundation content");
      });
  }, []);

  const handleCopyLink = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/letters`);
        const data = await response.json();
        const lettersData = Array.isArray(data) ? data : [];
        const activeLetters = lettersData.filter((letter) => !letter.suspended);
        const recentLetters = activeLetters
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 3);

        setLetters(recentLetters);
      } catch (error) {
        console.error("Failed to fetch letters:", error);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  if (!data) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container">
      <div
        className="max-w-screen-8xl mx-auto font-Figtree overflow-hidden px-4 min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]"
        data-aos="fade-up"
        data-aos-duration="1200">
        <div className="breadcrumb-container w-full text-left mb-0 font-figtree font-lite">
          <nav
            aria-label="breadcrumb"
            data-aos="fade-right"
            data-aos-duration="1000">
            <ol className="breadcrumb m-0 p-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-gray">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/foundation" className="!text-gray-600">
                  The Foundation
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]">
          <div
            className="flex items-center justify-center px-4 lg:px-8 xl:px-12 2xl:px-16 h-full order-2 lg:order-2"
            data-aos="fade-left"
            data-aos-duration="1500">
            <img
              src={data.imageUrl}
              alt="Langshott Foundation Author"
              className="w-full max-h-[700px] object-contain mx-auto select-none transition duration-300"
            />
          </div>

          <div
            className="relative bg-transparent px-4 pt-5 text-center flex flex-col justify-center items-center max-w-[700px] xl:max-w-[800px] mx-auto h-full order-1 lg:order-1"
            data-aos="fade-right"
            data-aos-duration="1500">
            <div
              className="mb-2 sm:mb-5"
              data-aos="zoom-in"
              data-aos-duration="1200">
              <img
                src={data.logoUrl}
                alt={data.title}
                className="h-24 sm:h-30 max-h-32 w-auto block select-none mx-auto mt-0"
              />
            </div>

            <div
              className="relative inline-block text-center"
              data-aos="fade-up"
              data-aos-duration="1300">
              <h1 className="text-[30px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mt-4 mb-4 sm:mb-6">
                {data.title}
              </h1>
              <img
                src="/motif.webp"
                alt="feather"
                className="absolute left-1/2 -bottom-2 sm:-bottom-0 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-auto mb-4 md:mb-6 [opacity:0.15]"
              />
            </div>
            <p
              className="text-[16px] sm:text-[18px] lg:text-[20px] text-black-800 font-Figtree leading-tight lg:leading-[1.3] mt-2 lg:mt-4 mb-3 px-2 sm:px-2 text-center"
              data-aos="fade-up"
              data-aos-duration="1400">
              {data.description}
            </p>

            <div
              className="flex justify-center gap-2 text-gray-600 mb-0 font-bellmt flex-wrap"
              data-aos="zoom-in"
              data-aos-duration="1300">
              {[...Array(data.starsCount || 6)].map((_, i) => (
                <span key={i} className="text-2xl sm:text-3xl lg:text-4xl">
                  *
                </span>
              ))}
            </div>

            <p
              className="text-[17px] sm:text-[22px] lg:text-[25px] font-Figtree italic text-[#8c2f2f] leading-snug px-4 sm:px-10 text-center"
              data-aos="fade-up"
              data-aos-duration="1500">
              {data.quote}
            </p>
          </div>
        </div>
      </div>

      {data.paragraphs && data.paragraphs.length > 0 && (
        <div
          className="max-w-screen-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
          data-aos="fade-up"
          data-aos-duration="1200">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
            {data.paragraphs.map((para, index) => (
              <p
                key={index}
                className={`text-[16px] sm:text-[18px] lg:text-[20px] text-gray-800 font-Figtree leading-relaxed text-justify ${para.style === "bold" ? "font-bold" : ""
                  } ${para.style === "italic" ? "italic" : ""}`}
                data-aos="fade-up"
                data-aos-duration="1400"
                data-aos-delay={index * 100}>
                {para.text}
              </p>
            ))}
          </div>
        </div>
      )}

      <div
        className="max-w-8xl mx-auto px-4 py-12 mt-10 text-center flex flex-col items-center"
        data-aos="fade-up"
        data-aos-duration="1200">
        <div
          className="relative inline-block mb-6 w-full text-center"
          data-aos="fade-down"
          data-aos-duration="1300">
          <h2 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-playfair font-light text-black relative z-10">
            Recent Letters from Langshott
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 sm:w-28 md:w-32 h-auto pointer-events-none [opacity:0.15] z-0"
          />
        </div>

        {loading ? (
          <p
            className="text-center py-10"
            data-aos="fade-in"
            data-aos-duration="900">
            Loading...
          </p>
        ) : letters.length === 0 ? (
          <p
            className="italic text-gray-500"
            data-aos="fade-in"
            data-aos-duration="900">
            No active letters available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-auto min-h-[160px]">
            {letters.map(
              ({ _id, title, uploadedAt, fileUrl, downloadUrl, fileName }) => {
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
                    <div className="flex items-start gap-2">
                      <div
                        className="w-[110px] h-[160px] rounded overflow-hidden flex-shrink-0 cursor-pointer"
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

                        <div className="flex justify-start gap-2 mt-4 flex-wrap">
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
        )}

        <div
          className="mt-3 flex justify-center"
          data-aos="zoom-in"
          data-aos-duration="1200">
          <Link
            to="/letters"
            className="px-3 py-2 no-underline rounded-full bg-[#983120] text-base hover:bg-[#7a241b] text-white font-medium text-base transition-all duration-300">
            Explore More Letters
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Foundation;
