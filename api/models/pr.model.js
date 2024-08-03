// models/pr.model.js
import mongoose from "mongoose";

const prSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercise: {
      type: String,
      required: true,
    },
    records: [
      {
        weight: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const PR = mongoose.model("PR", prSchema);

export default PR;
