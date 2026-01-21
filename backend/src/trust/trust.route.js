const express = require("express");
const router = express.Router();

const {
  uploadCertificates,
  getAllCertificates,
  getActiveCertificates,
  deleteCertificate,
  suspendCertificate,
  unsuspendCertificate,
} = require("./trust.controller");

const upload = require("../middlewares/upload.middleware");

router.post("/upload", upload.array("certificates", 10), uploadCertificates);
router.get("/", getAllCertificates);
router.get("/active", getActiveCertificates);
router.delete("/:id", deleteCertificate);
router.put("/suspend/:id", suspendCertificate);
router.put("/unsuspend/:id", unsuspendCertificate);

module.exports = router;
