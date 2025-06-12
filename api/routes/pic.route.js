import express from "express";
import {
  addPic,
  getPics,
  deletePic,
  updatePic,
} from "../controllers/pic.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, addPic);
router.get("/", verifyToken, getPics);
router.delete("/:id", verifyToken, deletePic);
router.patch("/:id", verifyToken, updatePic);

export default router;
