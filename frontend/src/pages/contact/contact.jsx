import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "./contact.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    token,
  });
  const [popup, setPopup] = useState({
    visible: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    // Only render once
    if (!window.turnstile) return;

    // Remove previous widget if any
    const widgetContainer = document.getElementById("turnstile-widget");
    if (!widgetContainer) return;

    // Clear previous children to prevent duplicates
    widgetContainer.innerHTML = "";

    // Render the widget
    window.turnstile.render(widgetContainer, {
      sitekey: import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY,
      callback: (token) => setToken(token),
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setPopup({
        visible: true,
        success: false,
        message: "Please verify you are human before submitting.",
      });
      setTimeout(
        () => setPopup({ visible: false, success: false, message: "" }),
        3000
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact/create-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPopup({
          visible: true,
          success: true,
          message: "Your message has been sent successfully!",
        });
        setFormData({ name: "", email: "", message: "" });
        setToken("");
      } else {
        setPopup({
          visible: true,
          success: false,
          message: data.message || "Failed to send message",
        });
      }

      setTimeout(
        () => setPopup({ visible: false, success: false, message: "" }),
        3000
      );
    } catch (error) {
      console.error(error);
      setPopup({
        visible: true,
        success: false,
        message: "Failed to send message",
      });
      setTimeout(
        () => setPopup({ visible: false, success: false, message: "" }),
        3000
      );
    }
  };

  return (
    <section
      className="container contact"
      data-aos="fade-up"
      data-aos-duration="1200">
      <div
        className="breadcrumb-container"
        data-aos="fade-right"
        data-aos-duration="1500">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contact Us
            </li>
          </ol>
        </nav>
      </div>

      <div
        className="container contact-section"
        data-aos="fade-up"
        data-aos-duration="1800">
        <h2 data-aos="zoom-in" data-aos-duration="2000" data-aos-delay="100">
          Write To Us
        </h2>

        <div className="row">
          <div
            className="col-lg-6 col-md-12 col-sm-12"
            data-aos="fade-right"
            data-aos-duration="2000">
            <div className="contact-address">
              <p className="contact-address">Address:</p>
              <p>Lumos - A Division of Animika Studios</p>
              <p>353, 7th Main Rd,</p>
              <p>HAL 2nd Stage, Indiranagar,</p>
              <p>Bengaluru - 560008, Karnataka, India.</p>
              <p>Contact Info: (M) +91-9980806803</p>
              <div className="contact-section-frame">
                <iframe
                  title="Lumos India office location on Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.99834064395256!2d77.64315277252325!3d12.973549912533066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a89466f43b%3A0x40a076f1e9e0ac08!2s353%2C%207th%20Main%20Rd%2C%20HAL%202nd%20Stage%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka%20560038!5e0!3m2!1sen!2sin!4v1714736640187!5m2!1sen!2sin"
                  width="100%"
                  height="350"
                  className="pb-3"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>

          <div
            className="col-lg-6 col-md-12 col-sm-12"
            data-aos="fade-left"
            data-aos-duration="2000">
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              data-aos="fade-up"
              data-aos-duration="1800"
              data-aos-delay="300">
              <div
                className="form-group"
                data-aos="fade-up"
                data-aos-duration="1600"
                data-aos-delay="400">
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div
                className="form-group"
                data-aos="fade-up"
                data-aos-duration="1600"
                data-aos-delay="500">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div
                className="form-group"
                data-aos="fade-up"
                data-aos-duration="1600"
                data-aos-delay="700">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message"></textarea>
              </div>
              <div
                id="turnstile-widget"
                className="my-3"
                data-aos="fade-up"
                data-aos-duration="1600"
                data-aos-delay="800"></div>

              <button
                type="submit"
                className="submit-btn"
                data-aos="zoom-in"
                data-aos-duration="2000"
                data-aos-delay="900">
                Send Message
              </button>
            </form>

            <div
              className="contact-info-text"
              data-aos="fade-in"
              data-aos-duration="2000"
              data-aos-delay="1000">
              <p>
                You can also send your enquiries to Langshott Leadership
                Foundation at{" "}
                <img
                  src="langshott-email.webp"
                  alt="Contact Email"
                  className="img-fluid"
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {popup.visible && (
        <div className="popup-card" data-aos="zoom-in" data-aos-duration="1000">
          <div className="popup-icon">
            {popup.success ? (
              <CheckCircleIcon className="success-icon" fontSize="large" />
            ) : (
              <CancelIcon className="error-icon" fontSize="large" />
            )}
          </div>
          <div className="popup-message">{popup.message}</div>
        </div>
      )}
    </section>
  );
};

export default Contact;
