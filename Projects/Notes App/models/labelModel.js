import mongoose from "mongoose";

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Label = mongoose.model("Label", labelSchema);

export default Label;
