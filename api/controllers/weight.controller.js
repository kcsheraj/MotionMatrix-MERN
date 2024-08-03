// controllers/weight.controller.js
import Weight from "../models/weight.model.js";
import { errorHandler } from "../utils/error.js";

export const addWeight = async (req, res, next) => {
  try {
    const newWeight = new Weight({
      userId: req.user.id,
      weight: req.body.weight,
      date: new Date(req.body.date),
    });
    const savedWeight = await newWeight.save();
    res.status(200).json(savedWeight);
  } catch (error) {
    next(error);
  }
};

export const getWeights = async (req, res, next) => {
  try {
    const weights = await Weight.find({ userId: req.user.id }).sort({
      date: 1,
    });
    res.status(200).json(weights);
  } catch (error) {
    next(error);
  }
};

export const deleteWeight = async (req, res, next) => {
  try {
    const weight = await Weight.findById(req.params.id);
    if (weight.userId.toString() !== req.user.id) {
      return next(
        errorHandler(401, "You can delete only your own weight record!")
      );
    }
    await weight.deleteOne();
    res.status(200).json("Weight record has been deleted...");
  } catch (error) {
    next(error);
  }
};
