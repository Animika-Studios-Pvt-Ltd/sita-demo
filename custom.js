/* -------------------------------- HEADER SECTION -------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document
    .querySelectorAll(".sita-nav .nav-link, .dropdown-item")
    .forEach((link) => {
      const linkPath = link.getAttribute("href");
      if (linkPath === currentPath) {
        link.classList.add("active");

        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          parentDropdown.querySelector(".nav-link")?.classList.add("active");
        }
      }
    });
});

/* -------------------------------- HAMBURGER SECTION -------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector("#sita-mainNav");
  if (!toggler || !menu) return;

  menu.addEventListener("shown.bs.collapse", () =>
    toggler.setAttribute("aria-expanded", "true"),
  );

  menu.addEventListener("hidden.bs.collapse", () =>
    toggler.setAttribute("aria-expanded", "false"),
  );
});

/* -------------------------------- TESTIMONIALS SECTION -------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("testimonialCarousel");
  const nameEl = document.querySelector(".sita-testimonial-name");
  const quoteImg = document.querySelector(".sita-testimonial-quote");

  if (!carousel || !nameEl || !quoteImg) return;

  const updateMeta = () => {
    const active = carousel.querySelector(".carousel-item.active");
    if (!active) return;

    nameEl.textContent = active.dataset.name || "";
    quoteImg.src = active.dataset.quote || "";
  };

  setTimeout(updateMeta, 100);
  carousel.addEventListener("slid.bs.carousel", updateMeta);
});

/* -------------------------------- WORKSHOP / EVENTS SECTION -------------------------------- */

const getCategoryFromURL = () => {
  const path = window.location.pathname.toLowerCase();

  if (path.includes("yoga")) return "Yoga Therapy";
  if (path.includes("ayurveda")) return "Ayurveda – Nutrition & Integration";
  if (path.includes("kosha")) return "Kosha Counseling";
  if (path.includes("soul")) return "Soul Curriculum";
  if (path.includes("karmic")) return "Release Karmic Patterns";

  return null; // fallback → show all
};

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("workshopTableBody");
  if (!tbody) return;

  const BOOKING_BASE_URL = "https://booking.sitashakti.com";

  const toMinutes = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const isUpcomingEvent = (e) => {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);

    // ✅ Future date
    if (eventDate > today) return true;

    // ❌ Past date
    if (eventDate < today) return false;

    // 🕒 Today → compare end time
    const endMinutes = toMinutes(e.endTime);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return endMinutes > nowMinutes;
  };

  fetch("https://sita-demo-production.up.railway.app/api/events")
    .then((res) => res.json())
    .then((events) => {
      tbody.innerHTML = "";

      // ✅ FILTER OUT PAST EVENTS
      const pageCategory = getCategoryFromURL();

      const upcomingEvents = events.filter((event) => {
        const upcoming = isUpcomingEvent(event);

        if (!pageCategory) return upcoming;

        return upcoming && event.category === pageCategory;
      });

      if (!upcomingEvents.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="text-center">
              No upcoming workshops available
            </td>
          </tr>`;
        return;
      }

      upcomingEvents.forEach((e) => {
        tbody.innerHTML += `
          <tr>
            <td>${e.code || "-"}</td>
            <td>${e.title}</td>
            <td>${e.date}</td>
            <td>${e.location || "-"}</td>
            <td>${e.mode || "-"}</td>
            <td>${e.fees || "-"}</td>
            <td>${e.capacity || "-"}</td>
            <td>${e.availability ?? "-"}</td>
            <td>${e.ageGroup || "-"}</td>
            <td>
              ${Number(e.availability) === 0
            ? `<span class="sita-booking-closed">Booking Closed</span>`
            : e.bookingUrl
              ? `<a href="${BOOKING_BASE_URL}/${e.bookingUrl}"
                         class="sita-book-now"
                         target="_blank">Book Now</a>`
              : `<button disabled class="sita-book-now disabled">
                         Coming Soon
                       </button>`
          }
            </td>
          </tr>
        `;
      });
    })
    .catch((err) => {
      console.error("Failed to load workshops:", err);
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center">Failed to load workshops</td>
        </tr>`;
    });
});

/* -------------------------------- SITA FACTOR SECTION -------------------------------- */
const decorEls = document.querySelectorAll(".sita-decor");

let current = [];
let target = [];
let time = 0;

decorEls.forEach((_, i) => {
  current[i] = 0;
  target[i] = 0;
});

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function updateTargets() {
  const viewportCenter = window.innerHeight / 2;

  decorEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const elCenter = rect.top + rect.height / 2;
    const distance = elCenter - viewportCenter;

    const strength = i === 0 ? 0.1 : 0.2;
    target[i] = -distance * strength;
  });
}

function animate() {
  time += 0.03;

  decorEls.forEach((el, i) => {
    // Smooth follow
    current[i] = lerp(current[i], target[i], 0.08);

    // Gentle breathing float
    const float = Math.sin(time + i) * 20;

    el.style.transform = `translateY(${current[i] + float}px)`;
  });

  requestAnimationFrame(animate);
}

window.addEventListener("scroll", updateTargets, { passive: true });
window.addEventListener("resize", updateTargets);

updateTargets();
animate();

/* -------------------------------- Footer Publications Section -------------------------------- */
const slides = document.querySelectorAll(".publication-slide");
const prevBtn = document.querySelector(".pub-prev");
const nextBtn = document.querySelector(".pub-next");
const carousel = document.querySelector(".publication-carousel");

let currentIndex = 0;
let autoSlideInterval;

/* Show slide */
function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

/* Next slide */
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

/* Previous slide */
function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

/* Start auto scroll */
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000); // 4 sec
}

/* Stop auto scroll */
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

/* Arrow clicks (optional) */
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });
}

/* 👉 Pause on hover */
if (carousel) {
  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);
}

/* Init */
startAutoSlide();