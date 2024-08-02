import mongoose from "mongoose";

const calendarDateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      default: "", // Add a note field
    },
  },
  { timestamps: true }
);

const CalendarDate = mongoose.model("CalendarDate", calendarDateSchema);

export default CalendarDate;
