import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function PR() {
  const { currentUser } = useSelector((state) => state.user);
  const [prs, setPRs] = useState([]);
  const [newExercise, setNewExercise] = useState("");
  const [newRecord, setNewRecord] = useState({ weight: "", date: "" });
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

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
      const adjustedDate = new Date(newRecord.date);
      adjustedDate.setMinutes(
        adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset()
      ); // Adjust for timezone

      const res = await fetch(`/api/pr/${exerciseId}/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          weight: newRecord.weight,
          date: adjustedDate.toISOString(),
        }),
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCurrentPR = (records) => {
    if (records.length === 0) return "No PR yet";
    const maxRecord = records.reduce((max, record) =>
      record.weight > max.weight ? record : max
    );
    return `${maxRecord.weight} lbs on ${formatDate(maxRecord.date)}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="px-4 py-12 max-w-7xl w-full">
        <h1
          className="text-4xl font-extrabold mb-10 text-gray-900 text-center cursor-pointer"
          onClick={handleTitleClick}
        >
          PR's
        </h1>
        <div className="mb-4 flex flex-col gap-4 items-center">
          {showAddExercise ? (
            <>
              <input
                type="text"
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                placeholder="Add a new exercise"
                className="bg-white rounded-lg p-3 w-full max-w-md border border-gray-300 shadow-md"
              />
              <button
                onClick={handleAddExercise}
                className="bg-gray-800 text-white p-3 rounded-lg mt-2 w-full max-w-md transition-transform transform hover:scale-105"
              >
                Add Exercise
              </button>
            </>
          ) : (
            <button
              onClick={handleAddExerciseClick}
              className="bg-gray-800 text-white p-3 rounded-lg mt-2 w-full max-w-md transition-transform transform hover:scale-105"
            >
              Add New Exercise
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prs.map((pr) => (
            <div
              key={pr._id}
              className={`bg-white p-4 rounded-lg border border-gray-300 ${
                selectedExercise === pr._id ? "border-4 border-gray-800" : ""
              } shadow-lg transition-transform transform hover:scale-105`}
            >
              <h2
                className="text-lg text-gray-800 text-center cursor-pointer"
                onClick={() => handleExerciseTitleClick(pr._id)}
              >
                {pr.exercise}
              </h2>
              <p className="text-blue-600 text-center mb-2">
                {getCurrentPR(pr.records)}
              </p>
              <ul
                className={`list-disc pl-5 mt-2 ${
                  pr.records.length > 5 ? "max-h-64 overflow-y-auto" : ""
                }`}
              >
                {pr.records
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort records by date in descending order
                  .map((record) => (
                    <li
                      key={record._id}
                      className="mb-2 flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-md"
                    >
                      <span className="flex-1 break-words text-gray-800">
                        {record.weight} lbs - {formatDate(record.date)}
                      </span>
                      {selectedExercise === pr._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click event from affecting the parent div
                            handleDeleteRecord(pr._id, record._id);
                          }}
                          className="bg-red-500 text-white p-2 rounded-lg"
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
                    className="bg-white rounded-lg p-3 w-full mb-2 border border-gray-300"
                  />
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, date: e.target.value })
                    }
                    className="bg-white rounded-lg p-3 w-full mb-2 border border-gray-300"
                  />
                  <button
                    onClick={() => handleAddRecord(pr._id)}
                    className="bg-gray-800 text-white p-3 rounded-lg w-full mb-2 transition-transform transform hover:scale-105"
                  >
                    Add PR
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(pr._id)}
                    className="bg-red-500 text-white p-3 rounded-lg w-full transition-transform transform hover:scale-105"
                  >
                    Delete Exercise
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
