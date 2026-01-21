const Precept = require("./precepts.model");
const { uploadToCloudinary } = require("../config/cloudinary");

// Helper function to upload image buffer to Cloudinary
async function handleImageUpload(file, folder = "precepts") {
  if (!file || !file.buffer) return null;
  const result = await uploadToCloudinary(file.buffer, folder);
  return {
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
  };
}

// GET /api/precepts
exports.getPrecepts = async (req, res) => {
  try {
    const precepts = await Precept.find().sort({ createdAt: -1 });
    res.json(precepts);
  } catch (error) {
    console.error("Get precepts error:", error);
    res.status(500).json({ message: "Failed to fetch precepts" });
  }
};

// POST /api/precepts/upload
exports.uploadImage = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await handleImageUpload(file);

    if (!result) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    const precept = new Precept({
      imageUrl: result.imageUrl,
      cloudinaryId: result.cloudinaryId,
      title: title || "",
    });

    await precept.save();
    res.status(201).json(precept);
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /api/precepts/:id
exports.deletePrecept = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE request for precept ID:", id);

    const precept = await Precept.findById(id);
    if (!precept) {
      console.log("Precept not found");
      return res.status(404).json({ message: "Precept not found" });
    }

    // Cloudinary delete
    if (precept.cloudinaryId) {
      try {
        const { cloudinary } = require("../config/cloudinary");
        await cloudinary.uploader.destroy(precept.cloudinaryId);
        console.log("Deleted from Cloudinary:", precept.cloudinaryId);
      } catch (cloudErr) {
        console.warn("Cloudinary delete failed:", cloudErr.message);
      }
    }

    await precept.deleteOne();
    console.log("Precept deleted from DB");

    res.json({ success: true, message: "Precept deleted" });
  } catch (error) {
    console.error("Delete precept error:", error);
    res.status(500).json({ message: "Failed to delete precept" });
  }
};

