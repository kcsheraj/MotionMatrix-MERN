import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkoutRoutine() {
  const { currentUser } = useSelector((state) => state.user);
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ dayOfWeek: "", text: "" });
  const [selectedDay, setSelectedDay] = useState("");

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
    if (!newRoutine.dayOfWeek || !newRoutine.text) return;

    try {
      const res = await fetch("/api/routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(newRoutine),
      });
      const data = await res.json();
      setRoutines([...routines, data]);
      setNewRoutine({ dayOfWeek: "", text: "" });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoutine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayClick = (day) => {
    setSelectedDay(selectedDay === day ? "" : day);
  };

  const handleBulletClick = (routine) => {
    handleDeleteRoutine(routine._id);
    setSelectedDay("");
  };

  const groupedRoutines = routines.reduce((acc, routine) => {
    (acc[routine.dayOfWeek] = acc[routine.dayOfWeek] || []).push(routine);
    return acc;
  }, {});

  const persistOrder = async (day, routinesForDay) => {
    try {
      await fetch("/api/routine/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          routines: routinesForDay.map((r, idx) => ({
            _id: r._id,
            order: idx,
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to persist order", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;

    // Clone routines for both days
    const sourceRoutines = Array.from(groupedRoutines[sourceDay] || []);
    const destRoutines = Array.from(groupedRoutines[destDay] || []);

    // Moving within the same day
    if (sourceDay === destDay) {
      const [removed] = sourceRoutines.splice(source.index, 1);
      sourceRoutines.splice(destination.index, 0, removed);

      setRoutines((prev) => {
        const filtered = prev.filter((r) => r.dayOfWeek !== sourceDay);
        const updated = [...filtered, ...sourceRoutines];
        persistOrder(sourceDay, sourceRoutines);
        return updated;
      });
    } else {
      // Moving between days
      const [removed] = sourceRoutines.splice(source.index, 1);
      removed.dayOfWeek = destDay;
      destRoutines.splice(destination.index, 0, removed);

      setRoutines((prev) => {
        const filtered = prev.filter(
          (r) => r.dayOfWeek !== sourceDay && r.dayOfWeek !== destDay
        );
        const updated = [...filtered, ...sourceRoutines, ...destRoutines];
        persistOrder(sourceDay, sourceRoutines);
        persistOrder(destDay, destRoutines);
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <div className="px-4 py-12 max-w-7xl w-full">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
          Workout Routine
        </h1>
        <div className="mb-4 flex flex-col gap-4 items-center">
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <select
              name="dayOfWeek"
              value={newRoutine.dayOfWeek}
              onChange={handleInputChange}
              className="bg-white rounded-lg p-3 w-full border border-gray-300 mb-2"
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="text"
              value={newRoutine.text}
              onChange={handleInputChange}
              placeholder="Add a new workout"
              className="bg-white rounded-lg p-3 w-full border border-gray-300 mb-2"
            />
            <button
              onClick={handleAddRoutine}
              className="bg-gray-800 text-white p-3 rounded-lg w-full transition-transform transform hover:scale-105"
            >
              Add Workout
            </button>
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`bg-white p-4 rounded-lg border border-gray-300 ${
                  selectedDay === day ? "border-4 border-gray-800" : ""
                } shadow-lg transition-transform transform hover:scale-105`}
                onClick={() => handleDayClick(day)}
              >
                <h2 className="text-lg text-gray-800 text-center">{day}</h2>
                <Droppable droppableId={day}>
                  {(provided) => (
                    <ul
                      className="list-disc pl-5 mt-2"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {(groupedRoutines[day] || []).map((routine, idx) => (
                        <Draggable
                          key={routine._id}
                          draggableId={routine._id}
                          index={idx}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-md ${
                                selectedDay === day
                                  ? "bg-gray-100 border-2 border-red-500"
                                  : ""
                              } ${snapshot.isDragging ? "bg-yellow-100" : ""}`}
                              onClick={() =>
                                selectedDay === day &&
                                handleBulletClick(routine)
                              }
                            >
                              <span className="flex-1 break-words text-gray-800">
                                {routine.text}
                              </span>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
