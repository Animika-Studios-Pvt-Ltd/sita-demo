import { useState, useEffect } from "react";
import { usePreloadedData } from "../../context/DataContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

const ReaderThoughts = () => {
  const preloadedData = usePreloadedData();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [fade, setFade] = useState("fade-in");
  const animationDuration = 300;

  useEffect(() => {
    AOS.init({
      duration: 1100,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    if (preloadedData.readerThoughts) {
      setData(preloadedData.readerThoughts);
    }
  }, [preloadedData]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1450 ? 2 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!data?.thoughts) return;

    const interval = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, itemsPerPage, data]);

  if (!data) return null;

  const { image, title, thoughts } = data;
  const imageUrl = image?.url || "/fallback-image.webp";

  const visibleThoughts = thoughts.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const animateTransition = (nextIndex) => {
    setFade("fade-out");
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setFade("fade-in");
    }, animationDuration);
  };

  const handlePrev = () => {
    const lastIndex =
      thoughts.length - (thoughts.length % itemsPerPage || itemsPerPage);
    const nextIndex =
      currentIndex === 0 ? lastIndex : currentIndex - itemsPerPage;
    animateTransition(nextIndex);
  };

  const handleNext = () => {
    const nextIndex =
      currentIndex + itemsPerPage >= thoughts.length
        ? 0
        : currentIndex + itemsPerPage;
    animateTransition(nextIndex);
  };

  return (
    <div className="h-full overflow-hidden pt-10 pb-14 md:pb-20 px-4">
      <div className="max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 items-stretch shadow-md rounded-xl overflow-hidden custom-layout bg-[#e6e8da]">
        <div
          className="relative w-full"
          data-aos="fade-right"
          data-aos-duration="1300">
          <img
            src={imageUrl}
            alt="mind"
            className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] xl:h-[720px] 2xl:h-[700px] object-cover"
          />
        </div>
        <div
          className="relative bg-[#e6e8da] p-4 me-3 sm:p-6 md:p-10 flex flex-col h-[700px] sm:h-[650px] md:h-[600px] lg:h-[600px] xl:h-[720px] 2xl:h-[700px] overflow-hidden"
          data-aos="fade-left"
          data-aos-duration="1300">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-l from-[#e6e8da] to-transparent pointer-events-none z-0" />

          <div
            className="relative w-full flex justify-center lg:justify-start"
            data-aos="fade-down"
            data-aos-duration="1200">
            <h1 className="relative z-10 text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-5 sm:mb-8 mt-4 sm:mt-8 text-center lg:text-left">
              <span className="relative inline-block">
                {title}
                <img
                  src="/motif.webp"
                  alt="feather"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15 pointer-events-none z-0"
                />
              </span>
            </h1>
          </div>
          <div
            className={`flex-grow overflow-y-hidden overflow-x-hidden z-10 grid ${itemsPerPage === 2 ? "grid-cols-2" : "grid-cols-1"
              } gap-8 ${fade}`}
            style={{ maxHeight: "100%" }}>
            {visibleThoughts.map((thought, idx) => {
              const actualIndex = currentIndex + idx + 1;
              return (
                <div
                  key={thought._id || idx}
                  className="space-y-3"
                  data-aos="fade-up"
                  data-aos-duration="1100">
                  <div className="flex items-baseline gap-2">
                    <p className="whitespace-pre-line text-left text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] pe-5 text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3]">
                      <span className="text-[24px] sm:text-[26px] font-bold text-[#8c2f24] leading-tight font-Figtree">
                        {actualIndex}.
                      </span>
                      <span className="font-bold mb-1 ms-2">
                        {thought.title}
                      </span>
                    </p>
                  </div>

                  <p className="whitespace-pre-line text-left text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] pe-5 text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3]">
                    {thought.text}
                  </p>
                  {thought.author && (
                    <p className="text-right text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] pe-5 text-black-800 font-Figtree font-regular italic text-gray-700 font-medium">
                      — {thought.author}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="flex items-center justify-start gap-6 pt-6 mt-8 z-10"
            data-aos="fade-up"
            data-aos-duration="700">
            <button
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition">
              <FiChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition">
              <FiChevronRight size={20} />
            </button>

            <span className="text-gray-700 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[22px] font-Figtree font-regular leading-snug">
              {String(Math.ceil((currentIndex + 1) / itemsPerPage)).padStart(
                2,
                "0"
              )}{" "}
              /{" "}
              {String(Math.ceil(thoughts.length / itemsPerPage)).padStart(
                2,
                "0"
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderThoughts;
