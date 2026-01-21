const InspirationImage = require("./inspirationImage.model");
const { cloudinary } = require("../config/cloudinary");

// ============================================
// OPTIMIZED: Parallel upload with timeout
// ============================================
const uploadToCloudinary = (buffer, folder = "inspirations") => {
  return new Promise((resolve, reject) => {
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      reject(new Error('Cloudinary upload timeout (30s)'));
    }, 30000); // 30 second timeout

    const stream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: "image",
        // Optimize for faster upload
        chunk_size: 6000000 // 6MB chunks
      },
      (error, result) => {
        clearTimeout(timeout);
        if (result) resolve(result);
        else reject(error);
      }
    );
    
    stream.end(buffer);
  });
};

const handleImageUpload = async (file, folder = "inspirations") => {
  if (!file || !file.buffer) return null;
  
  try {
    const result = await uploadToCloudinary(file.buffer, folder);
    return {
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error;
  }
};

// GET /api/inspiration-images
exports.getImages = async (req, res) => {
  try {
    const images = await InspirationImage.find()
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for faster queries
    
    res.json(images);
  } catch (err) {
    console.error("Failed to fetch inspiration images", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/inspiration-images/upload
exports.uploadImage = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    console.log('⏳ Starting Cloudinary upload...');
    const startTime = Date.now();

    // Upload to Cloudinary
    const result = await handleImageUpload(file);
    
    if (!result) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const uploadTime = Date.now() - startTime;
    console.log(`✅ Cloudinary upload completed in ${uploadTime}ms`);

    // Save to database
    const newImage = new InspirationImage({
      title: title || "",
      imageUrl: result.imageUrl,
      cloudinaryId: result.cloudinaryId,
    });

    await newImage.save();
    
    console.log(`✅ Image saved to DB in ${Date.now() - startTime - uploadTime}ms`);

    // Return the new image immediately
    res.status(201).json(newImage);
    
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

// DELETE /api/inspiration-images/:id
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await InspirationImage.findById(id);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from Cloudinary in parallel (don't wait for it)
    if (image.cloudinaryId) {
      // Fire and forget - delete in background
      cloudinary.uploader.destroy(image.cloudinaryId)
        .then(() => console.log(`✅ Deleted from Cloudinary: ${image.cloudinaryId}`))
        .catch(err => console.error('Cloudinary delete error:', err));
    }

    // Delete from database immediately
    await image.deleteOne();
    
    res.json({ 
      success: true, 
      message: "Image deleted successfully",
      deletedId: id 
    });
    
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = exports;
