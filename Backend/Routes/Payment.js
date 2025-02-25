const router = require("express").Router();
const flw = require("../Lib/Flutterwave");
const { protectRoute } = require("../Middleware/authMiddleware");
const Coupon = require("../Models/Coupon");
const redis = require("../Lib/Redis");
const express = require("express");
const cors = require("cors");
const app = express();
const Order = require("../Models/Order");

app.use(cors());
app.use(express.json());

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 5,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();

  return newCoupon;
}

router.post("/create-checkout-session", protectRoute, async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or empty products array" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = product.Price;
      totalAmount += Math.round(amount * product.quantity);
      return {
        name: product.Name,
        description: product.Description,
        amount: Math.round(amount * 100), // Convert to smallest currency unit
        currency: "NGN",
        quantity: product.quantity,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    if (totalAmount >= 100000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({Amount: totalAmount});
  } catch (error) {
    console.error("Error in create-checkout-session controller", error.message);
    res.status(500).json({ message: "Error in create-checkout-session controller", error: error.message });
  }
});

router.post("/checkout-success", protectRoute, async (req, res) => {
  try {
    const {user, products, totalAmount, flutterSessionId} = req.body;
    const newOrder = new Order({
      user: user._id,
      products: products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.Price,
      })),
      totalAmount,
      flutterSessionId,
    });
    await newOrder.save();
  } catch (error) {
    console.error("Error in checkout-success controller", error.message);
    res.status(500).json({ message: "Error in checkout-success controller", error: error.message });
  }
});

module.exports = router;