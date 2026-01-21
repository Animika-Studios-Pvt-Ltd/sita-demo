const Foundation = require("./foundation.model");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary"); // ✅ DESTRUCTURE IMPORT

const getFoundation = async (req, res) => {
  try {
    const foundation = await Foundation.findOne();
    if (!foundation) return res.status(404).json({ message: "No foundation found" });
    res.json(foundation);
  } catch (err) {
    console.error("Get foundation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateFoundation = async (req, res) => {
  try {
    console.log("📥 Received foundation update request");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { title, description, quote, starsCount, paragraphs } = req.body;
    
    let parsedParagraphs = [];
    if (paragraphs) {
      try {
        parsedParagraphs = typeof paragraphs === 'string' ? JSON.parse(paragraphs) : paragraphs;
        
        parsedParagraphs = parsedParagraphs.filter(para => para.text && para.text.trim() !== '');
        
        console.log("✅ Parsed paragraphs:", parsedParagraphs);
      } catch (parseErr) {
        console.error("❌ Paragraphs parse error:", parseErr);
        return res.status(400).json({ message: "Invalid paragraphs format" });
      }
    }

    const updateData = { 
      title, 
      description, 
      quote, 
      starsCount: starsCount ? Number(starsCount) : 5,
      paragraphs: parsedParagraphs 
    };

    if (req.files?.logo) {
      try {
        console.log("📤 Uploading logo to Cloudinary...");
        const result = await uploadToCloudinary(req.files.logo[0].buffer, "foundation");
        updateData.logoUrl = result.secure_url;
        console.log("✅ Logo uploaded:", result.secure_url);
      } catch (uploadErr) {
        console.error("❌ Logo upload failed:", uploadErr);
        return res.status(500).json({ message: "Logo upload failed", error: uploadErr.message });
      }
    }
    if (req.files?.image) {
      try {
        console.log("📤 Uploading image to Cloudinary...");
        const result = await uploadToCloudinary(req.files.image[0].buffer, "foundation");
        updateData.imageUrl = result.secure_url;
        console.log("✅ Image uploaded:", result.secure_url);
      } catch (uploadErr) {
        console.error("❌ Image upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed", error: uploadErr.message });
      }
    }

    let foundation = await Foundation.findOne();
    if (!foundation) {
      console.log("📝 Creating new foundation document");
      foundation = new Foundation(updateData);
    } else {
      console.log("📝 Updating existing foundation document");
      Object.assign(foundation, updateData);
    }

    await foundation.save();
    console.log("✅ Foundation saved successfully");

    return res.status(200).json({ message: "Foundation updated", foundation });
  } catch (err) {
    console.error("❌ Update foundation error:", err);
    return res.status(500).json({ message: "Update failed", error: err.message });
  }
};

module.exports = {
  getFoundation,
  updateFoundation,
};
