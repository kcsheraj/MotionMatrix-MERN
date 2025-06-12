import Pic from "../models/pic.model.js";
import { errorHandler } from "../utils/error.js";

export const addPic = async (req, res, next) => {
  try {
    const newPic = new Pic({
      userId: req.user.id,
      url: req.body.url,
    });
    const savedPic = await newPic.save();
    res.status(200).json(savedPic);
  } catch (error) {
    next(error);
  }
};

export const getPics = async (req, res, next) => {
  try {
    const pics = await Pic.find({ userId: req.user.id }).sort({ addedAt: 1 });
    res.status(200).json(pics);
  } catch (error) {
    next(error);
  }
};

export const deletePic = async (req, res, next) => {
  try {
    const pic = await Pic.findById(req.params.id);
    if (!pic || pic.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "Unauthorized"));
    }
    await pic.deleteOne();
    res.status(200).json("Pic deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePic = async (req, res, next) => {
  try {
    const pic = await Pic.findById(req.params.id);
    if (!pic || pic.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (req.body.addedAt) {
      pic.addedAt = req.body.addedAt;
    }
    await pic.save();
    res.status(200).json(pic);
  } catch (error) {
    next(error);
  }
};
