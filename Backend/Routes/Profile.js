const Router = require("express").Router();
const express = require("express");
const { protectRoute } = require("../Middleware/authMiddleware");
const user = require("../Models/User");


router.route(protectRoute, "/getProfile").get(async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" , error: error.message });
    }
});