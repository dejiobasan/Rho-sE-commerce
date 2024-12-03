const { protectRoute } = require("../Middleware/authMiddleware");
let coupon = require("../Models/Coupon.js")

const router = require("express").Router();

router.route(protectRoute, "/getCoupon").get(async (req, res) => {
    try {
        const Coupon = await coupon.findOne({userId: req.user._id, isActive: true});
        res.json(Coupon || null);
    } catch (error) {
        res.status(500).json({ message: "Error fetching coupon" , error: error.message });
    }
});

router.route(protectRoute, "/validateCoupon").get(async (req, res) => {
    try {
        const { code } = req.body;
        const Coupon = await coupon.findOne({code: code, userId: req.user._id, isActive: true});
        if(!Coupon) {
            return res.status(404).json({message: "Coupon not found!"});
        }

        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message: "Coupon Expired!"});
        }
        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        });
    } catch (error) {
        res.status(500).json({ message: "Error validating coupon" , error: error.message})
    }
})