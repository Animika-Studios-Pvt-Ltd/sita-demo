import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import getBaseUrl from "../../utils/baseURL";
import AOS from "aos";
import "aos/dist/aos.css";

const MyBookings = () => {
  const { currentUser, isAuthenticated, loginWithRedirect } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!currentUser?.email) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(`${getBaseUrl()}/api/bookings`);
        const allBookings = res.data || [];
        const email = currentUser.email.toLowerCase();

        const mine = allBookings.filter((b) => {
          const primary = (b.userEmail || "").toLowerCase() === email;
          const participant =
            Array.isArray(b.participants) &&
            b.participants.some((p) => (p.email || "").toLowerCase() === email);
          return primary || participant;
        });

        setBookings(mine);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser?.email]);

  if (!isAuthenticated) {
    return (
      <div className="container" data-aos="fade-up">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-2 py-12 font-Figtree">
          <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
            My Bookings
          </h2>
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mb-8 motif"
          />
          <p className="text-gray-600 text-center mb-6">
            Please sign in to view your bookings.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="px-6 py-2 rounded-full bg-[#8b171b] text-white font-semibold hover:bg-[#a62024] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" data-aos="fade-up">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-2 py-12 font-Figtree">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-[#8b171b]/30 border-t-[#8b171b]"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" data-aos="fade-up">
      <div className="max-w-8xl mx-auto flex flex-col items-center px-2 font-Figtree">
        <div className="mt-10" data-aos="zoom-in" data-aos-duration="1000">
          <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
            My Bookings
          </h2>
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mt-1 w-40 sm:w-48 mb-8"
          />
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#C76F3B] p-4 w-full text-center">
            <p className="text-gray-600">No bookings found yet.</p>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div key={booking._id} className="w-full">
              <div
                className="bg-white rounded-xl border-1 border-[#C76F3B] transition-all duration-300 p-2.5 w-full flex flex-col gap-2.5 mb-3 font-Figtree"
                data-aos="fade-up"
                data-aos-delay={`${index * 120}`}
              >
                <div className="flex flex-col lg:flex-row gap-3 p-1">
                  <div className="flex-1 lg:w-1/2 lg:border-r lg:border-[#C76F3B]/20 p-4">
                    <p className="bg-[#C76F3B] text-white text-sm sm:text-base w-fit px-3 py-1 rounded-full font-semibold shadow-sm">
                      Booking #{bookings.length - index}
                    </p>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-3 text-gray-800 break-all w-full">
                      <span className="text-[#C76F3B] font-semibold">
                        {booking.event?.title || "Workshop Session"}
                      </span>
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                      {booking.event?.date
                        ? new Date(booking.event.date).toLocaleDateString()
                        : "Date not available"}
                    </p>

                    {booking.status && (
                      <p
                        className={`flex items-center gap-2 text-sm sm:text-base font-semibold mt-2 ${booking.status === "CONFIRMED"
                          ? "text-green-600"
                          : booking.status === "CANCELLED"
                            ? "text-red-600"
                            : "text-[#C76F3B]"
                          }`}
                      >
                        <AssignmentTurnedInOutlinedIcon fontSize="small" />
                        Status: {booking.status}
                      </p>
                    )}

                    <p className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 mt-0">
                      <PaymentOutlinedIcon fontSize="small" className="text-slate-500" />
                      Amount : {booking.totalAmount > 0 ? `$${booking.totalAmount}` : "Free"}
                    </p>
                  </div>

                  <div className="w-full lg:w-1/2 flex flex-col gap-2 items-start">
                    <div className="flex-1 flex flex-col gap-1.5 bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 w-full">
                      <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                        Booking Details:
                      </h4>

                      <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                        <PersonOutlineOutlinedIcon
                          fontSize="small"
                          className="text-gray-500"
                        />{" "}
                        {booking.userName}
                      </p>

                      <p className="flex flex-wrap items-start gap-2 text-sm sm:text-base text-gray-700 w-full">
                        <EmailOutlinedIcon
                          fontSize="small"
                          className="text-gray-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="break-all w-full sm:w-auto">
                          {booking.userEmail}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                        <PhoneOutlinedIcon
                          fontSize="small"
                          className="text-gray-500"
                        />{" "}
                        {booking.userPhone || "-"}
                      </p>

                      <p
                        className="flex items-center gap-2 text-sm sm:text-base text-gray-700"
                        data-aos="fade-left"
                        data-aos-delay="350">
                        Booked on : {new Date(booking.bookedAt).toLocaleDateString()}
                      </p>

                      <div className="flex items-center justify-between gap-2 text-[13px] text-gray-700">
                        <div className="flex items-center gap-2">
                          <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                            <EventSeatIcon fontSize="small" className="text-gray-700" />
                            Seats: {booking.seats}
                          </p>
                        </div>
                        <button
                          onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                          className="inline-flex items-center justify-center gap-1 text-[#8b171b] px-2 py-0.5 rounded-full border border-[#C76F3B] bg-white hover:bg-[#C76F3B]/10 transition-colors font-semibold text-[13px]"
                          aria-expanded={expandedId === booking._id}
                          aria-label="Toggle booking details"
                        >
                          Details
                          <KeyboardArrowDownIcon
                            fontSize="small"
                            className={`${expandedId === booking._id ? "rotate-180" : ""} transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedId === booking._id && (
                  <div className="mt-2.5 border-t border-[#C76F3B]/20 pt-2.5 w-full">
                    <div className="bg-[#C76F3B]/5 border border-[#C76F3B]/20 rounded-xl p-3 w-full animate-[fadeIn_0.25s_ease-out]">
                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#C76F3B]/10 text-[#8b171b] font-semibold">
                          Total Seats: {booking.seats}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#C76F3B]/10 text-[#8b171b] font-semibold">
                          Participants: {booking.participants?.length || 0}
                        </span>
                      </div>

                      {Array.isArray(booking.participants) && booking.participants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {booking.participants.map((p, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-[#C76F3B]/20 bg-white p-2"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-[13px] font-semibold text-gray-800">
                                  {p.name || "Participant"}
                                </p>
                                <span className="text-[11px] text-gray-500 font-semibold">
                                  #{idx + 1}
                                </span>
                              </div>
                              {p.email && (
                                <p className="text-[11px] text-gray-600 break-all">Email: {p.email}</p>
                              )}
                              {p.phone && (
                                <p className="text-[11px] text-gray-600">Phone: {p.phone}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-500">No participant details provided.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
