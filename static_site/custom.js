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
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("workshopTableBody");
  if (!tbody) return;

  const BOOKING_BASE_URL = "http://booking.localhost:5173";

  fetch("http://localhost:5000/api/events")
    .then((res) => res.json())
    .then((events) => {
      const tbody = document.getElementById("workshopTableBody");
      tbody.innerHTML = "";

      if (!events.length) {
        tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center">No workshops available</td>
        </tr>`;
        return;
      }

      events.forEach((e) => {
        tbody.innerHTML += `
        <tr>
          <td>${e.code}</td>
          <td>${e.title}</td>
          <td>${e.date}</td>
          <td>${e.location || "-"}</td>
          <td>${e.mode || "-"}</td>
          <td>${e.fees || "-"}</td>
          <td>${e.capacity || "-"}</td>
          <td>${e.availability ?? "-"}</td>
          <td>${e.ageGroup || "-"}</td>
         <td>
  ${
    Number(e.availability) === 0
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

let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});
