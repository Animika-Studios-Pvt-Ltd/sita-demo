import { useEffect, useState } from "react";
import { usePreloadedData } from "../../context/DataContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const SectionHeading = ({ children, showMotif = true, motifImage }) => (
  <div
    className="relative w-full flex justify-center lg:justify-start mt-1 mb-4 lg:mt-10 lg:mb-10"
    data-aos="fade-down"
    data-aos-duration="1400"
    data-aos-easing="ease-in-out">
    <h1 className="relative z-10 text-[28px] sm:text-[32px] md:text-[40px] font-playfair font-light text-black leading-tight text-center lg:text-left">
      <span className="relative inline-block">
        {children}
        {showMotif && motifImage?.src && (
          <img
            src={motifImage.src}
            alt={motifImage.alt || ""}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 md:w-28 lg:w-32 h-auto opacity-15 pointer-events-none z-0"
            loading="lazy"
          />
        )}
      </span>
    </h1>
  </div>
);

const AboutAuthor = () => {
  const preloadedData = usePreloadedData();
  const [content, setContent] = useState(null);

  useEffect(() => {
    AOS.init({
      once: true,
      mirror: false,
      duration: 1400,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    if (preloadedData.author) {
      setContent(preloadedData.author);
    }
  }, [preloadedData]);

  if (!content) return null;

  return (
    <section className="max-w-8xl mx-auto px-4 md:px-6 py-0 md:py-16 font-Figtree space-y-8">
      <article
        className="bg-[#e9ebec] rounded-xl p-4 py-5 sm:p-5 md:p-10 px-3 sm:px-6 md:px-10 flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-10 md:gap-20"
        data-aos="fade-up"
        data-aos-duration="1400"
        data-aos-easing="ease-in-out">
        <div
          className="flex-1 px-2 md:px-5 md:ml-12 flex flex-col items-left lg:items-start text-left lg:text-left"
          data-aos="fade-right"
          data-aos-duration="1400"
          data-aos-easing="ease-in-out">
          <SectionHeading motifImage={content.sectionHeading.motifImage}>
            {content.aboutAuthor.leftText.heading}
          </SectionHeading>

          {content.aboutAuthor.leftText.paragraphs
            .slice(0, 3)
            .map((para, idx) => (
              <p
                key={idx}
                className={para.style}
                data-aos="fade-right"
                data-aos-duration={1400 + idx * 150}
                data-aos-easing="ease-in-out">
                {para.text}
              </p>
            ))}

          <Link
            to={content.workingCreed.rightText.link.to}
            className="group inline-flex items-center text-sm no-underline font-figtree transition-colors duration-200 text-[18px] mt-3"
            data-aos="fade-up"
            data-aos-duration="1600"
            data-aos-easing="ease-in-out">
            <span className="text-black text-[16px] sm:text-[18px] leading-snug lg:leading-normal">
              Read Detailed Profile
            </span>
            <span className="text-[#8c2f24] ml-1 transform transition-transform duration-200 group-hover:translate-x-[5px]">
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </Link>
        </div>
        <div
          className="flex flex-col items-center"
          data-aos="zoom-in"
          data-aos-duration="1600"
          data-aos-easing="ease-in-out">
          <img
            src={content.aboutAuthor.rightImage.src}
            alt={content.aboutAuthor.rightImage.alt}
            className="w-[480px] md:w-[480px] lg:w-[490px]"
            loading="lazy"
          />
        </div>
      </article>
      <article
        className="rounded-xl p-4 sm:p-5 md:p-10 px-0 sm:px-6 md:px-10 flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-10"
        data-aos="fade-up"
        data-aos-duration="1400"
        data-aos-easing="ease-in-out">
        <figure
          className="w-full lg:w-1/2 rounded-lg object-cover overflow-hidden"
          data-aos="zoom-in"
          data-aos-duration="1600"
          data-aos-easing="ease-in-out">
          <img
            src={content.workingCreed.leftImage.src}
            alt={content.workingCreed.leftImage.alt}
            className="w-full h-68 sm:w-min-[200px]"
            loading="lazy"
          />
        </figure>
        <div
          className="w-full lg:w-1/2 text-left lg:text-left mt-0 px-6 md:px-0 lg:py-10 [@media(min-width:2561px)]:py-0 flex flex-col items-center lg:items-start"
          data-aos="fade-left"
          data-aos-duration="1400"
          data-aos-easing="ease-in-out">
          <SectionHeading motifImage={content.sectionHeading.motifImage}>
            {content.workingCreed.rightText.heading}
          </SectionHeading>

          {content.workingCreed.rightText.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={para.style}
              data-aos="fade-left"
              data-aos-duration={1400 + idx * 150}
              data-aos-easing="ease-in-out">
              {para.text}
            </p>
          ))}

          <Link
            to={content.workingCreed.rightText.link.to}
            className="group inline-flex items-center text-sm no-underline font-figtree transition-colors duration-200 text-[18px] mt-3"
            data-aos="fade-up"
            data-aos-duration="1600"
            data-aos-easing="ease-in-out">
            <span className="text-black text-[16px] sm:text-[18px] leading-snug lg:leading-normal">
              {content.workingCreed.rightText.link.text}
            </span>
            <span className="text-[#8c2f24] ml-1 transform transition-transform duration-200 group-hover:translate-x-[5px]">
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </Link>
        </div>
      </article>
    </section>
  );
};

export default AboutAuthor;
