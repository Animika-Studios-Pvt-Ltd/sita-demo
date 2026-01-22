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
      default: "json",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

cmsPageSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("CmsPage", cmsPageSchema);
