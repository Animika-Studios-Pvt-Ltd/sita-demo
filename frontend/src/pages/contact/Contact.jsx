import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "./Contact.css";
import getBaseUrl from "../../utils/baseURL";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      const response = await fetch(`${getBaseUrl()}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", mobile: "", message: "" });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

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
                onSubmit={handleSubmit}
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
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
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
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit mobile number (optional)"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
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
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message (optional)"
                    required></textarea>
                </div>

                <button
                  type="submit"
                  className="btn mx-auto"
                  id="submitBtn"
                  disabled={loading}>
                  <span className="btn-text">
                    {loading ? "Sending..." : "Submit"}
                  </span>
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                      aria-hidden="true"></span>
                  )}
                </button>

                {success && (
                  <div className="alert alert-success mt-3" id="successAlert">
                    <i className="fas fa-check-circle"></i> Thank you! Your
                    message has been sent successfully.
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger mt-3" id="errorAlert">
                    <i className="fas fa-exclamation-circle"></i> Something went
                    wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
