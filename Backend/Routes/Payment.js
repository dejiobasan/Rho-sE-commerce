const router = require("express").Router();
const flw = require("../Lib/Flutterwave");
const { protectRoute } = require("../Middleware/authMiddleware");
const Coupon = require("../Models/Coupon");
const redis = require("../Lib/Redis");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 5,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

    // const payload = {
    //   card_number: req.body.card_number,
    //   cvv: req.body.card_cvv,
    //   expiry_month: req.body.card_expiry_month,
    //   expiry_year: req.body.card_expiry_year,
    //   currency: "NGN",
    //   amount: totalAmount,
    //   email: req.user.email,
    //   fullname: req.body.card_name,
    //   tx_ref: generateTransactionReference(),
    //   redirect_url: process.env.APP_BASE_URL + "/pay/redirect",
    //   enckey: process.env.FLW_ENCRYPTION_KEY,
    // };

    // const response = await flw.Charge.card(payload);
    // switch (response?.meta?.authorization?.mode) {
    //   case "pin":
    //   case "avs_noauth":
    //     req.session.charge_payload = payload;
    //     req.session.auth_fields = response.meta.authorization.fields;
    //     req.session.auth_mode = response.meta.authorization.mode;
    //     return res.redirect("/pay/authorize");

    //   case "redirect":
    //     await redis.setAsync(`txref-${response.data.tx_ref}`, response.data.id);
    //     const authUrl = response.meta.authorization.redirect;
    //     return res.redirect(authUrl);
    //   default:
    //     const transactionId = response.data.id;
    //     const transaction = await flw.Transaction.verify({ id: transactionId });
    //     if (transaction.data.status == "successful") {
    //       return res.redirect("/payment-successful");
    //     } else if (transaction.data.status == "pending") {
    //       // Schedule a job that polls for the status of the payment every 10 minutes
    //       transactionVerificationQueue.add({ id: transactionId });
    //       return res.redirect("/payment-processing");
    //     } else {
    //       return res.redirect("/payment-failed");
    //     }
    // }
  } catch (error) {
    console.error("Error in create-checkout-session controller", error.message);
    res.status(500).json({ message: "Error in create-checkout-session controller" });
  }
});

// app.post("/pay/authorize", async (req, res) => {
//   const payload = req.session.charge_payload;
//   payload.authorization = {
//     mode: req.session.auth_mode,
//   };

//   req.session.auth_fields.forEach((field) => {
//     payload.authorization[field] = req.body[field];
//   });

//   const response = await flw.Charge.card(payload);

//   switch (response?.meta?.authorization?.mode) {
//     case "otp":
//       // Show the user a form to enter the OTP
//       req.session.flw_ref = response.data.flw_ref;
//       return res.redirect("/pay/validate");
//     case "redirect":
//       const authUrl = response.meta.authorization.redirect;
//       return res.redirect(authUrl);
//     default:
//       // No validation needed; just verify the payment
//       const transactionId = response.data.id;
//       const transaction = await flw.Transaction.verify({ id: transactionId });
//       if (transaction.data.status == "successful") {
//         return res.redirect("/payment-successful");
//       } else if (transaction.data.status == "pending") {
//         transactionVerificationQueue.add({ id: transactionId });
//         return res.redirect("/payment-processing");
//       } else {
//         return res.redirect("/payment-failed");
//       }
//   }
// });

// app.post("/pay/validate", async (req, res) => {
//   const response = await flw.Charge.validate({
//     otp: req.body.otp,
//     flw_ref: req.session.flw_ref,
//   });
//   if (response.data.status === "successful" || response.data.status === "pending") {
//     // Verify the payment
//     const transactionId = response.data.id;
//     const transaction = await flw.Transaction.verify({ id: transactionId });
//     if (transaction.data.status == "successful") {
//       return res.redirect("/payment-successful");
//     } else if (transaction.data.status == "pending") {
//       // Schedule a job that polls for the status of the payment every 10 minutes
//       transactionVerificationQueue.add({ id: transactionId });
//       return res.redirect("/payment-processing");
//     }
//   }

//   return res.redirect("/payment-failed");
// });

// app.post("/pay/redirect", async (req, res) => {
//   if (req.query.status === "successful" || req.query.status === "pending") {
//     // Verify the payment
//     const txRef = req.query.tx_ref;
//     const transactionId = await redis.getAsync(`txref-${txRef}`);
//     const transaction = await flw.Transaction.verify({ id: transactionId });
//     if (transaction.data.status == "successful") {
//       return res.redirect("/payment-successful");
//     } else if (transaction.data.status == "pending") {
//       // Schedule a job that polls for the status of the payment every 10 minutes
//       transactionVerificationQueue.add({ id: transactionId });
//       return res.redirect("/payment-processing");
//     }
//   }

//   return res.redirect("/payment-failed");
// });

module.exports = router;