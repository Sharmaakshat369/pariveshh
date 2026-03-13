const mongoose = require("mongoose");

const manualSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, default: "General", trim: true },
    fileSize: { type: String, default: "", trim: true },
    downloadUrl: { type: String, default: "#", trim: true },
  },
  { _id: false }
);

const clearanceFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: "", trim: true },
    seq: { type: String, default: "", trim: true },
    docUrl: { type: String, default: "#", trim: true },
    pdfUrl: { type: String, default: "#", trim: true },
  },
  { _id: false }
);

const clearanceCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Environment", "Forest", "Wildlife", "CRZ"],
      required: true,
    },
    forms: {
      type: [clearanceFormSchema],
      default: [],
    },
  },
  { _id: false }
);

const publicContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "HOME_PUBLIC_CONTENT",
    },
    homeTopUpdates: {
      type: [String],
      default: [],
    },
    manuals: {
      type: [manualSchema],
      default: [],
    },
    clearanceSidebarLinks: {
      type: [String],
      default: [],
    },
    clearances: {
      type: [clearanceCategorySchema],
      default: [],
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PublicContent", publicContentSchema);
