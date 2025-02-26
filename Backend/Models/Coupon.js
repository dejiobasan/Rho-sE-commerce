const mongoose = require("mongoose");

// Schema for Coupons
const CounponsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
}, {
    timestamps: true,
});

// Model for Coupons
const coupon = new mongoose.model("coupon", CounponsSchema);

module.exports = coupon;