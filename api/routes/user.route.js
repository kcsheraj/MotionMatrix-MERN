import express from "express";
import {
  test,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  addTodo,
  getTodos,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

router.post("/todo", verifyToken, addTodo);
router.get("/todo", verifyToken, getTodos);
router.delete("/todo/:id", verifyToken, deleteTodo);

export default router;
