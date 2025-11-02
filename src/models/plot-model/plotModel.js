const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
        },
    },
    area: {
      value: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["sqft", "acre", "hectare", "bigha"],
        default: "sqft",
      },
    },
    price: {
      value: { type: Number, required: true },
      unit: { type: String, default: "INR" },
      negotiable: { type: Boolean, default: false },
    },
    ownership: {
      ownerName: { type: String, required: true },
      ownerContact: { type: String },
      verified: { type: Boolean, default: false },
    },
    landType: {
      type: String,
      enum: ["Agricultural", "Residential", "Commercial", "Industrial", "Other"],
      required: true,
    },
    legalDocuments: [
      {
        docType: { type: String, enum: ["Sale Deed", "Patta", "Tax Receipt", "Encumbrance Certificate", "Other"] },
        fileUrl: { type: String },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    features: {
      roadAccess: { type: Boolean, default: false },
      electricity: { type: Boolean, default: false },
      waterSupply: { type: Boolean, default: false },
      fencing: { type: Boolean, default: false },
      nearbyFacilities: [{ type: String }],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

landSchema.index({ 'location.coordinates': '2dsphere' });

const Land = mongoose.models.Land || mongoose.model('Land', landSchema);
module.exports = Land;
