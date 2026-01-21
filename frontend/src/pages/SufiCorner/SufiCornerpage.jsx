import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import html2canvas from "html2canvas";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const SufiCornerpage = () => {
  const [corners, setCorners] = useState([]);
  const [precepts, setPrecepts] = useState([]);
  const [sufiSlides, setSufiSlides] = useState([]);
  const [posIndex, setPosIndex] = useState(0);
  const [precIndex, setPrecIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const cardRefs = useRef({});
  const bottomControlsRefs = useRef({});

  const width = useWindowWidth();

  useEffect(() => {
    AOS.init({ duration: 1200, easing: "ease-in-out", once: true });
  }, []);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchCorners = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/home/corners`);
        if (!res.ok) throw new Error("Failed to fetch corners");
        const data = await res.json();

        setCorners(data);
        const sufiCorner = data.find((c) => c.id === 2);
        if (sufiCorner && Array.isArray(sufiCorner.slides)) {
          setSufiSlides(sufiCorner.slides);
        } else {
          setSufiSlides([]);
        }
      } catch (error) {
        console.error("Fetch corners failed:", error);
      }
    };

    const fetchPrecepts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/precepts`);
        if (!res.ok) throw new Error("Failed to fetch precepts");
        const data = await res.json();
        setPrecepts(data);
      } catch (error) {
        console.error("Fetch precepts failed:", error);
      }
    };

    fetchCorners();
    fetchPrecepts();
  }, []);

  const sufiSlidesToShow = width < 1024 ? 1 : 2;
  const handlePosChange = (dir) => {
    setDirection(dir);
    setPosIndex((prev) => (prev + dir + sufiSlides.length) % sufiSlides.length);
  };
  const getPosSlides = () => {
    const slides = [];
    for (let i = 0; i < sufiSlidesToShow; i++) {
      slides.push(sufiSlides[(posIndex + i) % sufiSlides.length]);
    }
    return slides;
  };

  const slidesToShow = width < 640 ? 1 : width < 1024 ? 2 : 3;
  const handlePrecChange = (dir) => {
    setDirection(dir);
    setPrecIndex((prev) => (prev + dir + precepts.length) % precepts.length);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const handleShare = async (cornerId, slideIndex) => {
    const cardKey = `${cornerId}-${slideIndex}`;
    const cardNode = cardRefs.current[cardKey];
    const controlsNode = bottomControlsRefs.current[cardKey];

    if (!cardNode) return;

    try {
      if (controlsNode) controlsNode.style.display = "none";
      const shareButtons = cardNode.querySelectorAll(
        "button[aria-label='Share slide']"
      );
      shareButtons.forEach((btn) => (btn.style.display = "none"));

      const canvas = await html2canvas(cardNode, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      if (controlsNode) controlsNode.style.display = "";
      shareButtons.forEach((btn) => (btn.style.display = ""));

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const file = new File([blob], `slide-${cornerId}-${slideIndex}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "The Sufi Corner",
          text: "Check out this beautiful Sufi insight.",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `slide-${cornerId}-${slideIndex}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Image downloaded. Sharing not supported on this device.");
      }
    } catch (error) {
      if (controlsNode) controlsNode.style.display = "";
      const shareButtons = cardNode.querySelectorAll(
        "button[aria-label='Share slide']"
      );
      shareButtons.forEach((btn) => (btn.style.display = ""));
      console.error("Error sharing slide:", error);
      alert("Something went wrong while sharing.");
    }
  };

  useEffect(() => {
    if (precepts.length > 1) {
      const interval = setInterval(() => {
        setPrecIndex((prev) => (prev + 1) % precepts.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [precepts]);

  useEffect(() => {
    if (sufiSlides.length > 1) {
      const interval = setInterval(() => {
        setPosIndex((prev) => (prev + 1) % sufiSlides.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [sufiSlides]);

  return (
    <div className="container" data-aos="fade-up" data-aos-duration="1000">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
        <div
          className="breadcrumb-container w-full text-left mb-6 font-figtree font-light"
          data-aos="fade-right"
          data-aos-duration="1200">
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
                <span className="text-gray-700">The Sufi Corner</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* ===================== SECTION 1 : SUFI CORNER ===================== */}
        <section
          className="py-0 mb-0 w-full"
          data-aos="fade-up"
          data-aos-duration="1200">
          <div className="relative inline-block mb-2">
            <h2
              className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4"
              data-aos="zoom-in"
              data-aos-duration="1300">
              The Sufi Corner
            </h2>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
            />
          </div>

          <p
            className="text-[18px] sm:text-[20px] md:text-[24px] font-Figtree text-center font-playfair font-regular mb-10"
            data-aos="fade-up"
            data-aos-duration="1300">
            Uplift your spirit
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start w-full">
            {getPosSlides().map((slide, idx) => {
              if (!slide || !slide.image) return null;
              const isLeft = idx === 0;
              const cardBg = isLeft ? "#bc6430" : "#8c2f24";
              const hangerColor = isLeft ? "#8c2f24" : "#bc6430";
              const cardKey = `2-${idx}`;

              return (
                <div
                  key={idx}
                  className="relative pt-14"
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                  data-aos-duration="1200">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                    <div
                      className="w-4 h-4 rounded-full z-20"
                      style={{ backgroundColor: hangerColor }}></div>
                    <svg
                      viewBox="0 0 100 50"
                      className="w-15 h-14 -mt-1 z-10"
                      preserveAspectRatio="none"
                      aria-hidden="true">
                      <line
                        x1="50"
                        y1="0"
                        x2="5"
                        y2="55"
                        stroke={hangerColor}
                        strokeWidth="3"
                      />
                      <line
                        x1="50"
                        y1="0"
                        x2="95"
                        y2="55"
                        stroke={hangerColor}
                        strokeWidth="3"
                      />
                    </svg>
                  </div>

                  <div
                    ref={(el) => (cardRefs.current[cardKey] = el)}
                    className="rounded-lg shadow-md text-white overflow-hidden w-full max-w-[700px] h-[650px] sm:h-[570px] md:h-[650px] lg:h-[650px] flex flex-col justify-between"
                    style={{ backgroundColor: cardBg }}>
                    <div className="w-full flex justify-center p-4">
                      <div className="w-[520px] h-[275px] max-w-full sm:w-[550px] sm:h-[285px] h-[240px] flex items-center justify-center overflow-hidden">
                        <motion.img
                          key={slide.image}
                          src={slide.image}
                          alt="slide"
                          className="w-[520px] sm:h-[285px] sm:w-[550px] h-[240px] object-cover"
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="flex-1 px-6 pb-4 text-center">
                      <p className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] text-black-800 font-Figtree font-regular text-center leading-relaxed mx-2">
                        {slide.text}
                      </p>
                      {slide.author && (
                        <p className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] text-black-800 font-Figtree font-regular text-right leading-relaxed mx-10 text-right">
                          – {slide.author}
                        </p>
                      )}
                    </div>

                    <div
                      ref={(el) => (bottomControlsRefs.current[cardKey] = el)}
                      className="px-4 pb-4 flex items-center justify-end mt-auto">
                      <button
                        onClick={() => handleShare(2, idx)}
                        className="flex items-center gap-2 text-white hover:text-gray-200 transition"
                        aria-label="Share slide">
                        <ShareOutlinedIcon />
                        <span className="text-sm sm:text-base">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black text-[16px] sm:text-[18px]"
            data-aos="fade-up"
            data-aos-duration="1200">
            <button
              onClick={() => handlePosChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition">
              <FiArrowLeft size={18} />
            </button>
            <button
              onClick={() => handlePosChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition">
              <FiArrowRight size={18} />
            </button>
            <span className="text-gray-700">
              {String(posIndex + 1).padStart(2, "0")} /{" "}
              {String(sufiSlides.length).padStart(2, "0")}
            </span>
          </div>
        </section>

        {/* ===================== SECTION 2 : PRECEPTS ===================== */}
        <section
          className="py-14 w-full"
          data-aos="fade-up"
          data-aos-duration="1200">
          <div className="relative inline-block mb-8">
            <h2
              className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4"
              data-aos="zoom-in"
              data-aos-duration="1300">
              Precepts of Spirituality
            </h2>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
            />
          </div>

          <div
            className="overflow-x-auto overflow-y-hidden scrollbar-hide w-full"
            data-aos="fade-up"
            data-aos-duration="1200"
            ref={(el) => (window.preceptsScroll = el)}>
            <motion.div
              className="flex gap-6 sm:gap-8"
              animate={{ x: -precIndex * (100 / slidesToShow) + "%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {[...precepts, ...precepts].map((slide, idx) => {
                const cardKey = `3-${idx}`;

                return (
                  <div
                    key={idx}
                    ref={(el) => (cardRefs.current[cardKey] = el)}
                    className="rounded-lg shadow-md overflow-hidden relative w-[540px] h-[180px] xs:h-[120px] sm:h-[200px] md:h-[240px] lg:h-[240px] flex-shrink-0"
                    style={{ width: `${93 / slidesToShow}%` }}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}
                    data-aos-duration="1200">

                    <img
                      src={slide.imageUrl}
                      alt="Precept"
                      className="w-full h-full object-cover absolute inset-0"
                      loading="lazy"
                    />

                    <div className="absolute bottom-3 right-3 z-10 flex items-center justify-end">
                      <button
                        onClick={() => handleShare(3, idx)}
                        className="flex items-center gap-1 sm:gap-2 text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-md transition"
                        aria-label="Share slide">
                        <ShareOutlinedIcon sx={{ fontSize: 18 }} />
                        <span className="text-xs sm:text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
          <div
            className="mt-12 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black text-[16px] sm:text-[18px]"
            data-aos="fade-up"
            data-aos-duration="1200">
            <button
              onClick={() => handlePrecChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition">
              <FiArrowLeft size={18} />
            </button>
            <button
              onClick={() => handlePrecChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition">
              <FiArrowRight size={18} />
            </button>
            <span className="text-gray-700">
              {String(precIndex + 1).padStart(2, "0")} /{" "}
              {String(precepts.length).padStart(2, "0")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SufiCornerpage;
