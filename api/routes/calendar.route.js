import express from "express";
import {
  addDate,
  getDates,
  deleteDate,
} from "../controllers/calendar.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getDates);
router.post("/", verifyToken, addDate);
router.delete("/:date", verifyToken, deleteDate);

export default router;
