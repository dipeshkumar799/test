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

//for update to no
router.put("/updateNotes/:_id", fetchUser, async (req, res) => {
  try {
    const { title, discripition, tag } = req.body;
    // Create a new note object
    const newNotes = {};
    if (title) {
      newNotes.title = title;
    }
    if (discripition) {
      newNotes.discripition = discripition;
    }
    if (tag) {
      newNotes.tag = tag;
    }

    // Find the note to be updated and update it
    const _id = req.params._id; // Corrected from const {_id}=req.params._id;
    const notes = await Notes.findById(_id);

    // Check if the user is authorized to update the note
    if (notes.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to update this note.",
      });
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      _id,
      { $set: newNotes },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        error: "Note not found.",
      });
    }

    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error. Unable to update the note.",
    });
  }
});

router.delete("/deleteNote/:_id", fetchUser, async (req, res) => {
  try {
    const _id = req.params._id;
    const note = await Notes.findById(_id);

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this note.",
      });
    }
    const deleteNote = await Notes.findByIdAndDelete(_id);
    if (!deleteNote) {
      return res.status(404).json({
        error: "Note not found.",
      });
    }

    res.json({
      message: "Note deleted successfully",
      deleteNote: deleteNote,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error. Unable to delete the note.",
    });
  }
});

export default router;
