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
  const [imgError, setImgError] = useState(false);

  const navRef = useRef(null);

  const location = useLocation();

  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  const sitaFactorPaths = [
    "/yoga-therapy",
    "/ayurveda-nutrition",
    "/kosha-counselling",
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

  // Helper for Title Case
  const toTitleCase = (str) => {
    return str
      ? str.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
      : "";
  };

  useEffect(() => {
    setIsNavCollapsed(true);
    setActiveDropdown(null);
  }, [location]);

  // Fetch Dynamic Navigation
  const [dynamicNav, setDynamicNav] = useState([]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/cms/navigation`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch navigation");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Navigation Data:", data); // DEBUG: Check order values
        setDynamicNav(data.filter((p) => p.addToHeader));
      })
      .catch((err) => console.error("Error fetching navigation:", err));
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [currentUser?.picture]);

  // Categorize Dynamic Pages
  // Categorize Dynamic Pages
  const moreLabelPage = dynamicNav.find((p) => p.slug === "nav-more");
  const overflowLabel = moreLabelPage ? moreLabelPage.title || "More" : "More";

  const topRowPages = dynamicNav
    .filter((p) => p.headerRow === "top" && p.slug !== "nav-more")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Unified Dynamic Main Row Items (Dropdowns + Links)
  const dynamicMainRowItems = dynamicNav
    .filter(
      (p) =>
        p.headerRow !== "top" &&
        !p.headerParent && // Root Level
        p.slug !== "nav-more",
    )
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const sitaFactorPages = dynamicNav
    .filter((p) => p.headerParent === "sitaFactor")
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  const workshopPages = dynamicNav
    .filter((p) => p.headerParent === "workshops")
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  // --- MERGE STATIC & DYNAMIC ITEMS FOR MAIN ROW ---
  const staticItems = [
    {
      id: "about",
      order: 1,
      type: "static-link",
      label: "ABOUT SITA",
      path: "/about",
    },
    {
      id: "sitaFactor",
      order: 2,
      type: "sitaFactor-dropdown",
      label: "THE SITA FACTOR",
    },
    {
      id: "workshops",
      order: 3,
      type: "workshops-dropdown",
      label: "WORKSHOPS",
    },
    {
      id: "publications",
      order: 4,
      type: "static-link",
      label: "PUBLICATIONS",
      path: "/publications",
    },
  ];

  const dynamicItems = dynamicMainRowItems.map((item) => ({
    ...item,
    id: item.slug,
    type: item.isDropdownParent ? "dynamic-dropdown" : "dynamic-link",
    // Use the order from CMS, default to 0 if missing.
    // Note: Static items start at 10. So default 0 will appear BEFORE static items.
    order: Number(item.order) || 0,
  }));

  const allMainRowItems = [...staticItems, ...dynamicItems]
    .sort((a, b) => a.order - b.order)
    // DEDUPLICATE BY LABEL (Case-Insensitive)
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            (t.label || t.navigationTitle || t.slug).toLowerCase().trim() ===
            (item.label || item.navigationTitle || item.slug)
              .toLowerCase()
              .trim(),
        ),
    );

  // Custom Dynamic Dropdowns Helper
  const getChildrenForParent = (parentSlug) =>
    dynamicNav
      .filter((p) => p.headerParent === parentSlug)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

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
                    {currentUser?.picture && !imgError ? (
                      <img
                        src={currentUser.picture}
                        alt="User"
                        className="user-avatar-img"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="user-avatar-initials">
                        {currentUser?.name
                          ? currentUser.name.charAt(0).toUpperCase()
                          : currentUser?.email
                            ? currentUser.email.charAt(0).toUpperCase()
                            : "U"}
                      </div>
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
                        {currentUser?.picture && !imgError ? (
                          <img
                            src={currentUser.picture}
                            alt="User"
                            className="user-avatar-img"
                            onError={() => setImgError(true)}
                          />
                        ) : (
                          <div className="user-avatar-initials">
                            {currentUser?.name
                              ? currentUser.name.charAt(0).toUpperCase()
                              : currentUser?.email
                                ? currentUser.email.charAt(0).toUpperCase()
                                : "U"}
                          </div>
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

                {/* DYNAMIC TOP ROW PAGES */}
                {/* DYNAMIC TOP ROW PAGES */}
                {(() => {
                  // Helper for Top Row Logic specific rendering
                  const truncateLabel = (str) => {
                    const label = str || "";
                    // "number of alphabets, it should be only 7 accepted"
                    return label.length > 7
                      ? label.substring(0, 7) + "..."
                      : label;
                  };

                  // Logic: "no more than 2 can be in the root level"
                  // If we have > 2 pages, we show 1 page + 1 "More" dropdown.
                  // If we have <= 2 pages, we show them as is.
                  // BUT user said "Dropdown Menu is also counted in the 2".
                  // So:
                  // 1. [Page 1] [Page 2] (Total 2)
                  // 2. [Page 1] [More Dropdown] (Total 2, dropdown contains Page 2, Page 3...)

                  let visiblePages = topRowPages;
                  let overflowPages = [];

                  if (topRowPages.length > 2) {
                    visiblePages = topRowPages.slice(0, 1);
                    overflowPages = topRowPages.slice(1);
                  }

                  return (
                    <>
                      {visiblePages.map((page) => (
                        <li className="nav-item" key={page._id || page.slug}>
                          <Link
                            to={`/${page.slug}`}
                            className={`nav-link ${pathname === `/${page.slug}` ? "active" : ""}`}
                            style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                            {truncateLabel(
                              toTitleCase(
                                page.navigationTitle ||
                                  page.title ||
                                  page.slug.replace(/-/g, " "),
                              ),
                            )}
                          </Link>
                        </li>
                      ))}

                      {overflowPages.length > 0 && (
                        <li className="nav-item dropdown">
                          <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            style={{ fontSize: "0.85rem", fontWeight: 500 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleDropdown("topRowOverflow", e);
                            }}>
                            {toTitleCase(overflowLabel)}
                          </a>
                          <ul
                            className={`dropdown-menu ${activeDropdown === "topRowOverflow" ? "show" : ""} dropdown-menu-end`}>
                            {overflowPages.map((page) => (
                              <li key={page._id || page.slug}>
                                <Link
                                  className="dropdown-item"
                                  to={`/${page.slug}`}>
                                  {toTitleCase(
                                    page.navigationTitle ||
                                      page.title ||
                                      page.slug.replace(/-/g, " "),
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                    </>
                  );
                })()}

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

                {allMainRowItems.map((item) => {
                  // --- STATIC: ABOUT & PUBLICATIONS ---
                  if (item.type === "static-link") {
                    return (
                      <li className="nav-item" key={item.id}>
                        <Link
                          to={item.path}
                          className={`nav-link ${pathname === item.path ? "active" : ""}`}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  // --- STATIC: THE SITA FACTOR ---
                  if (item.type === "sitaFactor-dropdown") {
                    return (
                      <li
                        key={item.id}
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
                          {item.label}
                        </a>
                        <ul
                          className={`dropdown-menu ${activeDropdown === "sitaFactor" ? "show" : ""}`}>
                          <li>
                            <Link className="dropdown-item" to="/yoga-therapy">
                              Yoga Therapy
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/ayurveda-nutrition">
                              Ayurveda – Nutrition & Integration
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/kosha-counselling">
                              Kosha Counselling
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/soul-curriculum">
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
                          {/* Dynamic Sita Factor Pages */}
                          {sitaFactorPages.map((page) => (
                            <li key={page._id || page.slug}>
                              <Link
                                className="dropdown-item"
                                to={`/${page.slug}`}>
                                {toTitleCase(
                                  page.navigationTitle ||
                                    page.title ||
                                    page.slug.replace(/-/g, " "),
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }

                  // --- STATIC: WORKSHOPS ---
                  if (item.type === "workshops-dropdown") {
                    return (
                      <li
                        key={item.id}
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
                          {item.label}
                        </a>
                        <ul
                          className={`dropdown-menu ${activeDropdown === "workshops" ? "show" : ""}`}>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/group-sessions">
                              Group Sessions
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/private-sessions">
                              Private Sessions
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/teacher-training">
                              Teacher Training
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/corporate-training">
                              Corporate Training
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/shakthi-leadership">
                              Shakthi Leadership
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to="/booking">
                              Calendar
                            </Link>
                          </li>
                          {/* Dynamic Workshop Pages */}
                          {workshopPages.map((page) => (
                            <li key={page._id || page.slug}>
                              <Link
                                className="dropdown-item"
                                to={`/${page.slug}`}>
                                {toTitleCase(
                                  page.navigationTitle ||
                                    page.title ||
                                    page.slug.replace(/-/g, " "),
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }

                  // --- DYNAMIC: DROPDOWN ---
                  if (item.type === "dynamic-dropdown") {
                    return (
                      <li
                        key={item._id || item.slug}
                        className={`nav-item dropdown ${activeDropdown === item.slug ? "show" : ""}`}>
                        <a
                          className={`nav-link dropdown-toggle ${pathname.startsWith("/" + item.slug) ? "active" : ""}`}
                          href="#"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown(item.slug, e);
                          }}>
                          {(item.navigationTitle || item.title || item.slug)
                            .toUpperCase()
                            .replace(/-/g, " ")}
                        </a>

                        <ul
                          className={`dropdown-menu ${activeDropdown === item.slug ? "show" : ""}`}>
                          {getChildrenForParent(item.slug).map((child) => (
                            <li key={child._id || child.slug}>
                              <Link
                                className="dropdown-item"
                                to={`/${child.slug}`}>
                                {toTitleCase(
                                  child.navigationTitle ||
                                    child.title ||
                                    child.slug.replace(/-/g, " "),
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }

                  // --- DYNAMIC: STANDARD LINK ---
                  if (item.type === "dynamic-link") {
                    return (
                      <li className="nav-item" key={item._id || item.slug}>
                        <Link
                          to={`/${item.slug}`}
                          className={`nav-link ${pathname === `/${item.slug}` ? "active" : ""}`}>
                          {(item.navigationTitle || item.title || item.slug)
                            .toUpperCase()
                            .replace(/-/g, " ")}
                        </Link>
                      </li>
                    );
                  }

                  return null;
                })}
              </ul>

              {/* DYNAMIC TOP ROW PAGES (Mobile Only) */}
              <ul className="navbar-nav d-lg-none">
                {topRowPages.map((page) => (
                  <li
                    className="nav-item"
                    key={`mobile-${page._id || page.slug}`}>
                    <Link
                      to={`/${page.slug}`}
                      className={`nav-link ${pathname === `/${page.slug}` ? "active" : ""}`}>
                      {toTitleCase(
                        page.navigationTitle ||
                          page.title ||
                          page.slug.replace(/-/g, " "),
                      )}
                    </Link>
                  </li>
                ))}

                {/* Contact Us - MOBILE ONLY - At Bottom */}
                <li className="nav-item">
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
