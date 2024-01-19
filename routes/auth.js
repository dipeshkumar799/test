import express from "express";
import User from "../model/User";
import { body, validationResult } from "express-validator";
const router = express.Router();
router.post(
  "/Signup",
  [
    body("email").isEmail(),
    body("password").isStrongPassword(),
    body("name").isString(),
  ],
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      });
      res.json(user);
      console.log(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
