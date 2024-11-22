const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../Lib/Redis.js")
let User = require("../Models/User.js");
require("dotenv").config();


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});

    return { accessToken, refreshToken };
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refesh_token: ${userId}`, refreshToken, "EX",7*24*60*60)// 7days
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent XSS attacks, cross site scripting attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevents CSRF attack, cross-site request forgery
        maxAge: 15 * 60 * 1000, //15minutes
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent XSS attacks, cross site scripting attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevents CSRF attack, cross-site request forgery
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    })
}

router.route("/signup").post(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = Number(process.env.saltRounds);

    bcrypt.hash(password, saltRounds, (err, hash)=> {
        const newUser = new User({
            Name: name,
            Email: email,
            Password: hash,
        })
        if (err) {
            console.error(err);
        } else {
            newUser
              .save()
              .then(() => {
                res.json("User created successfully!");
              })
              .catch((err) => res.status(400).json("Error: " + err));
        }
    })
    const { accessToken, refreshToken} = generateTokens(User._id)
    await storeRefreshToken(User._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
})

router.route("/").post((req, res) => {

})







module.exports = router;