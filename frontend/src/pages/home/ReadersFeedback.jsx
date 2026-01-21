import { useState, useEffect, useRef } from "react";
import { usePreloadedData } from "../../context/DataContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

const ReadersFeedback = () => {
  const preloadedData = usePreloadedData();
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const sectionRef = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(2);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    if (preloadedData.reviews) {
      let reviewsArray = Array.isArray(preloadedData.reviews)
        ? preloadedData.reviews
        : preloadedData.reviews.reviews || [];

      reviewsArray = reviewsArray
        .filter((r) => r.approved && Number(r.rating) > 3)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

      setFeedbacks(reviewsArray);
      setCurrentIndex(0);
    }
  }, [preloadedData]);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsPerPage;
      return newIndex < 0 ? (totalPages - 1) * itemsPerPage : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPage;
      return newIndex >= feedbacks.length ? 0 : newIndex;
    });
  };

  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!autoScrollRef.current) {
            autoScrollRef.current = setInterval(() => {
              handleNext();
            }, 9000);
          }
        } else {
          clearInterval(autoScrollRef.current);
          autoScrollRef.current = null;
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      clearInterval(autoScrollRef.current);
    };
  }, [feedbacks, itemsPerPage]);

  return (
    <div className="bg-white font-playfair mt-0 mb-2" ref={sectionRef}>
      <div className="w-full max-w-8xl mx-auto pb-5 px-8 xl:px-14">
        <div
          className="relative mb-10 inline-block text-left"
          data-aos="fade-down"
          data-aos-duration="1600">
          <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-2 mt-0">
            Readers Feedback
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15]"
          />
        </div>

        {feedbacks.length === 0 && (
          <p
            className="text-center text-black text-lg font-figtree"
            data-aos="fade-up"
            data-aos-duration="1500">
            No feedback available.
          </p>
        )}

        {feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-32 text-left mt-0 gap-8 h-auto">
            {feedbacks
              .slice(currentIndex, currentIndex + itemsPerPage)
              .map((fb) => (
                <div
                  key={fb._id || fb.id}
                  className="space-y-4"
                  data-aos="fade-up"
                  data-aos-duration="1600">
                  <div
                    className="flex items-center gap-3 flex-wrap"
                    data-aos="fade-right"
                    data-aos-duration="1600">
                    <div className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 overflow-hidden rounded-full bg-[#993333] text-white flex items-center justify-center">
                      <img
                        src="/readers.webp"
                        alt={fb.userName || fb.name}
                        className="w-full h-full object-cover"
                        data-aos="zoom-in"
                        data-aos-duration="1600"
                      />
                    </div>

                    <span
                      className="italic text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[24px] font-Figtree font-regular leading-snug leading-tight text-black-900 font-figtree break-words"
                      data-aos="fade-left"
                      data-aos-duration="1600">
                      {fb.userName || fb.name}
                    </span>

                    <div
                      className="flex items-center text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[24px] gap-1 mt-0 mb-0"
                      data-aos="fade-left"
                      data-aos-duration="1600">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                      {Array.from({ length: 5 - fb.rating }).map((_, i) => (
                        <span key={i} className="text-gray-300">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <p
                    className="text-left text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3]"
                    data-aos="fade-up"
                    data-aos-duration="1800">
                    {fb.comment || fb.text}
                  </p>

                  {fb.bookName && (
                    <p
                      className="text-right text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-gray-600 italic font-Figtree mt-2 md:mt-0"
                      data-aos="fade-up"
                      data-aos-duration="1800">
                      - {fb.bookName}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}

        {feedbacks.length > 0 && (
          <div
            className="mt-4 flex items-center justify-center sm:justify-start gap-4 font-figtree text-black-800 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-snug lg:leading-normal"
            data-aos="fade-up"
            data-aos-duration="1200">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadersFeedback;
