const Corner = require('./corner.model');
const { uploadToCloudinary } = require('../../config/cloudinary');

async function handleImageUpload(file, folder = "corners") {
  if (!file || !file.buffer) return null;
  try {
    const result = await uploadToCloudinary(file.buffer, folder);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

const getCorners = async (req, res) => {
  try {
    const corners = await Corner.find().sort({ id: 1 });
    return res.status(200).json(corners);
  } catch (err) {
    console.error("Error in getCorners:", err);
    return res.status(500).json({ error: "Failed to fetch corners" });
  }
};

const upsertCorners = async (req, res) => {
  try {
    if (!req.body.corners) {
      return res.status(400).json({ error: "Corners data is required" });
    }

    const cornersData = JSON.parse(req.body.corners);

    if (!Array.isArray(cornersData)) {
      return res.status(400).json({ error: "Invalid corners data format" });
    }
    const files = req.files || [];
    const fileMap = {};
    files.forEach((file) => {
      fileMap[file.fieldname] = file;
    });
    for (let c = 0; c < cornersData.length; c++) {
      const corner = cornersData[c];
      for (let s = 0; s < corner.slides.length; s++) {
        const slide = corner.slides[s];
        const fileKey = `corner_${corner.id}_slide_${s}_image`;

        if (fileMap[fileKey]) {
          try {
            const url = await handleImageUpload(fileMap[fileKey], "corners");
            slide.image = url;
          } catch (uploadErr) {
            console.error(`Failed to upload image for ${fileKey}:`, uploadErr);
            return res.status(500).json({ 
              error: `Image upload failed for slide ${s + 1}`,
              message: uploadErr.message 
            });
          }
        }
        delete slide.imageFile;
      }
    }
    const upserts = await Promise.all(
      cornersData.map((corner) =>
        Corner.findOneAndUpdate(
          { id: corner.id },
          corner,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    return res.status(200).json(upserts);
  } catch (err) {
    console.error("Error in upsertCorners:", err);
    return res.status(500).json({ 
      error: "Failed to save corners",
      message: err.message 
    });
  }
};

module.exports = {
  getCorners,
  upsertCorners,
};
