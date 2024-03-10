const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = require("../config");

//Route1: Create a User using  : POST "/api/auth/createUser" . No Login required

router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters ").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // Check if the email is already registered

      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res
          .status(400)
          .json({ success, errors, message: "Email already registered" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user instance
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: newUser.id
        }
      }

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.status(200).json({ success, authtoken }); // Respond with the saved user
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ success, message: "Server error" });
    }
  }
);

// Route 2 : Authenticate a User using  : POST "/api/auth/login" . No Login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials ",
          });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);

      if (!passwordcompare) {
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials ",
          });
      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.status(201).json({ success, authtoken }); // Respond with the saved user
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ success, message: "Internal error occured" });
    }
  }
);

// Route 3 : Get loggedin User Details using:: POST "/api/auth/getuser" .  Login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    res.send(user);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal error occured" });
  }
});

module.exports = router;
