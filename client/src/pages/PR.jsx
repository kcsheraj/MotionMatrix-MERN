import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function PR() {
  const { currentUser } = useSelector((state) => state.user);
  const [prs, setPRs] = useState([]);
  const [newExercise, setNewExercise] = useState("");
  const [newRecord, setNewRecord] = useState({ weight: "", date: "" });
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      fetchPRs();
    }
  }, [currentUser]);

  const fetchPRs = async () => {
    try {
      const res = await fetch("/api/pr", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      setPRs(data);
    } catch (error) {
      console.error("Failed to fetch PRs", error);
    }
  };

  const handleAddExercise = async () => {
    if (!newExercise) return;

    try {
      const res = await fetch("/api/pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ exercise: newExercise }),
      });
      const data = await res.json();
      setPRs([...prs, data]);
      setNewExercise("");
      setShowAddExercise(false);
    } catch (error) {
      console.error("Failed to add exercise", error);
    }
  };

  const handleAddRecord = async (exerciseId) => {
    if (!newRecord.weight || !newRecord.date) return;

    try {
      const res = await fetch(`/api/pr/${exerciseId}/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(newRecord),
      });
      const data = await res.json();
      setPRs(prs.map((pr) => (pr._id === exerciseId ? data : pr)));
      setNewRecord({ weight: "", date: "" });
      setSelectedExercise(null); // Close the container after adding a PR
    } catch (error) {
      console.error("Failed to add record", error);
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      await fetch(`/api/pr/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setPRs(prs.filter((pr) => pr._id !== id));
      setSelectedExercise(null);
    } catch (error) {
      console.error("Failed to delete exercise", error);
    }
  };

  const handleDeleteRecord = async (exerciseId, recordId) => {
    try {
      await fetch(`/api/pr/${exerciseId}/record/${recordId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setPRs(
        prs.map((pr) =>
          pr._id === exerciseId
            ? {
                ...pr,
                records: pr.records.filter((record) => record._id !== recordId),
              }
            : pr
        )
      );
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  };

  const handleTitleClick = () => {
    setShowAddExercise(false);
    setSelectedExercise(null);
  };

  const handleExerciseTitleClick = (prId) => {
    if (selectedExercise === prId) {
      setSelectedExercise(null);
    } else {
      setSelectedExercise(prId);
      setShowAddExercise(false); // Close the add exercise input box if an exercise title is clicked
    }
  };

  const handleAddExerciseClick = () => {
    setShowAddExercise((prevShowAddExercise) => !prevShowAddExercise);
    setSelectedExercise(null);
  };

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto" ref={containerRef}>
      <h1
        className="text-3xl font-bold mb-10 text-slate-800 text-center cursor-pointer"
        onClick={handleTitleClick}
      >
        {currentUser ? `${currentUser.username}'s PRs` : "PR's"}
      </h1>
      <div className="mb-4 flex flex-col gap-4">
        {showAddExercise ? (
          <>
            <input
              type="text"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              placeholder="Add a new exercise"
              className="bg-slate-100 rounded-lg p-3 w-full"
            />
            <button
              onClick={handleAddExercise}
              className="bg-slate-700 text-white p-3 rounded-lg mt-2 w-full"
            >
              Add Exercise
            </button>
          </>
        ) : (
          <button
            onClick={handleAddExerciseClick}
            className="bg-slate-700 text-white p-3 rounded-lg mt-2 w-full"
          >
            Add New Exercise
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {prs.map((pr) => (
          <div
            key={pr._id}
            className={`bg-gray-200 p-4 rounded-lg ${
              selectedExercise === pr._id ? "border-4 border-slate-700" : ""
            }`}
          >
            <h2
              className="text-lg font-bold text-center cursor-pointer"
              onClick={() => handleExerciseTitleClick(pr._id)}
            >
              {pr.exercise}
            </h2>
            <ul className="list-disc pl-5">
              {pr.records.map((record) => (
                <li
                  key={record._id}
                  className="mb-2 flex justify-between items-start bg-white p-2 rounded-lg"
                >
                  <span className="flex-1 break-words">
                    {record.weight} lbs -{" "}
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                  {selectedExercise === pr._id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from affecting the parent div
                        handleDeleteRecord(pr._id, record._id);
                      }}
                      className="bg-red-500 text-white p-2 rounded-lg ml-2"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {selectedExercise === pr._id && (
              <div className="mt-4">
                <input
                  type="number"
                  value={newRecord.weight}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, weight: e.target.value })
                  }
                  placeholder="Weight (lbs)"
                  className="bg-slate-100 rounded-lg p-3 w-full mb-2"
                />
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, date: e.target.value })
                  }
                  className="bg-slate-100 rounded-lg p-3 w-full mb-2"
                />
                <button
                  onClick={() => handleAddRecord(pr._id)}
                  className="bg-slate-700 text-white p-3 rounded-lg w-full"
                >
                  Add PR
                </button>
                <button
                  onClick={() => handleDeleteExercise(pr._id)}
                  className="bg-red-500 text-white p-3 rounded-lg w-full mt-2"
                >
                  Delete Exercise
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
