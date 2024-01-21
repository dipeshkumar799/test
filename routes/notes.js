import express from "express";
import Notes from "../model/Notes.js";
import { body, validationResult } from "express-validator";
import fetchUser from "../middleware/fetchUser.js";
const router = express.Router();
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter a valid title").isString(),
    body("discripition", "Enter a valid description").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, discripition, tag } = req.body;
      const notes = new Notes({
        title,
        discripition,
        tag,
        user: req.user._id,
      });

      await notes.save();
      res.json({ message: "Note added successfully", note: notes });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal Server Error. Unable to add the note.",
      });
    }
  }
);

//get all the notes using get
router.get("/fetchNotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user: req.user._id });
  console.log(notes);
  res.json(notes);
});

export default router;
