// routes/weight.route.js
import express from "express";
import {
  addWeight,
  getWeights,
  deleteWeight,
} from "../controllers/weight.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, addWeight);
router.get("/", verifyToken, getWeights);
router.delete("/:id", verifyToken, deleteWeight);

export default router;
