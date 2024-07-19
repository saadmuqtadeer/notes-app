import express from "express";
import {
  createNotes,
  deleteNotes,
  fetchNote,
  fetchNotes,
  setReminder,
  deleteReminder,
  updateNote,
  archivedNotes,
  getBinnedNotes,
} from "../controller/notesController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createLabel,
  deleteLabel,
  getAllLabels,
  getNotesByLabel,
  updateLabelName,
} from "../controller/labelController.js";

const router = express.Router();

router.get("/", requireSignIn, fetchNotes);
router.get("/:noteId", requireSignIn, fetchNote);
router.post("/create", requireSignIn, createNotes);
router.put("/update/:noteId", requireSignIn, updateNote);
router.delete("/delete/:noteId", requireSignIn, deleteNotes);
router.get('/trash', requireSignIn, getBinnedNotes);
router.patch("/pin/:noteId/:action", requireSignIn, archivedNotes);
router.post("/label", requireSignIn, createLabel);
router.get("/labels", requireSignIn, getAllLabels);
router.get("/label/:labelId/notes", requireSignIn, getNotesByLabel);
router.put("/label/:labelId", requireSignIn, updateLabelName);
router.delete("/label/:labelId", requireSignIn, deleteLabel);

router.put("/setReminder/:noteId", requireSignIn, setReminder);
router.delete("/deleteReminder/:noteId", requireSignIn, deleteReminder);

export default router;
