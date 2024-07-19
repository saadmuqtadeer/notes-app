import notesModel from "../models/notesModel.js";
import mongoose from "mongoose";

export const createNotes = async (req, res) => {
  try {
    const { title, description, user, theme, collaborators, isPublic } =
      req.body;
    if (!title || !description)
      return res.send({ message: "Fields are required" });
    const note = await notesModel.create({
      title,
      description: description,
      user,
      theme,
      collaborators,
      isPublic,
    });
    return res.status(201).send({ success: "Created Successfully", note });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error in creating note" });
  }
};

export const fetchNotes = async (req, res) => {
  try {
    const userNotes = await notesModel.find({ user: req.user._id });
    return res.status(200).send({ success: "Got All Notes", userNotes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error in fetching notes" });
  }
};

export const fetchNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await notesModel.findById(noteId);
    if (note.user !== user) return res.send({ message: "Not created by you" });
    else
      return res
        .status(200)
        .send({ success: "Note fetched Succesfully", note });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error while fetching note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const {
      title,
      description,
      theme,
      collaborators,
      reminder,
      isBinned,
      isArchived,
      isPublic,
    } = req.body;
    const note = await notesModel.findOne({ _id: noteId });
    if (!note) {
      return res.status(404).send({ error: "Note not found" });
    }

    note.title = title !== undefined ? title : note.title;
    note.description =
      description !== undefined ? description : note.description;
    note.theme = theme !== undefined ? theme : note.theme;
    note.collaborators =
      collaborators !== undefined ? collaborators : note.collaborators;
    note.reminder = reminder !== undefined ? reminder : note.reminder;
    note.isBinned = isBinned !== undefined ? isBinned : note.isBinned;
    note.isArchived = isArchived !== undefined ? isArchived : note.isArchived;
    note.isPublic = isPublic !== undefined ? isPublic : note.isPublic;
    await note.save();

    return res.status(200).send({ success: "Note updated successfully", note });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error updating note" });
  }
};

export const deleteNotes = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndUpdate(
      noteId,
      {
        isBinned: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).send({ error: "Note not found" });
    }

    return res
      .status(200)
      .send({ success: "Note moved to trash successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error while moving note to trash" });
  }
};

export const getBinnedNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ user: userId, isBinned: true });

    return res.status(200).send({ success: "Fetched binned notes", notes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error fetching binned notes" });
  }
};

export const archivedNotes = async (req, res) => {
    try {
        const { noteId, action } = req.params;
        
        let updateValue;
        let successMessage;
        
        if (action === "isArchived") {
            updateValue = { isArchived: true };
            successMessage = "Archived";
        } else if (action === "notArchived") {
            updateValue = { isArchived: false };
            successMessage = "UnArchived";
        } else {
            return res.send({ message: "Invalid action parameter" });
        }
        
        await notesModel.updateOne({ _id: noteId }, { $set: updateValue });
        return res.status(200).send({ success: successMessage });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error while Pinning note" });
    }
};

// export const manageNotes = async (req, res) => {
//   try {
//     const { noteId, action } = req.params;

//     let updateValue;
//     let successMessage;

//     if (action === "toBin") {
//       updateValue = { isBinned: true, isArchived: false };
//       successMessage = "Trashed Success";
//     } else if (action === "toNotes") {
//       updateValue = { isBinned: false, isArchived: false };
//       successMessage = "Restored Success";
//     } else {
//       return res.send({ message: "Invalid action parameter" });
//     }

//     await notesModel.updateOne({ _id: noteId }, { $set: updateValue });
//     return res.status(200).send({ success: successMessage });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "Error on moving to bin or restoring" });
//   }
// };

// export const editNote = async (req, res) => {
//   try {
//     const { user, noteId } = req.params;
//     const { title, description, theme, collaborators, isPublic } = req.body;
//     await notesModel.findByIdAndUpdate(noteId, {
//       $set: { title, description: description, theme, collaborators, isPublic },
//     });
//     return res.status(200).send({ success: "Successfully updated!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "Error while fetching note" });
//   }
// };

// export const fetchCollabedNotes = async (req, res) => {
//   try {
//     const { user } = req.params;
//     const notes = await notesModel.find({ collaborators: user });
//     return res.status(200).send(notes);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "Error while fetching collabed notes" });
//   }
// };

// export const fetchSharedNote = async (req, res) => {
//   try {
//     const { noteId } = req.params;
//     if (!/^[0-9a-fA-F]{24}$/.test(noteId))
//       return res.status(400).send({ message: "Invalid link" });
//     const {
//       Types: { ObjectId },
//     } = mongoose;
//     const objectId = new ObjectId(noteId);
//     const note = await notesModel.findById(new ObjectId(noteId));
//     if (!note) {
//       return res.status(404).send({ message: "Note not found" });
//     }
//     if (note.isPublic === false) {
//       return res.status(404).send({ message: "This is a private note" });
//     }
//     return res.status(200).send(note);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "Error while fetching shared note" });
//   }
// };

export const setReminder = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { timestamp } = req.body;
    console.log(noteId, timestamp);
    await notesModel.findByIdAndUpdate(noteId, { reminder: timestamp });
    return res.status(200).send({ message: "Set reminder successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error while setting reminder" });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { noteId } = req.params;
    await notesModel.findByIdAndUpdate(noteId, { $unset: { reminder: 1 } });
    return res.status(200).send({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error while deleting reminder" });
  }
};
