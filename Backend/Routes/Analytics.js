const router = require("express").Router();
const express = require("express");
const { protectRoute, adminRoute } = require("../Middleware/authMiddleware");
const { getAnalyticsData, getDailySalesData } = require("../Controllers/Analytics.Controller.js");


// @desc Get analytics data
// @route GET /api/analytics/getAnalytics
// @access Private
router.get("/getAnalytics", protectRoute, adminRoute, async (req, res) => {
    try {
		const analyticsData = await getAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

module.exports = router;