const express = require("express");
const router = express.Router();
const {
  postContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
} = require("./contact.controller");

router.post("/create-contact", postContact);
router.get("/", getAllContacts);
router.get("/:id", getSingleContact);
router.delete("/:id", deleteContact);

module.exports = router;
