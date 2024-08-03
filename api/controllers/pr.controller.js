// controllers/pr.controller.js
import PR from "../models/pr.model.js";
import { errorHandler } from "../utils/error.js";

export const addPRExercise = async (req, res, next) => {
  try {
    const newPR = new PR({
      userId: req.user.id,
      exercise: req.body.exercise,
    });
    const savedPR = await newPR.save();
    res.status(200).json(savedPR);
  } catch (error) {
    next(error);
  }
};

export const addPRRecord = async (req, res, next) => {
  try {
    const pr = await PR.findById(req.params.id);
    if (pr.userId.toString() !== req.user.id) {
      return next(
        errorHandler(401, "You can add records only to your own PR!")
      );
    }
    pr.records.push({ weight: req.body.weight, date: req.body.date });
    await pr.save();
    res.status(200).json(pr);
  } catch (error) {
    next(error);
  }
};

export const getPRs = async (req, res, next) => {
  try {
    const prs = await PR.find({ userId: req.user.id });
    res.status(200).json(prs);
  } catch (error) {
    next(error);
  }
};

export const deletePRExercise = async (req, res, next) => {
  try {
    const pr = await PR.findById(req.params.id);
    if (pr.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "You can delete only your own PR!"));
    }
    await pr.deleteOne();
    res.status(200).json("PR exercise has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const deletePRRecord = async (req, res, next) => {
  try {
    const pr = await PR.findById(req.params.id);
    if (pr.userId.toString() !== req.user.id) {
      return next(
        errorHandler(401, "You can delete records only from your own PR!")
      );
    }
    pr.records = pr.records.filter(
      (record) => record._id.toString() !== req.params.recordId
    );
    await pr.save();
    res.status(200).json(pr);
  } catch (error) {
    next(error);
  }
};
