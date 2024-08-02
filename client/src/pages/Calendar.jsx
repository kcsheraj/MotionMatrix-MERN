import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Calendar() {
  const { currentUser } = useSelector((state) => state.user);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    }
  }, [currentUser]);

  const fetchTodos = async () => {
    const res = await fetch("/api/user/todo", {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    const data = await res.json();
    setTodos(data);
  };

  const handleAddTodo = async () => {
    if (!newTodo) return;

    const res = await fetch("/api/user/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ text: newTodo }),
    });

    const data = await res.json();
    setTodos([...todos, data]);
    setNewTodo("");
  };

  const handleDeleteTodo = async (id) => {
    await fetch(`/api/user/todo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        {currentUser ? `${currentUser.username}'s Calendar` : "Calendar"}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new to-do"
          className="bg-slate-100 rounded-lg p-3 w-full"
        />
        <button
          onClick={handleAddTodo}
          className="bg-slate-700 text-white p-3 rounded-lg mt-2 w-full"
        >
          Add To-do
        </button>
      </div>
      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo._id} className="mb-2">
            {todo.text}
            <button
              onClick={() => handleDeleteTodo(todo._id)}
              className="bg-red-500 text-white ml-4 p-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
