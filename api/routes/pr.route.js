// routes/pr.route.js
import express from "express";
import {
  addPRExercise,
  addPRRecord,
  getPRs,
  deletePRExercise,
  deletePRRecord,
} from "../controllers/pr.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, addPRExercise);
router.post("/:id/record", verifyToken, addPRRecord);
router.get("/", verifyToken, getPRs);
router.delete("/:id", verifyToken, deletePRExercise);
router.delete("/:id/record/:recordId", verifyToken, deletePRRecord);

export default router;
