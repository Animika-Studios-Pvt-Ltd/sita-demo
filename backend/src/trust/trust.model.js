const mongoose = require("mongoose");

const trustCertificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TrustCertificate = mongoose.model("TrustCertificate", trustCertificateSchema);

module.exports = TrustCertificate;
