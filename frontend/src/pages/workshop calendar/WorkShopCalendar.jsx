import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const WorkShopCalendar = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

  /* Workshop Calendar */
  useEffect(() => {
    const tbody = document.getElementById("workshopTableBody");
    if (!tbody) return;

    const BOOKING_BASE_URL = "https://sitashakti.com";

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

      if (eventDate > today) return true;
      if (eventDate < today) return false;

      const endMinutes = toMinutes(e.endTime);
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      return endMinutes > nowMinutes;
    };

    fetch("https://sita-demo-production.up.railway.app/api/events")
      .then((res) => res.json())
      .then((events) => {
        tbody.innerHTML = "";

        const upcomingEvents = events.filter(isUpcomingEvent);

        if (!upcomingEvents.length) {
          tbody.innerHTML = `
            <tr>
              <td colspan="10" class="text-center">
                No upcoming workshops available
              </td>
            </tr>
          `;
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
                ${
                  Number(e.availability) === 0
                    ? `<span class="sita-booking-closed">Booking Closed</span>`
                    : e.bookingUrl
                      ? `<a href="${BOOKING_BASE_URL}/${e.bookingUrl}" 
                         class="sita-book-now" 
                         target="_blank">
                         Book Now
                       </a>`
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
            <td colspan="10" class="text-center">
              Failed to load workshops
            </td>
          </tr>
        `;
      });
  }, []);

  return (
    <>
      {/* ---------------- WORKSHOP CALENDAR SECTION ---------------- */}
      <section className="sita-workshop-calendar">
        <div className="container">
          <h2 className="text-center" data-aos="fade-up">
            WORKSHOP CALENDAR
          </h2>

          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

          <div
            className="table-responsive"
            data-aos="fade-up"
            data-aos-delay="150">
            <table className="table sita-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Workshop Title</th>
                  <th>Workshop Date</th>
                  <th>Workshop Location</th>
                  <th>Workshop Mode</th>
                  <th>Fees</th>
                  <th>Capacity</th>
                  <th>Availability</th>
                  <th>Age Group</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="workshopTableBody"></tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkShopCalendar;
