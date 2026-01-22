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
      code,
      title,
      date,
      startTime,
      endTime,
      fees,
      capacity,
      ageGroup,
      description,
    } = req.body;

    // ✅ Auto-generate code on CREATE
    if (!id) {
      code = await generateEventCode(title, date);
    }

    // ⛔ Check BLOCKED slots
    const blockedSlots = await BlockedDate.find({ date });
    for (const slot of blockedSlots) {
      if (isTimeOverlap(startTime, endTime, slot.startTime, slot.endTime)) {
        return res.status(403).json({
          message: `Blocked: ${slot.reason}`,
        });
      }
    }

    // ⛔ Check EVENT overlaps
    const events = await Event.find({
      date,
      ...(id && { _id: { $ne: id } }),
    });

    for (const ev of events) {
      if (isTimeOverlap(startTime, endTime, ev.startTime, ev.endTime)) {
        return res.status(409).json({
          message: "Time slot already booked",
        });
      }
    }

    const payload = {
      code,
      title,
      date,
      startTime,
      endTime,
      fees,
      capacity,
      ageGroup,
      description,
    };

    const event = id
      ? await Event.findByIdAndUpdate(id, payload, { new: true })
      : await Event.create(payload);

    res.json({ message: "Saved successfully", event });
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
