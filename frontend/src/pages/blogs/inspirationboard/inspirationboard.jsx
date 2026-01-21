import { useEffect, useState, useRef } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import html2canvas from "html2canvas";
import { ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const InspirationBoard = () => {
  const [inspirationBlogs, setInspirationBlogs] = useState([]);
  const [inspirationImages, setInspirationImages] = useState([]);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [topPerView, setTopPerView] = useState(2);
  const [bottomPerView, setBottomPerView] = useState(3);

  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const filtered = data
          .filter((b) => b.type === "inspiration" && !b.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInspirationBlogs(filtered);
      } catch (error) {
        console.error("Error fetching inspiration blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/inspiration-images`);
        const data = await res.json();
        setInspirationImages(data);
      } catch (error) {
        console.error("Error fetching inspiration images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setTopPerView(width < 768 ? 1 : 2);
      if (width < 768) setBottomPerView(1);
      else if (width < 992) setBottomPerView(2);
      else setBottomPerView(3);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const infiniteBlogs = [
    ...inspirationBlogs,
    ...inspirationBlogs,
    ...inspirationBlogs,
  ];
  const infiniteImages = [
    ...inspirationImages,
    ...inspirationImages,
    ...inspirationImages,
  ];

  const handleTopNext = () => {
    setTopIndex((prev) => {
      const next = prev + 1;
      if (next >= inspirationBlogs.length * 2) return inspirationBlogs.length;
      return next;
    });
  };
  const handleTopPrev = () => {
    setTopIndex((prev) => {
      const next = prev - 1;
      if (next < inspirationBlogs.length)
        return inspirationBlogs.length * 2 - topPerView;
      return next;
    });
  };

  const handleBottomNext = () => {
    setBottomIndex((prev) => {
      const next = prev + 1;
      if (next >= inspirationImages.length * 2) return inspirationImages.length;
      return next;
    });
  };
  const handleBottomPrev = () => {
    setBottomIndex((prev) => {
      const next = prev - 1;
      if (next < inspirationImages.length)
        return inspirationImages.length * 2 - bottomPerView;
      return next;
    });
  };

  const handleShare = async (key, nodeRef) => {
    if (!nodeRef.current) return;
    const shareBtn = nodeRef.current.querySelector("button");
    if (shareBtn) shareBtn.style.display = "none";

    try {
      const canvas = await html2canvas(nodeRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const file = new File([blob], `${key}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Inspiration Board",
          text: "Check out this inspiring image.",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${key}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Image downloaded (sharing not supported).");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Something went wrong while sharing.");
    } finally {
      if (shareBtn) shareBtn.style.display = "";
    }
  };

  useEffect(() => {
    if (inspirationImages.length > 1) {
      const interval = setInterval(() => {
        setBottomIndex((prev) => (prev + 1) % inspirationImages.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [inspirationImages]);

  return (
    <div className="container mx-auto px-4 mb-20" data-aos="fade-up">
      <div
        className="breadcrumb-container w-full text-left mb-0 font-figtree font-light"
        data-aos="fade-right">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0 p-0 flex gap-0 text-sm">
            <li className="breadcrumb-item">
              <a href="/" className="text-gray-500 hover:underline">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/blogs" className="text-gray-500 hover:underline">
                Blogs
              </a>
            </li>
            <li className="breadcrumb-item">
              <span className="text-gray-700">Inspiration Board</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="text-center mt-6 mb-12 relative" data-aos="zoom-in">
        <h2 className="text-[32px] sm:text-[36px] md:text-[50px] font-playfair font-light text-black mb-4">
          Inspiration
        </h2>
        <img
          src="/motif.webp"
          alt="motif"
          className="absolute left-1/2 -bottom-6 transform -translate-x-1/2 w-24 md:w-32 opacity-15 pointer-events-none"
        />
      </div>

      <div className="relative w-full overflow-hidden mb-12" data-aos="fade-up">
        <div
          ref={topContainerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(topIndex * 100) / topPerView}%)`,
          }}>
          {infiniteBlogs.map((item, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={(i % 2) * 150}
              className={`flex-shrink-0 ${topPerView === 1
                ? "w-full"
                : topPerView === 2
                  ? "w-1/2"
                  : "w-1/3"
                } px-4`}>
              <Link
                to={`/inspiration/${item.slug || item._id}`}
                className="block group">
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${BACKEND_BASE_URL}${item.image}`
                  }
                  alt={item.title}
                  className="w-full h-[200px] sm:h-[250px] md:h-[340px] object-cover rounded-xl hover:scale-[1.01] transition-all duration-300"
                />
                <h3 className="mt-3 text-lg md:text-xl text-gray-900 font-semibold underline decoration-white underline-offset-5 flex items-center gap-2">
                  {item.title}
                  <span className="text-[#993333] transform transition-transform duration-200 group-hover:translate-x-[5px] mt-1">
                    <ArrowRight size={20} strokeWidth={2} />
                  </span>
                </h3>
              </Link>
            </div>
          ))}
        </div>

        <div
          className="mt-2 flex items-center justify-center sm:justify-start gap-4 ms-3 text-black text-base sm:text-lg"
          data-aos="fade-up">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            onClick={() => {
              const total = inspirationBlogs.length;
              setTopIndex((p) => (p - 1 + total) % total);
            }}>
            <FiArrowLeft size={18} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            onClick={() => {
              const total = inspirationBlogs.length;
              setTopIndex((p) => (p + 1) % total);
            }}>
            <FiArrowRight size={18} />
          </button>
          <span className="inspiration-board-slide-counter">
            {String((topIndex % inspirationBlogs.length) + 1).padStart(2, "0")}{" "}
            / {String(inspirationBlogs.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" data-aos="fade-up">
        <div
          ref={bottomContainerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(bottomIndex * 100) / bottomPerView}%)`,
          }}>
          {infiniteImages.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 100}
              className={`flex-shrink-0 ${bottomPerView === 1
                ? "w-full"
                : bottomPerView === 2
                  ? "w-1/2"
                  : "w-1/3"
                } px-3 relative`}>
              <img
                src={
                  item.imageUrl?.startsWith("http")
                    ? item.imageUrl
                    : `${BACKEND_BASE_URL}${item.imageUrl}`
                }
                alt=""
                className="rounded-lg shadow-md overflow-hidden relative w-full max-w-[420px] mx-auto h-[180px] xs:h-[180px] sm:h-[200px] md:h-[220px] lg:h-[220px] xl:h-[240px] flex-shrink-0" />
              <button
                onClick={() =>
                  handleShare(`bottom-${i}`, { current: cardRefs.current[i] })}
                className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[15px] px-1 py-1 xs:px-1 xs:py-2 sm:px-1 sm:py-1.5 md:px-1 md:py-2 absolute bottom-3 right-9 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-md flex items-center gap-2 transition">
                <ShareOutlinedIcon sx={{ fontSize: 18 }} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center  ms-3  justify-center sm:justify-start gap-4 font-figtree text-black text-[16px] sm:text-[18px]">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            onClick={() => {
              const total = inspirationImages.length;
              setBottomIndex((p) => (p - 1 + total) % total);
            }}>
            <FiArrowLeft size={18} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
            onClick={() => {
              const total = inspirationImages.length;
              setBottomIndex((p) => (p + 1) % total);
            }}>
            <FiArrowRight size={18} />
          </button>
          <span className="text-gray-700">
            {String((bottomIndex % inspirationImages.length) + 1).padStart(
              2,
              "0"
            )}{" "}
            / {String(inspirationImages.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
