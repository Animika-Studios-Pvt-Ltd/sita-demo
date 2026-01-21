const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, 
});

const uploadToCloudinary = (buffer, folder = "uploads", publicId) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No image buffer provided for upload."));
    }

    const options = {
      folder,
      resource_type: "auto",
      timeout: 60000,
      chunk_size: 6000000, 
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) {
        console.error("❌ Cloudinary upload failed:", err);
        
        let errorMessage = "Cloudinary upload error: ";
        if (err.message) {
          errorMessage += err.message;
        } else if (err.http_code === 499) {
          errorMessage += "Upload timeout - file too large or slow connection";
        } else if (err.http_code) {
          errorMessage += `HTTP ${err.http_code} error`;
        } else {
          errorMessage += "Unknown error occurred";
        }
        
        return reject(new Error(errorMessage));
      }

      if (!result) {
        return reject(new Error("Cloudinary upload failed: No result returned"));
      }

      console.log("✅ Uploaded to Cloudinary:", {
        url: result.secure_url,
        id: result.public_id,
        size: result.bytes,
        format: result.format,
      });

      resolve(result);
    });

    const uploadTimeout = setTimeout(() => {
      stream.destroy();
      reject(new Error("Upload timeout: Request took longer than 60 seconds"));
    }, 60000);

    stream.on('finish', () => {
      clearTimeout(uploadTimeout);
    });

    stream.on('error', (error) => {
      clearTimeout(uploadTimeout);
      console.error("❌ Stream error:", error);
      reject(new Error("Upload stream error: " + error.message));
    });
    
    try {
      stream.end(buffer);
    } catch (writeError) {
      clearTimeout(uploadTimeout);
      reject(new Error("Failed to write buffer to stream: " + writeError.message));
    }
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
