import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Weight() {
  const { currentUser } = useSelector((state) => state.user);
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState("");
  const [date, setDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [weightChange, setWeightChange] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchWeights();
    }
  }, [currentUser]);

  const fetchWeights = async () => {
    try {
      const res = await fetch("/api/weight", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      setWeights(sortByDateAscending(data));
    } catch (error) {
      console.error("Failed to fetch weights", error);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || !date) return;

    try {
      const res = await fetch("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ weight: newWeight, date }),
      });
      const data = await res.json();
      setWeights(sortByDateAscending([...weights, data]));
      setNewWeight("");
      setDate("");
    } catch (error) {
      console.error("Failed to add weight", error);
    }
  };

  const handleDeleteWeight = async (id) => {
    try {
      await fetch(`/api/weight/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setWeights(
        sortByDateAscending(weights.filter((weight) => weight._id !== id))
      );
    } catch (error) {
      console.error("Failed to delete weight", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const sortByDateAscending = (data) => {
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const sortByDateDescending = (data) => {
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleFilterChange = (filterFunc, value) => {
    filterFunc(value);
  };

  const handleClearFilters = () => {
    setFilterMonth("");
    setFilterYear("");
    setWeightChange(null);
  };

  const filteredWeights = weights.filter((weight) => {
    const weightDate = new Date(weight.date);
    const weightMonth = weightDate.getMonth();
    const weightYear = weightDate.getFullYear();
    const isMonthMatch = filterMonth
      ? weightMonth === parseInt(filterMonth)
      : true;
    const isYearMatch = filterYear ? weightYear === parseInt(filterYear) : true;
    return isMonthMatch && isYearMatch;
  });

  useEffect(() => {
    if (filteredWeights.length > 1) {
      const firstWeight = filteredWeights[0].weight;
      const lastWeight = filteredWeights[filteredWeights.length - 1].weight;
      setWeightChange(lastWeight - firstWeight);
    } else {
      setWeightChange(null);
    }
  }, [filteredWeights]);

  const weightsDescForGraph = sortByDateDescending(filteredWeights);
  const weightsAscForList = sortByDateAscending(filteredWeights);

  const data = {
    labels: weightsDescForGraph.map((w) => formatDate(w.date)),
    datasets: [
      {
        label: "Weight (lbs)",
        data: weightsDescForGraph.map((w) => w.weight),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const months = [
    { value: "", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const years = [
    ...new Set(weights.map((weight) => new Date(weight.date).getFullYear())),
  ];

  const weightChangeTextColor =
    weightChange >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        Weight
      </h1>
      <div className="mb-4 flex flex-col gap-4">
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Enter weight in lbs"
          className="bg-slate-100 rounded-lg p-3 w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-slate-100 rounded-lg p-3 w-full"
        />
        <button
          onClick={handleAddWeight}
          className="bg-slate-700 text-white p-3 rounded-lg mt-2 w-full"
        >
          Add Weight
        </button>
      </div>
      <div className="mb-8">
        <Line
          data={data}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <select
          value={filterMonth}
          onChange={(e) => handleFilterChange(setFilterMonth, e.target.value)}
          className="bg-slate-100 rounded-lg p-3 w-full md:w-1/2"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => handleFilterChange(setFilterYear, e.target.value)}
          className="bg-slate-100 rounded-lg p-3 w-full md:w-1/2"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={handleClearFilters}
          className="bg-slate-700 text-white p-3 rounded-lg mt-2 w-full md:w-auto"
        >
          Clear Filters
        </button>
      </div>
      {weightChange !== null && (
        <div className="mb-4 text-center">
          <p className={`text-lg font-semibold ${weightChangeTextColor}`}>
            Total Weight {weightChange >= 0 ? "Gained" : "Lost"}:{" "}
            {Math.abs(weightChange)} lbs
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {weightsAscForList.map((weight) => (
          <div
            key={weight._id}
            className="flex justify-between items-center bg-gray-200 p-4 rounded-lg"
          >
            <span>
              {formatDate(weight.date)}: {weight.weight} lbs
            </span>
            <button
              onClick={() => handleDeleteWeight(weight._id)}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
