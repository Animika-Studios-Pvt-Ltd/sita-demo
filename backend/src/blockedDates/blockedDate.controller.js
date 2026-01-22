const BlockedDate = require("./blockedDate.model");

const isTimeOverlap = (start1, end1, start2, end2) =>
  start1 < end2 && start2 < end1;

/**
 * GET all blocked slots
 */
const getBlockedDates = async (req, res) => {
  const blocks = await BlockedDate.find().sort({ date: 1 });
  res.json(blocks);
};

/**
 * CREATE blocked slot
 */
const createBlockedDate = async (req, res) => {
  const { date, startTime, endTime, reason } = req.body;

  const existing = await BlockedDate.find({ date });
  for (const b of existing) {
    if (isTimeOverlap(startTime, endTime, b.startTime, b.endTime)) {
      return res.status(409).json({
        message: "This time slot is already blocked",
      });
    }
  }

  const block = await BlockedDate.create({
    date,
    startTime,
    endTime,
    reason,
  });

  res.json(block);
};

/**
 * DELETE blocked slot
 */
const deleteBlockedDate = async (req, res) => {
  await BlockedDate.findByIdAndDelete(req.params.id);
  res.json({ message: "Blocked slot removed" });
};

/**
 * UPDATE blocked slot
 */
const updateBlockedDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, reason } = req.body;

    const existing = await BlockedDate.find({
      date,
      _id: { $ne: id },
    });

    for (const b of existing) {
      if (isTimeOverlap(startTime, endTime, b.startTime, b.endTime)) {
        return res.status(409).json({
          message: "This time slot overlaps with another blocked slot",
        });
      }
    }

    const updated = await BlockedDate.findByIdAndUpdate(
      id,
      { date, startTime, endTime, reason },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


module.exports = {
  getBlockedDates,
  createBlockedDate,
  updateBlockedDate,
  deleteBlockedDate,
};

