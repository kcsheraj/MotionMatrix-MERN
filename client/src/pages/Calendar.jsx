import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Calendar() {
  const { currentUser } = useSelector((state) => state.user);
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchRoutines();
    }
  }, [currentUser]);

  const fetchRoutines = async () => {
    try {
      const res = await fetch("/api/routine", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      setRoutines(data);
    } catch (error) {
      console.error("Failed to fetch routines", error);
    }
  };

  const handleAddRoutine = async () => {
    if (!newRoutine) return;

    try {
      const res = await fetch("/api/routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ text: newRoutine }),
      });
      const data = await res.json();
      setRoutines([...routines, data]);
      setNewRoutine("");
    } catch (error) {
      console.error("Failed to add routine", error);
    }
  };

  const handleDeleteRoutine = async (id) => {
    try {
      await fetch(`/api/routine/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setRoutines(routines.filter((routine) => routine._id !== id));
    } catch (error) {
      console.error("Failed to delete routine", error);
    }
  };

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        {currentUser ? `${currentUser.username}'s Calendar` : "Calendar"}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={newRoutine}
          onChange={(e) => setNewRoutine(e.target.value)}
          placeholder="Add a new routine"
          className="bg-slate-100 rounded-lg p-3 w-full"
        />
        <button
          onClick={handleAddRoutine}
          className="bg-slate-700 text-white p-3 rounded-lg mt-2 w-full"
        >
          Add Routine
        </button>
      </div>
      <ul className="list-disc pl-5">
        {routines.map((routine) => (
          <li key={routine._id} className="mb-2">
            {routine.text}
            <button
              onClick={() => handleDeleteRoutine(routine._id)}
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
