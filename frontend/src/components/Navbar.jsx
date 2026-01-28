import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { getSubdomain, getAppUrl } from "../utils/subdomain";
import "./Navbar.css";

const Navbar = () => {
  const currentSubdomain = getSubdomain();
  const isStore = currentSubdomain === 'store';
  const isBlog = currentSubdomain === 'blog';

  // Auth & Cart
  const { currentUser, isAuthenticated, logout, loginWithRedirect } = useAuth();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // State
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();

  useEffect(() => {
    setIsNavCollapsed(true);
    setActiveDropdown(null);
  }, [location]);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const toggleDropdown = (name, e) => {
    if (e) e.preventDefault();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="sita-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          {/* Center Logo */}
          {currentSubdomain ? (
            <a className="navbar-brand" href={getAppUrl(null, '/')}>
              <img src="/sita-logo.webp" alt="Sita Logo" className="img-fluid sita-logo" />
            </a>
          ) : (
            <Link className="navbar-brand" to="/">
              <img src="/sita-logo.webp" alt="Sita Logo" className="img-fluid sita-logo" />
            </Link>
          )}

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="custom-toggler">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="sita-mainNav">
            <div className="sita-nav-rows ms-auto">
              {/* TOP ROW: Contact + User + Cart */}
              <ul className="navbar-nav sita-nav justify-content-end top-row-utils">
                {/* User Logic - Visible on Store and Booking */}
                {(isStore || currentSubdomain === 'booking') && (
                  <li className={`nav-item dropdown ${activeDropdown === 'user' ? 'show' : ''}`}>
                    {isAuthenticated ? (
                      <>
                        <a
                          className="nav-link dropdown-toggle nav-icon-link"
                          href="#"
                          role="button"
                          onClick={(e) => toggleDropdown('user', e)}
                        >
                          {currentUser?.picture ? (
                            <img src={currentUser.picture} alt="User" className="user-avatar-img" />
                          ) : (
                            <i className="fa-regular fa-user"></i>
                          )}
                        </a>
                        <ul className={`dropdown-menu ${activeDropdown === 'user' ? 'show' : ''}`}>
                          <li><Link className="dropdown-item" to="/my-profile">Profile</Link></li>
                          <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                          <li><button className="dropdown-item" onClick={() => logout()}>Logout</button></li>
                        </ul>
                      </>
                    ) : (
                      <button
                        className="nav-link btn-link nav-icon-link"
                        onClick={() => loginWithRedirect()}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                      >
                        <i className="fa-regular fa-user"></i>
                      </button>
                    )}
                  </li>
                )}

                {/* Cart Logic - Visible only on Store */}
                {isStore && (
                  <li className="nav-item">
                    <Link className="nav-link cart-link-container nav-icon-link" to="/cart">
                      <i className="fa-solid fa-cart-shopping"></i>
                      {cartItems.length > 0 && (
                        <span className="cart-badge">{cartItems.length}</span>
                      )}
                    </Link>
                  </li>
                )}

                {/* Contact Us - Moved to far right */}
                <li className="nav-item">
                  <Link className="nav-link nav-contact" to="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>

              {/* BOTTOM ROW: Main Menu */}
              <ul className="navbar-nav sita-nav">
                <li className="nav-item">
                  {currentSubdomain ? (
                    <a className="nav-link home-icon" href={getAppUrl(null, '/')}>
                      <i className="fa-solid fa-house"></i>
                    </a>
                  ) : (
                    <Link className="nav-link home-icon" to="/">
                      <i className="fa-solid fa-house"></i>
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Anilkumar">ABOUT SITA</Link>
                </li>

                {/* THE SITA FACTOR Dropdown */}
                <li className={`nav-item dropdown ${activeDropdown === 'sitaFactor' ? 'show' : ''}`}>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    onClick={(e) => toggleDropdown('sitaFactor', e)}
                    aria-expanded={activeDropdown === 'sitaFactor'}
                  >
                    THE SITA FACTOR
                  </a>
                  <ul className={`dropdown-menu ${activeDropdown === 'sitaFactor' ? 'show' : ''}`}>
                    <li><Link className="dropdown-item" to="/yoga-therapy">Yoga Therapy</Link></li>
                    <li><Link className="dropdown-item" to="/ayurveda-nutrition">Ayurveda – Nutrition & Integration</Link></li>
                    <li><Link className="dropdown-item" to="/kosha-counseling">Kosha Counseling</Link></li>
                    <li><Link className="dropdown-item" to="/soul-curriculum">Soul Curriculum</Link></li>
                    <li><Link className="dropdown-item" to="/release-karmic-patterns">Release Karmic Patterns</Link></li>
                  </ul>
                </li>

                {/* WORKSHOPS Dropdown */}
                <li className={`nav-item dropdown ${activeDropdown === 'workshops' ? 'show' : ''}`}>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    onClick={(e) => toggleDropdown('workshops', e)}
                    aria-expanded={activeDropdown === 'workshops'}
                  >
                    WORKSHOPS
                  </a>
                  <ul className={`dropdown-menu ${activeDropdown === 'workshops' ? 'show' : ''}`}>
                    <li><Link className="dropdown-item" to="/group-sessions">Group Sessions</Link></li>
                    <li><Link className="dropdown-item" to="/private-sessions">Private Sessions</Link></li>
                    <li><Link className="dropdown-item" to="/teacher-training">Teacher Training</Link></li>
                    <li><Link className="dropdown-item" to="/corporate-training">Corporate Training</Link></li>
                    <li><Link className="dropdown-item" to="/shakthi-leadership">Shakthi Leadership</Link></li>
                  </ul>
                </li>

                {/* PUBLICATIONS */}
                <li className="nav-item">
                  {isStore ? (
                    <Link className="nav-link" to="/">PUBLICATIONS</Link>
                  ) : (
                    <a className="nav-link" href={getAppUrl('store', '/')}>PUBLICATIONS</a>
                  )}
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
