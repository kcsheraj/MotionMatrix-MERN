import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedDate, setSelectedDate] = useState(null);
  const [persistedDates, setPersistedDates] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchPersistedDates();
    }
  }, [currentUser]);

  const fetchPersistedDates = async () => {
    try {
      const res = await fetch("/api/calendar", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      const dates = data.map((date) => date.date);
      setPersistedDates(dates);
    } catch (error) {
      console.error("Failed to fetch persisted dates", error);
    }
  };

  const handleAddDate = async (dateStr) => {
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ date: dateStr }),
      });
      const data = await res.json();
      setPersistedDates((prevDates) => [...prevDates, data.date]);
    } catch (error) {
      console.error("Failed to add date", error);
    }
  };

  const handleDeleteDate = async (dateStr) => {
    try {
      await fetch(`/api/calendar/${dateStr}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setPersistedDates((prevDates) => {
        const updatedDates = prevDates.filter((d) => d !== dateStr);
        if (updatedDates.length !== prevDates.length) {
          window.location.reload(); // Refresh the page only if a date is removed
        }
        return updatedDates;
      });
    } catch (error) {
      console.error("Failed to delete date", error);
    }
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    if (persistedDates.includes(dateStr)) {
      return "react-calendar__tile--active";
    }
    return null;
  };

  const onClickDay = async (value) => {
    const dateStr = value.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    if (persistedDates.includes(dateStr)) {
      await handleDeleteDate(dateStr);
    } else {
      await handleAddDate(dateStr);
    }
    setSelectedDate(value);
  };

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        {currentUser ? `${currentUser.username}'s Calendar` : "Calendar"}
      </h1>
      <Calendar tileClassName={tileClassName} onClickDay={onClickDay} />
    </div>
  );
}
