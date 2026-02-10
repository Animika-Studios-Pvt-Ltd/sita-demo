import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "./Contact.css";

const Contact = () => {
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
            <img src="/about-banner.webp" alt="About Banner" />
          </div>
        </div>
      </section>

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Contact" }]}
      />

      {/* -------------------- CONTACT US SECTION -------------------- */}
      <section
        className="contact-us-section"
        data-aos="fade-up"
        data-aos-duration="1000">
        <div className="container text-center">
          <h2 data-aos="fade-down" data-aos-delay="200">
            Contact Us
          </h2>

          <div className="row justify-content-center">
            {/* Contact Form */}
            <div
              className="col-lg-6 col-md-8 col-sm-10 col-12"
              data-aos="fade-up"
              data-aos-delay="400">
              <form
                className="contact-form mx-auto"
                id="contactForm"
                noValidate>
                <div className="mb-3" data-aos="fade-up" data-aos-delay="200">
                  <label htmlFor="name" className="form-label">
                    Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter your name.
                  </div>
                </div>

                <div className="mb-3" data-aos="fade-up" data-aos-delay="300">
                  <label htmlFor="email" className="form-label">
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                </div>

                <div className="mb-3" data-aos="fade-up" data-aos-delay="400">
                  <label htmlFor="mobile" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter your 10-digit mobile number (optional)"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                  <div className="invalid-feedback">
                    Please enter a valid 10-digit mobile number.
                  </div>
                </div>

                <div className="mb-3" data-aos="fade-up" data-aos-delay="500">
                  <label htmlFor="message" className="form-label">
                    Message <span>*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Write your message (optional)"
                    required></textarea>
                </div>

                <button type="submit" className="btn mx-auto" id="submitBtn">
                  <span className="btn-text">Submit</span>
                  <span
                    className="spinner-border spinner-border-sm d-none"
                    role="status"
                    aria-hidden="true"></span>
                </button>

                <div
                  className="alert alert-success d-none mt-3"
                  id="successAlert">
                  <i className="fas fa-check-circle"></i> Thank you! Your
                  message has been sent successfully.
                </div>

                <div className="alert alert-danger d-none mt-3" id="errorAlert">
                  <i className="fas fa-exclamation-circle"></i> Something went
                  wrong. Please try again.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
