import { useEffect, useState } from "react";
import { usePreloadedData } from "../../context/DataContext";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const InspirationBoard = () => {
  const preloadedData = usePreloadedData();
  const [inspirations, setInspirations] = useState([]);

  useEffect(() => {
    AOS.init({
      easing: "ease-in-out",
      once: true,
      mirror: false,
      duration: 900,
    });
  }, []);

  useEffect(() => {
    if (preloadedData.blogs) {
      const filtered = preloadedData.blogs
        .filter((item) => item.type === "inspiration" && !item.suspended)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setInspirations(filtered);
    }
  }, [preloadedData]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-[#e9e0d4] font-playfair text-gray-900">
      <div className="w-full max-w-8xl mx-auto px-6 sm:px-8 lg:px-8 xl:px-4 py-12 text-center">
        <div
          className="relative inline-block mb-12"
          data-aos="fade-down"
          data-aos-duration="1100"
          data-aos-easing="ease-in-out">
          <h2 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4">
            Inspiration Board
          </h2>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {inspirations.length === 0 ? (
            <p
              className="col-span-3 text-gray-500"
              data-aos="fade-up"
              data-aos-duration="900">
              No inspiration found.
            </p>
          ) : (
            inspirations.map((item, index) => (
              <div
                key={item._id}
                className="space-y-4 text-center"
                data-aos="fade-up"
                data-aos-duration="1100"
                data-aos-delay={index * 200}>
                <div
                  className="relative"
                  data-aos="zoom-in"
                  data-aos-duration="1200"
                  data-aos-delay={index * 200 + 100}>
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${BACKEND_BASE_URL}${item.image}`
                    }
                    alt={item.title}
                    className="w-full h-56 md:h-64 lg:h-72 xl:h-74 object-cover rounded-[8px]"
                  />
                  <div className="absolute bottom-0 text-[14px] py-1 sm:text-[16px] md:text-[17px] lg:text-[17px] xl:text-[17px] text-gray-500 font-regular leading-tight lg:leading-[1.3] left-1/2 transform -translate-x-1/2 bg-[#e9e0d4] px-3 font-figtree rounded-t-lg">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <h3
                  className="text-[18px] sm:text-[21px] md:text-[23px] lg:text-[25px] xl:text-[25px] leading-snug leading-tight text-black-700 px-2 font-figtree"
                  data-aos="fade-right"
                  data-aos-duration="1200"
                  data-aos-delay={index * 200 + 200}>
                  {item.title}
                </h3>

                <div
                  className="mt-2 flex justify-end  items-center"
                  data-aos="fade-left"
                  data-aos-duration="1200"
                  data-aos-delay={index * 200 + 250}>
                  <Link
                    to={`/inspiration/${item.slug || item._id}`}
                    className="flex items-center gap-2 mx-auto font-figtree text-[16px] sm:text-[18px] transition group no-underline">
                    <span className="inline-flex font-regular items-center gap-1 text-black text-[16px] sm:text-[18px] no-underline">
                      Read More
                    </span>
                    <span className="text-[#993333] transform transition-transform duration-200 group-hover:translate-x-[5px]">
                      <ArrowRight size={20} strokeWidth={2} />
                    </span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-10 flex justify-center" data-aos="fade-left"
          data-aos-duration="1200">
          <Link
            to="/inspiration-board"
            className="px-3 py-2 text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] leading-snug leading-tight text-black-700 font-figtree no-underline rounded-full bg-[#983120] text-white font-medium text-base hover:bg-[#7a241b] hover:shadow-lg transition-all duration-300">
            Find More Inspiration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InspirationBoard;
