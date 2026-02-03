document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "https://sita-demo-production.up.railway.app"; // Adjust if needed for production
  const STORE_URL = "http://store.sitashakti.com";
  const BLOG_URL = "http://blog.sitashakti.com";

  const publicationSlidesContainer = document.querySelector(
    ".publication-slides",
  );
  const footerBlogsContainer = document.querySelector(".footer-blogs");

  // State to manage carousel
  let booksData = [];
  let currentSlideIndex = 0;
  let carouselInterval;
  let isHovered = false;

  // --- Fetch Functions ---
  async function fetchBooks() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/books`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();

      // Filter: !suspended
      const activeBooks = data.filter((book) => !book.suspended);
      // Sort: createdAt desc
      activeBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Take top 5
      booksData = activeBooks.slice(0, 5);

      renderBooks();
      startCarousel();
    } catch (err) {
      console.error("Error fetching books:", err);
      if (publicationSlidesContainer) {
        publicationSlidesContainer.innerHTML = `<div class="publication-slide active"><p>No publications available</p></div>`;
      }
    }
  }

  async function fetchBlogs() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();

      // Filter: !suspended && type === 'blogs'
      const activeBlogs = data.filter(
        (blog) => !blog.suspended && blog.type === "blogs",
      );
      // Sort: createdAt desc
      activeBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Take top 2
      const recentBlogs = activeBlogs.slice(0, 2);

      renderBlogs(recentBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      if (footerBlogsContainer) {
        const titleHash = footerBlogsContainer.querySelector(".footer-title");
        footerBlogsContainer.innerHTML = "";
        if (titleHash) footerBlogsContainer.appendChild(titleHash);
        const p = document.createElement("p");
        p.textContent = "No recent blogs";
        footerBlogsContainer.appendChild(p);
      }
    }
  }

  // --- Render Functions ---
  function renderBooks() {
    if (!publicationSlidesContainer) return;

    if (booksData.length === 0) {
      publicationSlidesContainer.innerHTML = `<div class="publication-slide active"><p>No publications available</p></div>`;
      return;
    }

    publicationSlidesContainer.innerHTML = booksData
      .map((book, index) => {
        const activeClass = index === currentSlideIndex ? "active" : "";
        const linkPath = `/books/${book.slug || book._id}`;
        const destination = `${STORE_URL}${linkPath}`;
        const coverImage = book.coverImage || "images/anaya-book.webp";

        return `
        <div class="publication-slide ${activeClass}" data-index="${index}">
            <a href="${destination}">
                <img src="${coverImage}" alt="${book.title}">
            </a>
            <p>
                <strong>${book.title}</strong>
                <br>
                <span>${book.subtitle || "Book"}</span>
                <br>
                $${book.newPrice}
            </p>
        </div>
      `;
      })
      .join("");

    const carouselWrapper = document.querySelector(".publication-carousel");
    if (carouselWrapper) {
      carouselWrapper.addEventListener("mouseenter", () => {
        isHovered = true;
      });
      carouselWrapper.addEventListener("mouseleave", () => {
        isHovered = false;
      });
    }
  }

  function renderBlogs(blogs) {
    if (!footerBlogsContainer) return;

    const staticItems = footerBlogsContainer.querySelectorAll(".blog-item");
    staticItems.forEach((el) => el.remove());

    if (blogs.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No recent blogs";
      footerBlogsContainer.appendChild(p);
      return;
    }

    blogs.forEach((blog) => {
      const linkPath = `/blogs/${blog.slug || blog._id}`;
      const destination = `${BLOG_URL}${linkPath}`;

      let imgUrl = blog.image || "";
      if (imgUrl && !imgUrl.startsWith("http")) {
        imgUrl = `${API_BASE_URL}${imgUrl}`;
      }

      const dateObj = new Date(blog.createdAt);
      const dateStr = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const a = document.createElement("a");
      a.href = destination;
      a.className = "blog-item";
      a.style.textDecoration = "none";

      a.innerHTML = `
            <img src="${imgUrl}" alt="${blog.title}">
            <div class="blog-overlay">
                <span>${dateStr}</span>
                <p>${blog.title.substring(0, 15)}...</p>
            </div>
        `;

      footerBlogsContainer.appendChild(a);
    });
  }

  // --- Carousel Logic ---
  function startCarousel() {
    if (booksData.length <= 1) return;
    if (carouselInterval) clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
      if (!isHovered) {
        currentSlideIndex = (currentSlideIndex + 1) % booksData.length;
        updateCarouselUI();
      }
    }, 4000);
  }

  function updateCarouselUI() {
    const slides = document.querySelectorAll(".publication-slide");
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
  }

  // --- Initialization ---
  if (publicationSlidesContainer || footerBlogsContainer) {
    fetchBooks();
    fetchBlogs();
  }
});