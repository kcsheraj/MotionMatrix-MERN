import Routine from "../models/routine.model.js";
import { errorHandler } from "../utils/error.js";

export const addRoutine = async (req, res, next) => {
  try {
    const newRoutine = new Routine({
      userId: req.user.id,
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
    const routines = await Routine.find({ userId: req.user.id });
    res.status(200).json(routines);
  } catch (error) {
    next(error);
  }
};

export const deleteRoutine = async (req, res, next) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (routine.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "You can delete only your own to-do!"));
    }
    await routine.deleteOne();
    res.status(200).json("To-do has been deleted...");
  } catch (error) {
    next(error);
  }
};
