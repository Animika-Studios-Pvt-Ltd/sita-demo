const cron = require("node-cron");
const Event = require("../events/event.model");
const Booking = require("../booking/booking.model");
const emailService = require("./emailService");

const setupCronJobs = () => {
    console.log("⏰ Cron jobs initialized");

    // Run every hour to check for ended events and send rating emails
    cron.schedule("0 * * * *", async () => {
        console.log("Create rating email check started...");
        try {
            // 1. Find events that have ended recently (e.g., in the last 24 hours) 
            //    and might have bookings that haven't received emails yet.
            //    Actually, we can just look for ALL past events, but that might be expensive.
            //    Let's look for events where endTime is in the past.

            const now = new Date();
            // Format now to compare with string dates stored in Event model?
            // Event model stores date as YYYY-MM-DD and endTime as HH:mm.

            // It's tricky to compare string dates/times in Mongo query directly efficiently if they are strings.
            // We might need to fetch candidate events or improve the query.
            // For now, let's fetch events from the last 2 days to be safe, filtering in code if needed.
            // Or relies on the fact that we flag bookings.

            // Let's find bookings directly?
            // No, we need to know if the event has ended.

            // Better approach:
            // Find all bookings where:
            // status = 'CONFIRMED'
            // ratingEmailSent = false
            // Populate event.
            // Filter by event.endTime < now.

            // Since we don't have massive scale yet, finding all pending confirmed bookings 
            // and checking their event time is acceptable.

            const pendingBookings = await Booking.find({
                status: "CONFIRMED",
                ratingEmailSent: false,
            }).populate("event");

            console.log(`Found ${pendingBookings.length} pending bookings for rating emails.`);

            for (const booking of pendingBookings) {
                if (!booking.event) continue;

                const event = booking.event;
                const [year, month, day] = event.date.split("-").map(Number);
                const [hours, minutes] = event.endTime.split(":").map(Number);

                const eventEndDateTime = new Date(year, month - 1, day, hours, minutes);

                // If event ended at least 1 hour ago
                const oneHourAfterEnd = new Date(eventEndDateTime.getTime() + 60 * 60 * 1000);

                if (now >= oneHourAfterEnd) {
                    // Send email
                    const emailSent = await emailService.sendEventRatingEmail(booking, event);

                    if (emailSent) {
                        booking.ratingEmailSent = true;
                        await booking.save();
                        console.log(`Rating email sent to ${booking.userEmail} for booking ${booking._id}`);
                    }
                }
            }

        } catch (error) {
            console.error("Error in rating email cron:", error);
        }
    });
};

module.exports = setupCronJobs;
