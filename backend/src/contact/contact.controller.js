const Contact = require("./contact.model");
const { sendContactFormEmail } = require("../services/emailService");

const postContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate message length (min 5 chars)
    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters long"
      });
    }

    // Save to database
    const newContact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || "Contact Form Submission",
      message: message.trim()
    });

    await newContact.save();
    console.log('✅ Contact message saved to database:', newContact._id);

    // Send email notification to enquiries@langshott.org
    try {
      await sendContactFormEmail({
        name: newContact.name,
        email: newContact.email,
        subject: newContact.subject,
        message: newContact.message,
        contactId: newContact._id
      });
      console.log('✅ Email notification sent to enquiries@langshott.org');
    } catch (emailError) {
      console.error('⚠️ Failed to send email notification:', emailError.message);
      // Don't fail the request if email fails - contact is already saved
    }

    return res.status(200).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      contact: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        subject: newContact.subject,
        createdAt: newContact.createdAt
      }
    });
  } catch (error) {
    console.error("❌ Error creating contact:", error);

    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message. Please try again."
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts"
    });
  }
};

const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error("❌ Error fetching contact:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact"
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    console.log('✅ Contact message deleted:', id);

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
      data: deletedContact
    });
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete contact"
    });
  }
};

module.exports = {
  postContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
};
