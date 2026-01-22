/* HEADER SECTION */
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const navLinks = document.querySelectorAll(
    ".sita-nav .nav-link, .dropdown-item",
  );

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath === currentPath) {
      link.classList.add("active");

      const parentDropdown = link.closest(".dropdown");
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector(".nav-link");
        parentToggle.classList.add("active");
      }
    }

    if (linkPath === "index.html" && currentPath === "") {
      link.classList.add("active");
    }
  });
});

/* HAMBURGER SECTION */
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector("#sita-mainNav");

  menu.addEventListener("shown.bs.collapse", function () {
    toggler.setAttribute("aria-expanded", "true");
  });

  menu.addEventListener("hidden.bs.collapse", function () {
    toggler.setAttribute("aria-expanded", "false");
  });
});

/* TESTIMONIALS SECTION */
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("testimonialCarousel");
  const nameElement = document.querySelector(".sita-testimonial-name");
  const quoteImage = document.querySelector(".sita-testimonial-quote");

  if (!carousel || !nameElement || !quoteImage) return;

  function updateTestimonialMeta() {
    const activeItem = carousel.querySelector(".carousel-item.active");
    if (activeItem) {
      const name = activeItem.getAttribute("data-name");
      const quoteSrc = activeItem.getAttribute("data-quote");

      if (name) nameElement.textContent = name;
      if (quoteSrc) quoteImage.src = quoteSrc;
    }
  }

  setTimeout(updateTestimonialMeta, 100);

  carousel.addEventListener("slid.bs.carousel", updateTestimonialMeta);
});

/* WORKSHOP CALENDAR SECTION */
const workshops = [
  {
    code: "YT0126",
    title: "Yoga Therapy",
    start: "2026-01-05",
    end: "2026-01-07",
    location: "San Diego",
    mode: "In Person",
    fees: 250,
    capacity: 70,
    booked: 70,
    ageMin: 14,
    ageMax: 70,
  },
  {
    code: "AY0226",
    title: "Ayurveda – Nutrition and Integration",
    start: "2026-02-07",
    end: "2026-02-08",
    location: "San Diego",
    mode: "Online",
    fees: 500,
    capacity: 100,
    booked: 100,
    ageMin: 18,
    ageMax: 80,
  },
  {
    code: "KCO326",
    title: "Kosha Counseling",
    start: "2026-03-01",
    end: "2026-03-02",
    location: "San Diego",
    mode: "In Person",
    fees: 300,
    capacity: 50,
    booked: 50,
    ageMin: 18,
    ageMax: 70,
  },
  {
    code: "AR0726",
    title: "Astrology Reading",
    start: "2026-07-07",
    end: "2026-07-08",
    location: "San Diego",
    mode: "Online",
    fees: 250,
    capacity: 70,
    booked: 58,
    ageMin: 17,
    ageMax: 70,
  },
  {
    code: "SCO226",
    title: "Soul Curriculum",
    start: "2026-02-08",
    end: "2026-02-09",
    location: "San Diego",
    mode: "In Person",
    fees: 400,
    capacity: 150,
    booked: 100,
    ageMin: 17,
    ageMax: 70,
  },
  {
    code: "KPO226",
    title: "Release Karmic Patterns",
    start: "2026-02-07",
    end: "2026-02-08",
    location: "San Diego",
    mode: "Online",
    fees: 250,
    capacity: 70,
    booked: 34,
    ageMin: 17,
    ageMax: 80,
  },
  {
    code: "PMEO226",
    title: "Release physical, mental & emotional disease",
    start: "2026-02-07",
    end: "2026-02-08",
    location: "San Diego",
    mode: "In Person",
    fees: 300,
    capacity: 80,
    booked: 67,
    ageMin: 18,
    ageMax: 80,
  },
];

const tbody = document.getElementById("workshopTableBody");
const modal = new bootstrap.Modal(document.getElementById("bookingModal"));
let selectedWorkshop = null;

function formatDateRange(start, end) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const s = new Date(start).toLocaleDateString("en-GB", options);
  const e = new Date(end).toLocaleDateString("en-GB", options);
  return `${s} – ${e}`;
}

function isDatePassed(endDate) {
  return new Date(endDate) < new Date();
}

function renderTable() {
  tbody.innerHTML = "";

  workshops.forEach((w, index) => {
    const availability = w.capacity - w.booked;
    const closed = availability <= 0 || isDatePassed(w.end);

    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td>${w.code}</td>
  <td>${w.title}</td>
  <td>${formatDateRange(w.start, w.end)}</td>
  <td>${w.location}</td>
  <td>${w.mode}</td>
  <td>$${w.fees}</td>
  <td>${w.capacity}</td>
  <td>${availability}</td>
  <td>${w.ageMin}–${w.ageMax}</td>
  <td>
    ${
      closed
        ? `<span class="sita-booking-closed">Booking Closed</span>`
        : `<a href="#" class="sita-book-now" data-index="${index}">Book Now</a>`
    }
  </td>
`;

    tbody.appendChild(tr);
  });

  attachBookNowEvents();
}

function attachBookNowEvents() {
  document.querySelectorAll(".sita-book-now").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = btn.dataset.index;
      selectedWorkshop = workshops[index];
      document.getElementById("payButton").innerText =
        `Pay $${selectedWorkshop.fees}`;
      modal.show();
    });
  });
}

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const age = parseInt(document.getElementById("userAge").value);
  const error = document.getElementById("ageError");

  if (age < selectedWorkshop.ageMin || age > selectedWorkshop.ageMax) {
    error.classList.remove("d-none");
    return;
  }

  error.classList.add("d-none");

  selectedWorkshop.booked += 1;
  modal.hide();
  renderTable();
});

document
  .getElementById("bookingModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("bookingForm").reset();
    document.getElementById("ageError").classList.add("d-none");
  });

renderTable();

/* SITA FACTOR SECTION */
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
