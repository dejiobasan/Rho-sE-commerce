const { protectRoute } = require("../Middleware/authMiddleware");
let coupon = require("../Models/Coupon.js")

const router = require("express").Router();

router.get("/getCoupon", protectRoute, async (req, res) => {
    try {
        const Coupon = await coupon.findOne({userId: req.user._id, isActive: true});
        res.json(Coupon || null);
    } catch (error) {
        res.status(500).json({ message: "Error fetching coupon" , error: error.message });
    }
});

router.post("/validateCoupon", protectRoute, async (req, res) => {
    try {
        const { code } = req.body;
        const neededCoupon = await coupon.findOne({code: code, userId: req.user._id, isActive: true});
        if(!neededCoupon) {
            return res.status(404).json({message: "Coupon not found!"});
        }

        if(neededCoupon.expiryDate < new Date()){
            neededCoupon.isActive = false;
            await neededCoupon.save();
            return res.status(404).json({message: "Coupon Expired!"});
        }
        res.json({
            message: "Coupon is valid",
            code: neededCoupon.code,
            discountPercentage: neededCoupon.discountPercentage
        });
    } catch (error) {
        res.status(500).json({ message: "Error validating coupon" , error: error.message})
    }
})

module.exports = router;