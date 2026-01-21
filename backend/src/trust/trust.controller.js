const TrustCertificate = require("./trust.model");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary.js");

const uploadCertificates = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "No images uploaded" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadToCloudinary(
        file.buffer,
        "bookstore/trust-certificates"
      );

      return {
        name: file.originalname,
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    });

    const uploadedData = await Promise.all(uploadPromises);

    const certificates = await TrustCertificate.insertMany(uploadedData);

    console.log("✅ Trust certificates uploaded successfully");

    res.status(200).send({
      message: "Trust certificates uploaded successfully",
      certificates,
    });
  } catch (error) {
    console.error("❌ Error uploading certificates:", error);
    res.status(500).send({
      message: "Failed to upload certificates",
      error: error.message,
    });
  }
};

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await TrustCertificate.find().sort({ createdAt: -1 });
    res.status(200).send(certificates);
  } catch (error) {
    console.error("Error fetching certificates", error);
    res.status(500).send({ message: "Failed to fetch certificates" });
  }
};

const getActiveCertificates = async (req, res) => {
  try {
    const certificates = await TrustCertificate.find({ suspended: false }).sort({
      createdAt: -1,
    });
    res.status(200).send(certificates);
  } catch (error) {
    console.error("Error fetching active certificates", error);
    res.status(500).send({ message: "Failed to fetch certificates" });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await TrustCertificate.findByIdAndDelete(id);

    if (!certificate) {
      return res.status(404).send({ message: "Certificate not found" });
    }

    if (certificate.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(certificate.imagePublicId);
        console.log("✅ Certificate image deleted from Cloudinary");
      } catch (err) {
        console.error("❌ Error deleting image from Cloudinary:", err);
      }
    }

    res.status(200).send({
      message: "Certificate deleted successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error deleting certificate", error);
    res.status(500).send({
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};

const suspendCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await TrustCertificate.findByIdAndUpdate(
      id,
      { suspended: true },
      { new: true }
    );
    if (!certificate)
      return res.status(404).send({ message: "Certificate not found" });
    res
      .status(200)
      .send({ message: "Certificate suspended successfully", certificate });
  } catch (error) {
    console.error("Error suspending certificate", error);
    res.status(500).send({ message: "Failed to suspend certificate" });
  }
};

const unsuspendCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await TrustCertificate.findByIdAndUpdate(
      id,
      { suspended: false },
      { new: true }
    );
    if (!certificate)
      return res.status(404).send({ message: "Certificate not found" });
    res
      .status(200)
      .send({ message: "Certificate unsuspended successfully", certificate });
  } catch (error) {
    console.error("Error unsuspending certificate", error);
    res.status(500).send({ message: "Failed to unsuspend certificate" });
  }
};

module.exports = {
  uploadCertificates,
  getAllCertificates,
  getActiveCertificates,
  deleteCertificate,
  suspendCertificate,
  unsuspendCertificate,
};
