import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

const StudyWithSita = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);
  return (
    <>
      {/* --------------------  HERO SECTION -------------------- */}
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

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Study with Sita" }]}
      />
    </>
  );
};

export default StudyWithSita;
