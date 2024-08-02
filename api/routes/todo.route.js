import express from "express";
import {
  addTodo,
  getTodos,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, addTodo);
router.get("/", verifyToken, getTodos);
router.delete("/:id", verifyToken, deleteTodo);

export default router;
