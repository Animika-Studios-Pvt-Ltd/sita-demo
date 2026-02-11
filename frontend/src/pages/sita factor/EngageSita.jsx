import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "./SitaFactor.css";

const EngageSita = () => {
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
            <img src="about-banner.webp" alt="About Banner" />
          </div>
        </div>
      </section>

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Engage Sita" }]}
      />

      {/* -------------------- ENGAGE WITH SITA SECTION -------------------- */}
      <section className="sita-factor-inner-pages">
        <div className="container">
          <h2>Engage with Sita</h2>
          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />
        </div>
      </section>
    </>
  );
};

export default EngageSita;
