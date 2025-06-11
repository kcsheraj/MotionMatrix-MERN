import express from "express";
import {
  signin,
  signup,
  google,
  signout,
  verifyToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.get("/verify", verifyToken, (req, res) => {
  return res.status(200).json({ message: "Token is valid" });
});

export default router;
