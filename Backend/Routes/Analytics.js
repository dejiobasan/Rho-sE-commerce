const Router = require("express").Router();
const express = require("express");
const { protectRoute, adminRoute } = require("../Middleware/authMiddleware");
const user = require("../Models/User");
const product = require("../Models/Product");
const Order = require("../Models/Order");
const app = express();


router.route(protectRoute, adminRoute, "/getAnalytics").get(async (req, res) => {
    const getAnalyticsData = async () => {
        const totalUsers = await user.countDocuments();
        const totalProducts = await product.countDocuments();
    
        const salesData = await product.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum:  "$totalAmount"}
                }
            }
        ])
    
        const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };
    
        return {
            users: totalUsers,
            products: totalProducts,
            totalSales,
            totalRevenue,
        };
    };

    const getDailySalesData = async (startDate, endDate) => {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ])

        function getDatesInRange(startDate, endDate) {
            const dates = [];
            let currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                dates.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return dates;
        }

        const dateArray = getDatesInRange(startDate, endDate);
        return dateArray.map(date => {
            const data = dailySalesData.find(d => d._id === date);
            return {
                date,
                sales: data ? data.sales : 0, //Look into this code
                revenue: data ? data.revenue : 0, //Look into this code
            };
        });
    };

    try {
        const analyticData = await getAnalyticsData();
        const startDate  = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date();

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticData,
            dailySalesData
        });
    } catch (error) {
        console.log("Error fetching analytics data", error.message);
        res.status(500).json({ message: "Error fetching analytics data", error: error.message });
    }
});

module.exports = Router;