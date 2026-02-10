import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { UserIcon, CartIcon } from "./Icons";
import "./Navbar.css";

const Navbar = () => {
  // Auth & Cart
  const { currentUser, isAuthenticated, logout, loginWithRedirect } = useAuth();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // State
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navRef = useRef(null);

  const location = useLocation();

  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  const sitaFactorPaths = [
    "/yoga-therapy",
    "/ayurveda-nutrition",
    "/kosha-counseling",
    "/soul-curriculum",
    "/release-karmic-patterns",
  ];

  const isSitaFactorActive = sitaFactorPaths.some((path) =>
    pathname.startsWith(path),
  );

  const workshopPaths = [
    "/group-sessions",
    "/private-sessions",
    "/teacher-training",
    "/corporate-training",
    "/shakthi-leadership",
  ];

  const isWorkshopsActive = workshopPaths.some((path) =>
    pathname.startsWith(path),
  );

  const isPublicationsActive = pathname.startsWith("/publications");

  const showCartIcon =
    !isHomePage &&
    (pathname.startsWith("/publications") ||
      pathname.startsWith("/store") ||
      pathname.startsWith("/books") ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/my-orders") ||
      pathname.startsWith("/ebook"));

  useEffect(() => {
    setIsNavCollapsed(true);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const toggleDropdown = (name, e) => {
    if (e) e.preventDefault();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="sita-header">
      <nav className="navbar navbar-expand-lg navbar-light" ref={navRef}>
        <div className="container">
          {/* Center Logo */}
          <a className="navbar-brand me-auto" href="/">
            <img
              src="/sita-logo.webp"
              alt="Sita Logo"
              className="img-fluid sita-logo"
            />
          </a>

          <div className="d-flex d-lg-none align-items-center gap-3 ms-auto me-3 nav-icons-mobile-wrapper">
            {/* User Logic */}
            <div
              className={`nav-item dropdown ${activeDropdown === "userMobile" ? "show" : ""}`}>
              {isAuthenticated ? (
                <>
                  <a
                    className="nav-link nav-icon-link p-0"
                    href="#"
                    role="button"
                    onClick={(e) => toggleDropdown("userMobile", e)}>
                    {currentUser?.picture ? (
                      <img
                        src={currentUser.picture}
                        alt="User"
                        className="user-avatar-img"
                      />
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </a>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${activeDropdown === "userMobile" ? "show" : ""}`}
                    style={{
                      position: "absolute",
                      right: 0,
                      left: "auto",
                      minWidth: "160px",
                    }}>
                    <li>
                      <Link className="dropdown-item" to="/my-profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-orders">
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-bookings">
                        My Bookings
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => logout()}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <button
                  className="nav-link btn-link nav-icon-link p-0"
                  onClick={() => loginWithRedirect()}
                  style={{ background: "none", border: "none" }}>
                  <UserIcon size={20} />
                </button>
              )}
            </div>

            {/* Cart Logic - Conditionally visible */}
            {showCartIcon && (
              <div className="nav-item">
                <Link
                  className="nav-link cart-link-container nav-icon-link p-0"
                  to="/cart">
                  <CartIcon size={20} />
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation">
            <span className="custom-toggler">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div
            className={`collapse navbar-collapse ${!isNavCollapsed ? "show" : ""}`}
            id="sita-mainNav">
            <div className="sita-nav-rows ms-auto">
              {/* DESKTOP TOP ROW: Contact + User + Cart - Visible on Desktop Only (d-none d-lg-flex) */}
              <ul className="navbar-nav sita-nav justify-content-end top-row-utils d-none d-lg-flex">
                {/* User Logic */}
                <li
                  className={`nav-item dropdown ${activeDropdown === "userDesktop" ? "show" : ""}`}>
                  {isAuthenticated ? (
                    <>
                      <a
                        className="nav-link nav-icon-link"
                        href="#"
                        role="button"
                        onClick={(e) => toggleDropdown("userDesktop", e)}>
                        {currentUser?.picture ? (
                          <img
                            src={currentUser.picture}
                            alt="User"
                            className="user-avatar-img"
                          />
                        ) : (
                          <UserIcon size={20} />
                        )}
                      </a>
                      <ul
                        className={`dropdown-menu ${activeDropdown === "userDesktop" ? "show" : ""}`}>
                        <li>
                          <Link className="dropdown-item" to="/my-profile">
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/my-orders">
                            My Orders
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/my-bookings">
                            My Bookings
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => logout()}>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <button
                      className="nav-link btn-link nav-icon-link"
                      onClick={() => loginWithRedirect()}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}>
                      <UserIcon size={20} />
                    </button>
                  )}
                </li>

                {/* Cart Logic - Conditionally visible */}
                {showCartIcon && (
                  <li className="nav-item">
                    <Link
                      className="nav-link cart-link-container nav-icon-link"
                      to="/cart">
                      <CartIcon size={20} />
                      {cartItems.length > 0 && (
                        <span className="cart-badge">{cartItems.length}</span>
                      )}
                    </Link>
                  </li>
                )}

                {/* Contact Us - Desktop Position (Top Right) */}
                <li className="nav-item">
                  <a className="nav-link nav-contact" href="/contact">
                    Contact Us
                  </a>
                </li>
              </ul>

              {/* BOTTOM ROW (Desktop) / MAIN MENU (Mobile) */}
              <ul className="navbar-nav sita-nav">
                {!isHomePage && (
                  <li className="nav-item">
                    <Link className="nav-link home-icon" to="/">
                      <i className="fa-solid fa-house"></i>
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    ABOUT SITA
                  </Link>
                </li>

                {/* THE SITA FACTOR Dropdown */}
                <li
                  className={`nav-item dropdown ${activeDropdown === "sitaFactor" ? "show" : ""}`}>
                  <a
                    className={`nav-link dropdown-toggle ${isSitaFactorActive ? "active" : ""}`}
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown("sitaFactor", e);
                    }}>
                    THE SITA FACTOR
                  </a>

                  <ul
                    className={`dropdown-menu ${activeDropdown === "sitaFactor" ? "show" : ""}`}>
                    <li>
                      <Link className="dropdown-item" to="/yoga-therapy">
                        Yoga Therapy
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/ayurveda-nutrition">
                        Ayurveda – Nutrition & Integration
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/kosha-counseling">
                        Kosha Counseling
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/soul-curriculum">
                        Soul Curriculum
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/release-karmic-patterns">
                        Release Karmic Patterns
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* WORKSHOPS Dropdown */}
                <li
                  className={`nav-item dropdown ${activeDropdown === "workshops" ? "show" : ""}`}>
                  <a
                    className={`nav-link dropdown-toggle ${isWorkshopsActive ? "active" : ""}`}
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown("workshops", e);
                    }}>
                    WORKSHOPS
                  </a>

                  <ul
                    className={`dropdown-menu ${activeDropdown === "workshops" ? "show" : ""}`}>
                    <li>
                      <Link className="dropdown-item" to="/group-sessions">
                        Group Sessions
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/private-sessions">
                        Private Sessions
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/teacher-training">
                        Teacher Training
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/corporate-training">
                        Corporate Training
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/shakthi-leadership">
                        Shakthi Leadership
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/booking">
                        Calendar
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* PUBLICATIONS */}
                <li className="nav-item">
                  <Link
                    to="/publications"
                    className={`nav-link ${isPublicationsActive ? "active" : ""}`}>
                    PUBLICATIONS
                  </Link>
                </li>

                {/* Contact Us - MOBILE ONLY (d-lg-none) - At Bottom */}
                <li className="nav-item d-lg-none">
                  <Link className="nav-link nav-contact" to="/contact">
                    CONTACT US
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
