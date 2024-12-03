const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../Lib/Redis.js");
let user = require("../Models/User.js");
require("dotenv").config();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent XSS attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attack, cross-site request forgery
    maxAge: 15 * 60 * 1000, //15minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent XSS attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attack, cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });
};

router.route("/signup").post(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await user.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const saltRounds = Number(process.env.saltRounds);

  bcrypt.hash(password, saltRounds, (err, hash) => {
    const newUser = new user({
      Name: name,
      Email: email,
      Password: hash,
    });
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
  });
  const { accessToken, refreshToken } = generateTokens(user._id);
  await storeRefreshToken(user._id, refreshToken);
  setCookies(res, accessToken, refreshToken);
});

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    await user.findOne({ Email: email }).then((foundUser) => {
      if (!foundUser) {
        console.error(err);
        res.status(401).json({ message: "Login failed" });
      } else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.Password, async (err, result) => {
            if (result === true) {
              const { accessToken, refreshToken } = generateTokens(
                foundUser._id
              );
              await storeRefreshToken(foundUser._id, refreshToken);
              setCookies(res, accessToken, refreshToken);
              res.status(200).json({
                success: true,
                message: "Login Successful!",
                User: {
                  Name: foundUser.Name,
                },
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.log("Error in Login Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.route("/logout").post(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token: ${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Login Controller", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
});

router.route("/refresh-token").post(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);
    if (storedToken !== refreshToken) {
      res.status(401).json({ message: "Invalid refresh token!" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevent XSS attacks, cross site scripting attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //prevents CSRF attack, cross-site request forgery
      maxAge: 15 * 60 * 1000, //15minutes
    });

    res.json({ message: "Token refreshed successfully!" });
  } catch (error) {
    console.log("Error in Login Controller", error);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
});

// router.route("/profile").get((req, res) => { implement later...

// })

module.exports = router;
