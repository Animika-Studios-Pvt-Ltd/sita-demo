const Event = require("./event.model");
const { uploadToCloudinary } = require("../config/cloudinary");
const BlockedDate = require("../blockedDates/blockedDate.model");


const generateEventCode = async (title, date) => {
  const d = new Date(date);

  // Month (01–12)
  const month = String(d.getMonth() + 1).padStart(2, "0");

  // Year (last 2 digits)
  const year = String(d.getFullYear()).slice(-2);

  // Prefix from title (New Yoga → NY)
  const prefix = title
    .trim()
    .split(" ")
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");

  while (true) {
    const random = Math.floor(10 + Math.random() * 90); // 2 digits
    const code = `${prefix}${month}${year}${random}`;

    const exists = await Event.findOne({ code });
    if (!exists) return code;
  }
};

/**
 * GET all events (Public)
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("❌ Get events error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};


/**
 * CREATE or UPDATE event (Admin)
 */
const upsertEvent = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      date,
      startTime,
      endTime,
      location,
      mode,
      fees,
      capacity,
      ageGroup,
      description,
      bookingUrl,
    } = req.body;

    capacity = Number(capacity);
    if (isNaN(capacity) || capacity < 0) capacity = 0;

    /* ================= CREATE EVENT ================= */
    if (!id) {
      const code = await generateEventCode(title, date);

      const event = await Event.create({
        code,
        title,
        date,
        startTime,
        endTime,
        location,
        mode,
        fees,
        capacity,
        availability: capacity, // ✅ auto-set
        ageGroup,
        description,
        bookingUrl: bookingUrl || null,
      });

      return res.json({
        message: "Event created",
        event,
      });
    }

    /* ================= UPDATE EVENT ================= */
    // 👇👇👇 THIS IS WHERE YOUR CODE BELONGS 👇👇👇

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookedCount =
      existingEvent.capacity - existingEvent.availability;

    // ❌ Prevent shrinking below existing bookings
    if (capacity < bookedCount) {
      return res.status(409).json({
        message: `Cannot reduce capacity below ${bookedCount} bookings`,
      });
    }

    const newAvailability = capacity - bookedCount;

    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        date,
        startTime,
        endTime,
        location,
        mode,
        fees,
        capacity,
        availability: newAvailability, // ✅ recalculated
        ageGroup,
        description,
        bookingUrl: bookingUrl || null,
      },
      { new: true }
    );

    res.json({
      message: "Event updated",
      event,
    });
  } catch (err) {
    console.error("❌ Event save error:", err);
    res.status(500).json({ message: err.message });
  }
};



/**
 * DELETE event
 */
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = {
  getEvents,
  upsertEvent,
  deleteEvent,
};
