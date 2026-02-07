const Event = require("./event.model");
const { uploadToCloudinary } = require("../config/cloudinary");
const Page = require("../pages/pages.model");
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

    // Dynamic Image Lookup from Pages (Fallback)
    // This ensures that even if 'sync' hasn't happened in DB, we still serve the correct image
    try {
      const pages = await Page.find({ status: 'published' }).select('slug sections bannerImage');
      const pageImageMap = {};

      pages.forEach(p => {
        if (!p.slug) return;

        let img = null;
        // 1. Hero
        const hero = p.sections?.find(s => s.key === 'hero');
        img = hero?.content?.backgroundImage;

        // 2. Banner
        if (!img && p.bannerImage) {
          img = typeof p.bannerImage === 'string' ? p.bannerImage : p.bannerImage.src;
        }

        if (img) {
          // Store both raw and normalized variations for easy lookup
          const cleanSlug = p.slug.replace(/^\//, ''); // "yoga"
          pageImageMap[cleanSlug] = img;
          pageImageMap[`/${cleanSlug}`] = img;
          pageImageMap[p.slug] = img;
        }
      });

      // Merge images
      const eventsWithImages = events.map(e => {
        const eventObj = e.toObject();
        if (!eventObj.imageUrl && eventObj.bookingUrl) {
          const mappedImg = pageImageMap[eventObj.bookingUrl] || pageImageMap[eventObj.bookingUrl.replace(/^\//, '')];
          if (mappedImg) {
            eventObj.imageUrl = mappedImg;
          }
        }
        return eventObj;
      });

      return res.json(eventsWithImages);

    } catch (pageErr) {
      console.error("⚠️ Page lookup warning:", pageErr.message);
      // Fallback to basic events if page lookup fails
      return res.json(events);
    }
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
      category,
      date,
      startTime,
      endTime,
      location,
      mode,
      fees,   // User input string (e.g. "500")
      price,  // User input number (e.g. 500)
      capacity,
      ageGroup,
      description,
      bookingUrl,
      // imageUrl might come from body if not file upload (rare for creation, possible for keeping existing)
    } = req.body;

    let imageUrl = req.body.imageUrl;

    // Handle Image Upload - similar to pages.controller.js pattern
    if (req.files && req.files["image"] && req.files["image"][0]) {
      const file = req.files["image"][0];
      const uploaded = await uploadToCloudinary(file.buffer);
      imageUrl = uploaded.secure_url;
    }

    // Unified Price/Fees Logic:
    // If 'price' is provided, use it. If 'fees' is provided, try to parse it as price.
    // 'fees' will be stored as the string representation of the price.

    let finalPrice = Number(price);
    if (isNaN(finalPrice)) {
      finalPrice = Number(fees) || 0;
    }

    // Ensure fees matches price for display consistency
    fees = finalPrice.toString();

    capacity = Number(capacity);
    if (isNaN(capacity) || capacity < 0) capacity = 0;

    // ✅ 3. URL HANDLING & PAGE CLAIMING
    if (bookingUrl) {
      // Check for DUPLICATE EVENT (not page)
      const existingQuery = {
        bookingUrl: { $regex: new RegExp(`^${bookingUrl}$`, "i") }
      };
      if (id) existingQuery._id = { $ne: id };

      const duplicateEvent = await Event.findOne(existingQuery);
      if (duplicateEvent) {
        return res.status(409).json({ message: "Booking URL is already used by another Event" });
      }
    }

    /* ================= CREATE EVENT ================= */
    if (!id) {
      const code = await generateEventCode(title, date);

      const event = await Event.create({
        code,
        title,
        category,
        date,
        startTime,
        endTime,
        location,
        mode,
        fees,
        price: finalPrice,
        capacity,
        availability: capacity,
        ageGroup,
        description,
        bookingUrl: bookingUrl || null,
        imageUrl,
      });

      // ✅ AUTO-CREATE / CLAIM PAGE Logic
      if (bookingUrl) {
        try {
          // Find existing page (Case Insensitive)
          let page = await Page.findOne({
            slug: { $regex: new RegExp(`^${bookingUrl}$`, "i") }
          });

          const pageData = {
            title,
            slug: bookingUrl,
            content: `<h1>${title}</h1><p>${description || 'Event Details'}</p>`,
            status: 'published',
            metaTitle: title,
            metaDescription: description,
            eventId: event._id,
            createdFrom: 'manage-events', // 👈 KEY: Mark as Event Page
            updatedAt: new Date()
          };

          if (page) {
            // CLAIM EXISTING PAGE
            Object.assign(page, pageData);
            await page.save();
            console.log(`✅ Converted existing page to Event Page: ${bookingUrl}`);
          } else {
            // CREATE NEW PAGE
            await Page.create({
              ...pageData,
              sections: [],
              createdBy: req.user?.id || 'system'
            });
            console.log(`✅ Created new Event Page: ${bookingUrl}`);
          }

        } catch (pageErr) {
          console.error("⚠️ Failed to manage page:", pageErr.message);
        }
      }

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
        category,
        date,
        startTime,
        endTime,
        location,
        mode,
        fees,
        price: finalPrice,
        capacity,
        availability: newAvailability, // ✅ recalculated
        ageGroup,
        description,
        bookingUrl: bookingUrl || null,
        ...(imageUrl && { imageUrl }), // Only update if new image provided
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
