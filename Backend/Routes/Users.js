const router = require("express").Router();
const bcrypt = require("bcrypt");
let User = require("../Models/User.js");
require("dotenv").config();

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
})

router.route("/").post((req, res) => {
    
})







module.exports = router;