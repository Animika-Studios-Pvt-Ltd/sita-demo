const Event = require("./event.model");
const { uploadToCloudinary } = require("../config/cloudinary");

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

/**
 * CREATE or UPDATE event (Admin)
 */
const upsertEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, title, date, fees, capacity, ageGroup, description } = req.body;

    const updateData = {
      code,
      title,
      date,
      fees,
      capacity,
      ageGroup,
      description,
    };

    if (req.files?.image) {
      const result = await uploadToCloudinary(
        req.files.image[0].buffer,
        "events"
      );
      updateData.imageUrl = result.secure_url;
    }

    let event;
    if (id) {
      event = await Event.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      event = await Event.create(updateData);
    }

    res.status(200).json({ message: "Event saved", event });
  } catch (err) {
    console.error("❌ Save event error:", err);
    res.status(500).json({ message: "Save failed", error: err.message });
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
