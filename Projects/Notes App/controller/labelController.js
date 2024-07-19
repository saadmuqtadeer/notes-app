import mongoose from "mongoose";
import Label from "../models/labelModel.js";
import Note from "../models/notesModel.js";

export const createLabel = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;
    const existingLabel = await Label.findOne({ name, user: userId });
    if (existingLabel) {
      return res
        .status(400)
        .send({ error: "Label name already exists for this user" });
    }
    const newLabel = new Label({ name, user: userId });
    await newLabel.save();

    return res
      .status(201)
      .send({ success: "Label created successfully", label: newLabel });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error creating label" });
  }
};

export const getNotesByLabel = async (req, res) => {
  try {
    const { labelId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(labelId)) {
      return res.status(400).send({ error: "Invalid Label ID" });
    }

    const label = await Label.findOne({ _id: labelId, user: userId });
    if (!label) {
      return res.status(404).send({ error: "Label not found" });
    }
    const notes = await Note.find({ labels: labelId, user: userId }).populate(
      "labels"
    );

    return res.status(200).send({ success: "Got Notes by Label", notes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error fetching notes by label" });
  }
};

export const updateLabelName = async (req, res) => {
  try {
    const { labelId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(labelId)) {
      return res.status(400).send({ error: "Invalid Label ID" });
    }
    const updatedLabel = await Label.findOneAndUpdate(
      { _id: labelId, user: userId },
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedLabel) {
      return res
        .status(404)
        .send({ error: "Label not found or not owned by user" });
    }
    return res
      .status(200)
      .send({ success: "Label updated successfully", label: updatedLabel });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error updating label" });
  }
};

export const deleteLabel = async (req, res) => {
  try {
    const { labelId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(labelId)) {
      return res.status(400).send({ error: "Invalid Label ID" });
    }
    const deletedLabel = await Label.findOneAndDelete({
      _id: labelId,
      user: userId,
    });

    if (!deletedLabel) {
      return res
        .status(404)
        .send({ error: "Label not found or not owned by user" });
    }

    await Note.updateMany({ labels: labelId }, { $pull: { labels: labelId } });

    return res.status(200).send({ success: "Label deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error deleting label" });
  }
};

export const getAllLabels = async (req, res) => {
  try {
    const userId = req.user._id; 
    const labels = await Label.find({ user: userId });

    return res
      .status(200)
      .send({ success: "Labels retrieved successfully", labels });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error fetching labels" });
  }
};
