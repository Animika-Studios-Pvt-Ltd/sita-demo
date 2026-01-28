import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { getSubdomain, getAppUrl } from "../utils/subdomain";
import { HomeIcon, UserIcon, CartIcon } from "./Icons";
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
            <a className="navbar-brand me-auto" href={getAppUrl(null, '/')}>
              <img src="/sita-logo.webp" alt="Sita Logo" className="img-fluid sita-logo" />
            </a>
          ) : (
            <Link className="navbar-brand me-auto" to="/">
              <img src="/sita-logo.webp" alt="Sita Logo" className="img-fluid sita-logo" />
            </Link>
          )}

          {/* MOBILE ICONS (User + Cart) - OUTSIDE Collapse - Visible on Mobile Only (d-lg-none) */}
          <div className="d-flex d-lg-none align-items-center gap-3 ms-auto me-3 nav-icons-mobile-wrapper">
            {/* User Logic */}
            {(isStore || currentSubdomain === 'booking') && (
              <div className={`nav-item dropdown ${activeDropdown === 'userMobile' ? 'show' : ''}`}>
                {isAuthenticated ? (
                  <>
                    <a
                      className="nav-link dropdown-toggle nav-icon-link p-0"
                      href="#"
                      role="button"
                      onClick={(e) => toggleDropdown('userMobile', e)}
                    >
                      {currentUser?.picture ? (
                        <img src={currentUser.picture} alt="User" className="user-avatar-img" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </a>
                    <ul className={`dropdown-menu dropdown-menu-end ${activeDropdown === 'userMobile' ? 'show' : ''}`} style={{ position: 'absolute', right: 0, left: 'auto', minWidth: '160px' }}>
                      <li><Link className="dropdown-item" to="/my-profile">Profile</Link></li>
                      <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                      <li><button className="dropdown-item" onClick={() => logout()}>Logout</button></li>
                    </ul>
                  </>
                ) : (
                  <button
                    className="nav-link btn-link nav-icon-link p-0"
                    onClick={() => loginWithRedirect()}
                    style={{ background: 'none', border: 'none' }}
                  >
                    <UserIcon size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Cart Logic */}
            {isStore && (
              <div className="nav-item">
                <Link className="nav-link cart-link-container nav-icon-link p-0" to="/cart">
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

              {/* DESKTOP TOP ROW: Contact + User + Cart - Visible on Desktop Only (d-none d-lg-flex) */}
              <ul className="navbar-nav sita-nav justify-content-end top-row-utils d-none d-lg-flex">
                {/* User Logic */}
                {(isStore || currentSubdomain === 'booking') && (
                  <li className={`nav-item dropdown ${activeDropdown === 'userDesktop' ? 'show' : ''}`}>
                    {isAuthenticated ? (
                      <>
                        <a
                          className="nav-link dropdown-toggle nav-icon-link"
                          href="#"
                          role="button"
                          onClick={(e) => toggleDropdown('userDesktop', e)}
                        >
                          {currentUser?.picture ? (
                            <img src={currentUser.picture} alt="User" className="user-avatar-img" />
                          ) : (
                            <UserIcon size={20} />
                          )}
                        </a>
                        <ul className={`dropdown-menu ${activeDropdown === 'userDesktop' ? 'show' : ''}`}>
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
                        <UserIcon size={20} />
                      </button>
                    )}
                  </li>
                )}

                {/* Cart Logic */}
                {isStore && (
                  <li className="nav-item">
                    <Link className="nav-link cart-link-container nav-icon-link" to="/cart">
                      <CartIcon size={20} />
                      {cartItems.length > 0 && (
                        <span className="cart-badge">{cartItems.length}</span>
                      )}
                    </Link>
                  </li>
                )}

                {/* Contact Us - Desktop Position (Top Right) */}
                <li className="nav-item">
                  <Link className="nav-link nav-contact" to="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>

              {/* BOTTOM ROW (Desktop) / MAIN MENU (Mobile) */}
              <ul className="navbar-nav sita-nav">
                <li className="nav-item">
                  {currentSubdomain ? (
                    <a className="nav-link home-icon" href={getAppUrl(null, '/')}>
                      <HomeIcon size={18} />
                    </a>
                  ) : (
                    <Link className="nav-link home-icon" to="/">
                      <HomeIcon size={18} />
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
