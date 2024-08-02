import ToDo from "../models/todo.model.js";
import { errorHandler } from "../utils/error.js";

export const addTodo = async (req, res, next) => {
  try {
    const newTodo = new ToDo({
      userId: req.user.id,
      text: req.body.text,
    });
    const savedTodo = await newTodo.save();
    res.status(200).json(savedTodo);
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (req, res, next) => {
  try {
    const todos = await ToDo.find({ userId: req.user.id });
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    if (todo.userId.toString() !== req.user.id) {
      return next(errorHandler(401, "You can delete only your own to-do!"));
    }
    await todo.deleteOne();
    res.status(200).json("To-do has been deleted...");
  } catch (error) {
    next(error);
  }
};
