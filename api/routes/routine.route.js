import express from "express";
import {
  addRoutine,
  getRoutines,
  deleteRoutine,
} from "../controllers/routine.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, addRoutine);
router.get("/", verifyToken, getRoutines);
router.delete("/:id", verifyToken, deleteRoutine);

export default router;
