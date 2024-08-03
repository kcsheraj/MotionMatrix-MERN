// models/routine.model.js
import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Routine = mongoose.model("Routine", routineSchema);

export default Routine;
