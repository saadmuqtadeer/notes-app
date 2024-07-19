import mongoose from "mongoose";

const arrayLimit = (val) => {
  return val.length <= 9;
};

const notesSchema = new mongoose.Schema(
  {
    title: String,
    description: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: "white",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    reminder: Date,
    isBinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label",
        validate: [arrayLimit, "{PATH} exceeds the limit of 9"],
      },
    ],
    deletedAt: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    collaborators: {
      type: Array,
    },
  },
  { timestamps: true }
);

const notesModel = mongoose.model("Note", notesSchema);

export default notesModel;
