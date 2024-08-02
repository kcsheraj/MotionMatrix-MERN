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
  },
  { timestamps: true }
);

const CalendarDate = mongoose.model("CalendarDate", calendarDateSchema);

export default CalendarDate;
