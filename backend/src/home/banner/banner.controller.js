const Banner = require("./banner.model");
const cloudinary = require("../../config/cloudinary");

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne(); // You can make it by ID if needed
    if (!banner) return res.status(404).json({ message: "No banner found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { title, description, quote, starsCount } = req.body;
    const updateData = { title, description, quote, starsCount };
    if (req.files?.logo) {
      try {
        const result = await uploadToCloudinary(req.files.logo[0].buffer, "banner");
        updateData.logoUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Logo upload failed:", uploadErr);
        return res.status(500).json({ message: "Logo upload failed", error: uploadErr.message });
      }
    }
    if (req.files?.image) {
      try {
        const result = await uploadToCloudinary(req.files.image[0].buffer, "banner");
        updateData.imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed", error: uploadErr.message });
      }
    }

    let banner = await Banner.findOne();
    if (!banner) {
      banner = new Banner(updateData);
    } else {
      Object.assign(banner, updateData);
    }

    await banner.save();
    
    return res.status(200).json({ message: "Banner updated", banner });
  } catch (err) {
    console.error("Update banner error:", err);
    return res.status(500).json({ message: "Update failed", error: err.message });
  }
};


module.exports = {
  getBanner,
  updateBanner,
};
