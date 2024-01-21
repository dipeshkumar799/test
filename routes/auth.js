import express from "express";
import User from "../model/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();
const JWT_SECRET = "youaregoodboy";
// for sinUp this code is used to create account if account is not found
router.post(
  "/Signup",
  [
    body("email", "Enter your valid email").isEmail(),
    body("password", "Enter"),
    body("name", "Name must be a string").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      const { email, password, name } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ errors: "Email is already registered" });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        email,
        password: hash,
        name,
        isLogin: false,
      });

      const data = {
        user: {
          id: User._id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.json(token);
      console.log(newUser);
    } catch (error) {
      console.error(error);
      res.json({ error: "Internal Server Error" });
    }
  }
);
// for login this code is used  for login the account if account is created

router.post(
  "/login",
  [
    body("email", "please enter valid email").isEmail(),
    body("password", "please enter valid password"),
  ],

  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("email doesn't match");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new Error("password  doesn't match");
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log(token);
      // Update the user's login status
      user.isLogin = true;
      const userUpdate = await user.save();

      // Send the token in the response along with user information
      res.status(200).json({ userUpdate, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// Get login get user detail after login the account except password
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
