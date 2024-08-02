import CalendarDate from "../models/calendarDate.model.js";

export const getDates = async (req, res, next) => {
  try {
    const dates = await CalendarDate.find({ userId: req.user.id });
    res.status(200).json(dates);
  } catch (error) {
    next(error);
  }
};

export const addDate = async (req, res, next) => {
  try {
    const { date } = req.body;
    const newDate = new CalendarDate({ date, userId: req.user.id });
    await newDate.save();
    res.status(201).json(newDate);
  } catch (error) {
    next(error);
  }
};

export const deleteDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    await CalendarDate.findOneAndDelete({ date, userId: req.user.id });
    res.status(200).json({ message: "Date deleted successfully" });
  } catch (error) {
    next(error);
  }
};
