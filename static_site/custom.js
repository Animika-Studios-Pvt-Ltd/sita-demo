/* =========================
   HEADER SECTION
========================= */
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

/* =========================
   HAMBURGER SECTION
========================= */
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector("#sita-mainNav");
  if (!toggler || !menu) return;

  menu.addEventListener("shown.bs.collapse", () =>
    toggler.setAttribute("aria-expanded", "true")
  );

  menu.addEventListener("hidden.bs.collapse", () =>
    toggler.setAttribute("aria-expanded", "false")
  );
});

/* =========================
   TESTIMONIALS SECTION
========================= */
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

/* =========================
   WORKSHOP / EVENTS SECTION
   (ONLY PLACE FOR EVENTS)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("workshopTableBody");
  if (!tbody) return;

  fetch("http://localhost:5000/api/events")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    })
    .then((events) => {
      tbody.innerHTML = "";

      if (!events.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center">
              No workshops available
            </td>
          </tr>
        `;
        return;
      }

      events.forEach((e) => {
        tbody.innerHTML += `
          <tr>
            <td>${e.code}</td>
            <td>${e.title}</td>
            <td>${e.date}</td>
            <td>${e.fees || "-"}</td>
            <td>${e.capacity || "-"}</td>

            <!-- Availability (future logic) -->
            <td>-</td>

            <td>${e.ageGroup || "-"}</td>
            <td>
              <button class="sita-book-now" data-id="${e._id}">
                Book Now
              </button>
            </td>
          </tr>
        `;
      });
    })
    .catch((err) => {
      console.error("❌ Event fetch error:", err);
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-danger">
            Failed to load events
          </td>
        </tr>
      `;
    });
});
