const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
    },
    subject: { 
      type: String,
      trim: true,
      default: "Contact Form Submission",
      maxlength: [200, "Subject cannot exceed 200 characters"]
    },
    message: { 
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters"],  // Changed from 10 to 5
      maxlength: [5000, "Message cannot exceed 5000 characters"]  // Increased from 2000
    },
    status: {
      type: String,
      enum: ["new", "read", "responded", "archived"],
      default: "new"
    },
    responded: {
      type: Boolean,
      default: false
    },
    responseDate: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

contactSchema.pre('save', function(next) {
  console.log(`💾 Saving contact from: ${this.email}`);
  next();
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
