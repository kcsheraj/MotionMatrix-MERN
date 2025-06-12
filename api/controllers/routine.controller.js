import Routine from "../models/routine.model.js";
import { errorHandler } from "../utils/error.js";

export const addRoutine = async (req, res, next) => {
  try {
    const newRoutine = new Routine({
      userId: req.user.id,
      dayOfWeek: req.body.dayOfWeek,
      text: req.body.text,
    });
    const savedRoutine = await newRoutine.save();
    res.status(200).json(savedRoutine);
  } catch (error) {
    next(error);
  }
};

export const getRoutines = async (req, res, next) => {
  try {
    const routines = await Routine.find({ userId: req.user.id }).sort({
      dayOfWeek: 1,
      order: 1,
    });
    res.status(200).json(routines);
  } catch (error) {
    next(error);
  }
};

export const deleteRoutine = async (req, res, next) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (routine.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "You can delete only your own routine!"));
    }
    await routine.deleteOne();
    res.status(200).json("Routine has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const updateRoutineOrder = async (req, res, next) => {
  try {
    const { routines } = req.body; // Array of {_id, order}
    for (const r of routines) {
      await Routine.findByIdAndUpdate(r._id, { order: r.order });
    }
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    next(error);
  }
};
