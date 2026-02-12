const mongoose = require("mongoose");

const cmsPageSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
      default: "demo-tenant", // Default for compatibility
    },

    slug: {
      type: String,
      required: true,
    },

    sections: [
      {
        key: {
          type: String, // hero, doctors, links, content
          required: true,
        },
        content: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    editorType: {
      type: String,
      enum: ["json", "html"],
      default: "json",
    },

    createdFrom: {
      type: String,
      enum: ["manage-pages", "manage-events"],
      default: "manage-pages",
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    // Navigation and Metadata
    addToHeader: { type: Boolean, default: false },
    addToFooter: { type: Boolean, default: false },
    headerPosition: { type: mongoose.Schema.Types.Mixed, default: 0 },
    headerRow: { type: String, enum: ["top", "bottom"], default: "bottom" },
    headerParent: { type: String, default: null }, // "sitaFactor", "workshops", or slug of parent
    navigationTitle: { type: String, default: "" }, // NEW: Overrides title in menus
    isDropdownParent: { type: Boolean, default: false }, // NEW: If true, this page acts as a dropdown menu
    footerPosition: { type: Number, default: 0 },
    order: { type: Number, default: 0 }, // General ordering fallback
    title: { type: String }, // For display in menus if different from slug/page title

    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

cmsPageSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("CmsPage", cmsPageSchema);
