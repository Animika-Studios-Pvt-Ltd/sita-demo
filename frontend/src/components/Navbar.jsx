import { Link } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth();
  const [userAnchor, setUserAnchor] = useState(null);
  const isUserOpen = Boolean(userAnchor);
  const [hamburgerAnchor, setHamburgerAnchor] = useState(null);
  const isHamburgerOpen = Boolean(hamburgerAnchor);
  const [blogsDesktopAnchor, setBlogsDesktopAnchor] = useState(null);
  const isBlogsDesktopOpen = Boolean(blogsDesktopAnchor);
  const [isBlogsExpanded, setIsBlogsExpanded] = useState(false);
  const hamburgerMenuRef = useRef(null);
  const [dynamicPages, setDynamicPages] = useState([]);
  const [pages, setPages] = useState([]);
  const [mainHeaders, setMainHeaders] = useState([]);
  const [subPagesMap, setSubPagesMap] = useState({});
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isPublicationsExpanded, setIsPublicationsExpanded] = useState(false);
  const [isFoundationExpanded, setIsFoundationExpanded] = useState(false);
  const [isLettersExpanded, setIsLettersExpanded] = useState(false);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    fetch(`${API_URL}/api/pages`)
      .then((res) => res.json())
      .then((data) => {
        setPages(data);
        setDynamicPages(data);

        const headers = data.filter((p) => p.headerType === "heading");
        const subMap = {};
        data.forEach((p) => {
          if (p.headerType === "subheading" && p.parentHeader) {
            const parentId = p.parentHeader._id;
            if (!subMap[parentId]) subMap[parentId] = [];
            subMap[parentId].push(p);
          }
        });
        setMainHeaders(headers);
        setSubPagesMap(subMap);
      })
      .catch((err) => console.error("Failed to load pages:", err));
  }, []);

  dynamicPages.forEach((p) => {
    if (p.headerType === "subheading" && p.parentHeader) {
      const parentId = p.parentHeader._id;
      if (!subPagesMap[parentId]) subPagesMap[parentId] = [];
      subPagesMap[parentId].push(p);
    }
  });

  const handleUserClick = (e) => setUserAnchor(e.currentTarget);
  const handleUserClose = () => setUserAnchor(null);
  const handleLogOut = () => {
    logout();
    handleUserClose();
  };
  const handleHamburgerClick = (e) => setHamburgerAnchor(e.currentTarget);
  const handleHamburgerClose = () => setHamburgerAnchor(null);
  const handleBlogsDesktopClick = (e) => setBlogsDesktopAnchor(e.currentTarget);
  const handleBlogsDesktopClose = () => setBlogsDesktopAnchor(null);

  const closeAllDropdowns = () => {
    handleUserClose();
    handleHamburgerClose();
    handleBlogsDesktopClose();
    setIsBlogsExpanded(false);
    setOpenSubmenus({});
  };
  const desktopMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (userAnchor && userAnchor.contains(e.target)) ||
        (hamburgerAnchor && hamburgerAnchor.contains(e.target)) ||
        (hamburgerMenuRef.current &&
          hamburgerMenuRef.current.contains(e.target)) ||
        (blogsDesktopAnchor && blogsDesktopAnchor.contains(e.target)) ||
        (desktopMenuRef.current && desktopMenuRef.current.contains(e.target))
      )
        return;
      closeAllDropdowns();
    };

    const handleScroll = () => closeAllDropdowns();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [userAnchor, hamburgerAnchor, blogsDesktopAnchor]);

  const mainMenuPages = dynamicPages.filter(
    (p) =>
      !p.suspended &&
      p.displayLocations?.includes("header") &&
      p.headerType === "heading"
  );
  const blogPages = dynamicPages.filter(
    (p) =>
      !p.suspended &&
      p.displayLocations?.includes("header") &&
      p.headerType === "subheading"
  );
  const authorSubPages = dynamicPages.filter(
    (p) =>
      !p.suspended &&
      p.displayLocations?.includes("header") &&
      p.headerType === "author-subheading"
  );
  const publicationSubPages = dynamicPages.filter(
    (p) =>
      !p.suspended &&
      p.displayLocations?.includes("header") &&
      p.headerType === "publication-subheading"
  );
  const FoundationSubPages = dynamicPages.filter(
    (p) =>
      !p.suspended &&
      p.displayLocations?.includes("header") &&
      p.headerType === "Foundation-subheading"
  );
  const letterSubPages = dynamicPages.filter(
    (p) =>
      !p.suspended &&
      p.displayLocations?.includes("header") &&
      p.headerType === "letter-subheading"
  );

  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      setOffset(st > lastScrollTop ? -150 : 0);
      lastScrollTop = st <= 0 ? 0 : st;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (id) => {
    setOpenSubmenus((prev) => {
      const newState = {};
      Object.keys(prev).forEach((key) => (newState[key] = false));
      newState[id] = !prev[id];
      return newState;
    });
  };

  return (
    <header
      className="navbar-header"
      style={{ transform: `translateY(${offset}px)` }}>
      <nav className="container-fluid navbar-container">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-4 col-5">
            <Link to="/" className="navbar-logo">
              <img src="/ak-logo.webp" alt="Anil Kumar Logo" />
            </Link>
          </div>
          <div className="col-lg-8 col-md-8 col-sm-8 col-7">
            <div className="navbar-right-wrapper">
              {!isLoading && (
                <div className="navbar-icons">
                  {/* Render Beside Profile Pages (Desktop Only) */}
                  <div className="beside-profile-desktop">
                    {dynamicPages
                      .filter(
                        (p) =>
                          !p.suspended &&
                          p.displayLocations?.includes("header") &&
                          p.headerType === "beside-profile"
                      )
                      .map((page) => (
                        <Link
                          key={page._id}
                          to={`/${page.slug}`}
                          className="beside-profile-link contact-link" // add contact-link for animation
                        >
                          {page.title.toUpperCase()}
                        </Link>
                      ))}
                  </div>
                  {isAuthenticated ? (
                    <>
                      <IconButton
                        onClick={handleUserClick}
                        size="small"
                        className="user-avatar">
                        <Avatar
                          className="navbar-avatar"
                          src={currentUser?.picture}
                          alt={currentUser?.name || currentUser?.email}>
                          {currentUser?.name?.charAt(0).toUpperCase() ||
                            currentUser?.email?.charAt(0).toUpperCase()}
                        </Avatar>
                      </IconButton>
                      <Menu
                        anchorEl={userAnchor}
                        open={isUserOpen}
                        onClose={handleUserClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        classes={{ paper: "navbar-menu-dropdown" }}>
                        <MenuItem
                          component={Link}
                          to="/my-profile"
                          onClick={handleUserClose}
                          className="navbar-menu-item">
                          Profile
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/orders"
                          onClick={handleUserClose}
                          className="navbar-menu-item">
                          My Orders
                        </MenuItem>
                        {/* <MenuItem component={Link} to="/cart" onClick={handleUserClose} className="navbar-menu-item">
                          Cart
                        </MenuItem>
                        <MenuItem component={Link} to="/checkout" onClick={handleUserClose} className="navbar-menu-item">
                          Checkout
                        </MenuItem> */}
                        <MenuItem
                          onClick={handleLogOut}
                          className="navbar-menu-item">
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <button
                      onClick={() => loginWithRedirect()}
                      className="login-btn"
                      aria-label="Login">
                      <PersonOutlineIcon className="icon" />
                    </button>
                  )}
                  <Link to="/cart" className="cart-link" aria-label="Cart">
                    <ShoppingCartOutlinedIcon className="icon" />
                    {cartItems.length > 0 && (
                      <span className="cart-badge">{cartItems.length}</span>
                    )}
                  </Link>
                  <Link to="/contact" className="contact-link">
                    Contact Me
                  </Link>
                </div>
              )}
              <div className="hamburger-wrapper">
                <IconButton
                  className="hamburger-btn"
                  onClick={handleHamburgerClick}
                  aria-label="Toggle menu">
                  {isHamburgerOpen ? (
                    <CloseIcon className="hamburger-icon" />
                  ) : (
                    <MenuIcon className="hamburger-icon" />
                  )}
                </IconButton>
                <Menu
                  ref={hamburgerMenuRef}
                  anchorEl={hamburgerAnchor}
                  open={isHamburgerOpen}
                  onClose={handleHamburgerClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  classes={{ paper: "navbar-menu-dropdown" }}>
                  {/* Home - show only if not on Home page */}
                  {!isHomePage && (
                    <MenuItem
                      className="navbar-menu-item"
                      onClick={handleHamburgerClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                      <Link
                        to="/"
                        onClick={handleHamburgerClose}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}>
                        <HomeIcon sx={{ fontSize: 18 }} />
                      </Link>
                    </MenuItem>
                  )}

                  {/* About */}
                  <MenuItem
                    className="navbar-menu-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Link
                      to="/Anilkumar"
                      onClick={handleHamburgerClose}
                      style={{ textDecoration: "none", color: "inherit" }}>
                      About
                    </Link>

                    {authorSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAboutExpanded((prev) => !prev);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </MenuItem>

                  {isAboutExpanded &&
                    authorSubPages.map((page) => (
                      <MenuItem
                        key={page._id}
                        component={Link}
                        to={`/${page.slug}`}
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        {page.title}
                      </MenuItem>
                    ))}

                  {/* PUBLICATIONS */}
                  <MenuItem
                    className="navbar-menu-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Link
                      to="/publications"
                      onClick={handleHamburgerClose}
                      style={{ textDecoration: "none", color: "inherit" }}>
                      Publications
                    </Link>
                    {publicationSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPublicationsExpanded((prev) => !prev);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </MenuItem>
                  {isPublicationsExpanded &&
                    publicationSubPages.map((page) => (
                      <MenuItem
                        key={page._id}
                        component={Link}
                        to={`/${page.slug}`}
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        {page.title}
                      </MenuItem>
                    ))}

                  {/* FOUNDATION */}
                  <MenuItem
                    className="navbar-menu-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Link
                      to="/foundation"
                      onClick={handleHamburgerClose}
                      style={{ textDecoration: "none", color: "inherit" }}>
                      The Foundation
                    </Link>
                    {FoundationSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFoundationExpanded((prev) => !prev);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </MenuItem>
                  {isFoundationExpanded &&
                    FoundationSubPages.map((page) => (
                      <MenuItem
                        key={page._id}
                        component={Link}
                        to={`/${page.slug}`}
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        {page.title}
                      </MenuItem>
                    ))}

                  <MenuItem
                    className="navbar-menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBlogsExpanded((prev) => !prev);
                    }}>
                    Blogs <ExpandMoreIcon fontSize="small" />
                  </MenuItem>
                  {isBlogsExpanded && (
                    <>
                      <MenuItem
                        component={Link}
                        to="/blogs"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Blogs
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/inspiration-board"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Inspiration Board
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/sufi-corner"
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        Sufi Corner
                      </MenuItem>
                      {blogPages.map((page) => (
                        <MenuItem
                          key={page._id}
                          component={Link}
                          to={`/${page.slug}`}
                          onClick={handleHamburgerClose}
                          className="navbar-submenu-item">
                          {page.title}
                        </MenuItem>
                      ))}
                    </>
                  )}

                  {/* LETTERS */}
                  <MenuItem
                    className="navbar-menu-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Link
                      to="/letters"
                      onClick={handleHamburgerClose}
                      style={{ textDecoration: "none", color: "inherit" }}>
                      Letters from Langshott
                    </Link>
                    {letterSubPages?.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLettersExpanded((prev) => !prev);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </MenuItem>
                  {isLettersExpanded &&
                    letterSubPages.map((page) => (
                      <MenuItem
                        key={page._id}
                        component={Link}
                        to={`/${page.slug}`}
                        onClick={handleHamburgerClose}
                        className="navbar-submenu-item">
                        {page.title}
                      </MenuItem>
                    ))}
                  {/* NEW HEADING PAGES IN HAMBURGER */}
                  {mainMenuPages.map((p) => (
                    <div key={p._id}>
                      <MenuItem
                        className="navbar-menu-item"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={(e) => {
                          if (subPagesMap[p._id]?.length > 0) {
                            e.stopPropagation();
                            toggleSubmenu(p._id);
                          } else {
                            handleHamburgerClose();
                          }
                        }}>
                        <Link
                          to={`/${p.slug}`}
                          onClick={handleHamburgerClose}
                          style={{ textDecoration: "none", color: "inherit" }}>
                          {p.title}
                        </Link>

                        {subPagesMap[p._id]?.length > 0 && (
                          <ExpandMoreIcon
                            fontSize="small"
                            style={{ cursor: "pointer" }}
                            className={
                              openSubmenus[p._id]
                                ? "rotate-180 transition-transform"
                                : "transition-transform"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubmenu(p._id);
                            }}
                          />
                        )}
                      </MenuItem>

                      {/* Dropdown for subpages */}
                      {openSubmenus[p._id] &&
                        subPagesMap[p._id]?.length > 0 && (
                          <>
                            {subPagesMap[p._id].map((sub) => (
                              <MenuItem
                                key={sub._id}
                                component={Link}
                                to={`/${sub.slug}`}
                                onClick={handleHamburgerClose}
                                className="navbar-submenu-item">
                                {sub.title}
                              </MenuItem>
                            ))}
                          </>
                        )}
                    </div>
                  ))}
                  {/* Beside Profile Pages in Hamburger */}
                  {dynamicPages
                    .filter(
                      (p) =>
                        p.displayLocations?.includes("header") &&
                        p.headerType === "beside-profile"
                    )
                    .map((page) => (
                      <MenuItem
                        key={page._id}
                        component={Link}
                        to={`/${page.slug}`}
                        onClick={handleHamburgerClose}
                        className="navbar-menu-item">
                        {page.title}
                      </MenuItem>
                    ))}
                  <MenuItem
                    component={Link}
                    to="/contact"
                    onClick={handleHamburgerClose}
                    className="navbar-menu-item">
                    Contact Me
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <div className="navbar-desktop-menu">
              <ul className="navbar-menu-desktop" ref={desktopMenuRef}>
                {/* Home Icon - show only if not on Home page */}
                {!isHomePage && (
                  <li className="navbar-main-menu">
                    <Link to="/" className="flex items-center gap-3">
                      <HomeIcon className="navbar-home-icon" />
                    </Link>
                  </li>
                )}

                {/* About */}
                <li className="navbar-main-menu relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link to="/Anilkumar">ABOUT</Link>
                    {authorSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        className={`transition-transform ${
                          openSubmenus["about"] ? "rotate-180" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu("about");
                        }}
                      />
                    )}
                  </div>
                  {openSubmenus["about"] && authorSubPages.length > 0 && (
                    <ul className="navbar-menu-dropdown absolute top-full left-0 mt-2">
                      {authorSubPages.map((p) => (
                        <li key={p._id}>
                          <Link to={`/${p.slug}`} className="navbar-menu-item">
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Publications */}
                <li className="navbar-main-menu relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link to="/publications">PUBLICATIONS</Link>
                    {publicationSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        className={`transition-transform ${
                          openSubmenus["publications"] ? "rotate-180" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu("publications");
                        }}
                      />
                    )}
                  </div>
                  {openSubmenus["publications"] &&
                    publicationSubPages.length > 0 && (
                      <ul className="navbar-menu-dropdown absolute top-full left-0 mt-2">
                        {publicationSubPages.map((p) => (
                          <li key={p._id}>
                            <Link
                              to={`/${p.slug}`}
                              className="navbar-menu-item">
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>

                {/* Foundation */}
                <li className="navbar-main-menu relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link to="/foundation">THE FOUNDATION</Link>
                    {FoundationSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        className={`transition-transform ${
                          openSubmenus["foundation"] ? "rotate-180" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu("foundation");
                        }}
                      />
                    )}
                  </div>
                  {openSubmenus["foundation"] &&
                    FoundationSubPages.length > 0 && (
                      <ul className="navbar-menu-dropdown absolute top-full left-0 mt-2">
                        {FoundationSubPages.map((p) => (
                          <li key={p._id}>
                            <Link
                              to={`/${p.slug}`}
                              className="navbar-menu-item">
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>

                {/* Blogs */}
                <li className="navbar-main-menu relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link to="/blogs">BLOGS</Link>
                    <ExpandMoreIcon
                      fontSize="small"
                      className={`transition-transform ${
                        openSubmenus["blogs"] ? "rotate-180" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubmenu("blogs");
                      }}
                    />
                  </div>
                  {openSubmenus["blogs"] && (
                    <ul className="navbar-menu-dropdown absolute top-full left-0 mt-2">
                      <li>
                        <Link to="/blogs" className="navbar-menu-item">
                          Blogs
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/inspiration-board"
                          className="navbar-menu-item">
                          Inspiration Board
                        </Link>
                      </li>
                      <li>
                        <Link to="/sufi-corner" className="navbar-menu-item">
                          Sufi Corner
                        </Link>
                      </li>
                      {blogPages.map((page) => (
                        <li key={page._id}>
                          <Link
                            to={`/${page.slug}`}
                            className="navbar-menu-item">
                            {page.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Letters */}
                <li className="navbar-main-menu relative">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link to="/letters">LETTERS FROM LANGSHOTT</Link>
                    {letterSubPages.length > 0 && (
                      <ExpandMoreIcon
                        fontSize="small"
                        className={`transition-transform ${
                          openSubmenus["letters"] ? "rotate-180" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu("letters");
                        }}
                      />
                    )}
                  </div>
                  {openSubmenus["letters"] && letterSubPages.length > 0 && (
                    <ul className="navbar-menu-dropdown absolute top-full left-0 mt-2">
                      {letterSubPages.map((p) => (
                        <li key={p._id}>
                          <Link to={`/${p.slug}`} className="navbar-menu-item">
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                {/* NEW HEADING PAGES */}
                {mainMenuPages.map((p) => (
                  <li key={p._id} className="navbar-main-menu relative">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/${p.slug}`}
                        className="navbar-main-menu uppercase" // ensures uppercase
                      >
                        {p.title.toUpperCase()}{" "}
                        {/* Also makes it uppercase in JSX */}
                      </Link>
                      {/* If you ever have subpages for this heading */}
                      {subPagesMap[p._id]?.length > 0 && (
                        <ExpandMoreIcon
                          fontSize="small"
                          className={`transition-transform ${
                            openSubmenus[p._id] ? "rotate-180" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubmenu(p._id);
                          }}
                        />
                      )}
                    </div>

                    {/* Dropdown for subpages (if any) */}
                    {openSubmenus[p._id] && subPagesMap[p._id]?.length > 0 && (
                      <ul className="navbar-menu-dropdown absolute top-full left-0 mt-2">
                        {subPagesMap[p._id].map((sub) => (
                          <li key={sub._id}>
                            <Link
                              to={`/${sub.slug}`}
                              className="navbar-menu-item">
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
