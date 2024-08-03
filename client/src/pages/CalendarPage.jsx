import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedDate, setSelectedDate] = useState(null);
  const [persistedDates, setPersistedDates] = useState([]);
  const [note, setNote] = useState("");
  const [noteExists, setNoteExists] = useState(false);
  const [glow, setGlow] = useState(false);

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
      setPersistedDates(data); // Store the full date objects including notes
    } catch (error) {
      console.error("Failed to fetch persisted dates", error);
    }
  };

  const handleToggleDate = async () => {
    const dateStr = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    if (persistedDates.some((d) => d.date === dateStr)) {
      await handleDeleteDate(dateStr);
    } else {
      await handleAddDate(dateStr);
    }
    setSelectedDate(selectedDate); // Ensure the selected date remains the same after toggling
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
      setPersistedDates((prevDates) => [...prevDates, data]);
      setNoteExists(true); // Assume adding a note immediately after toggling
      setNote(""); // Clear the note field
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
      setPersistedDates((prevDates) =>
        prevDates.filter((d) => d.date !== dateStr)
      );
      setSelectedDate(null); // Clear the selected date
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Failed to delete date", error);
    }
  };

  const handleAddNote = async () => {
    const dateStr = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    try {
      const res = await fetch("/api/calendar/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ date: dateStr, note }),
      });
      const data = await res.json();
      setPersistedDates((prevDates) =>
        prevDates.map((d) =>
          d.date === dateStr ? { ...d, note: data.note } : d
        )
      );
      setNoteExists(true);
      setGlow(true);
      setTimeout(() => setGlow(false), 1000); // Remove the glow after 1 second
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  const handleDeleteNote = async () => {
    const dateStr = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    try {
      await fetch(`/api/calendar/note/${dateStr}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setNote("");
      setNoteExists(false);
      setPersistedDates((prevDates) =>
        prevDates.map((d) => (d.date === dateStr ? { ...d, note: "" } : d))
      );
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    if (persistedDates.some((d) => d.date === dateStr)) {
      return "react-calendar__tile--active";
    }
    return "react-calendar__tile--default";
  };

  const onClickDay = (value) => {
    setSelectedDate(value);
    const dateStr = value.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    const dateObj = persistedDates.find((d) => d.date === dateStr);
    if (dateObj) {
      setNoteExists(true);
      setNote(dateObj.note || "");
    } else {
      setNoteExists(false);
      setNote("");
    }
  };

  const isDatePersisted = () => {
    const dateStr = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : null;
    return dateStr && persistedDates.some((d) => d.date === dateStr);
  };

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        {currentUser ? `${currentUser.username}'s Calendar` : "Calendar"}
      </h1>
      <div className="flex justify-center">
        <Calendar
          tileClassName={tileClassName}
          onClickDay={onClickDay}
          className="react-calendar modern-calendar"
        />
      </div>
      {selectedDate && (
        <div className="text-center mt-4">
          <button
            onClick={handleToggleDate}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg mr-2"
          >
            Toggle Date
          </button>
          {isDatePersisted() && (
            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border rounded-lg p-4 w-full mt-2 bg-slate-100 text-lg"
                placeholder="Add a note..."
              />
              <button
                onClick={handleAddNote}
                className={`bg-slate-700 text-white px-4 py-2 rounded-lg mt-2 ${
                  glow ? "glow" : ""
                }`}
              >
                Save Note
              </button>
              <button
                onClick={handleDeleteNote}
                className="bg-red-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                Delete Note
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`
        .modern-calendar {
          border-radius: 1rem; /* Increased border-radius for a modern look */
          border: 1px solid #4f5b62; /* Gray border for the calendar */
          font-family: 'Helvetica Neue', sans-serif; /* Modern font */
          font-size: 1.25rem; /* Larger font size */
          width: 100%; /* Full width */
          max-width: 800px; /* Max width for the calendar */
        }
        .react-calendar__tile--active {
          background-color: #4f5b62; /* Gray background for active dates */
          color: #ffffff; /* White text for active dates */
          border-radius: 0.5rem; /* Keep rounded corners */
        }
        .react-calendar__tile--default {
          border-radius: 0.5rem; /* Keep rounded corners */
        }
        .react-calendar__month-view__days {
          font-size: 1.25rem; /* Larger font size for day names */
        }
        .react-calendar__month-view__days__day {
          height: 3rem; /* Larger day tile height */
          width: 3rem; /* Larger day tile width */
          margin: 0.25rem; /* Padding between day tiles */
        }
        .react-calendar__month-view__weekdays {
          font-size: 1.125rem; /* Adjusted font size for weekdays */
        }
        .react-calendar__month-view__weekdays__weekday {
          height: 3rem; /* Larger weekday tile height */
          width: 3rem; /* Larger weekday tile width */
        }
        .react-calendar {
          border-radius: 1rem; /* Ensure rounded corners */
        }
        .glow {
          animation: glow 1s ease-in-out;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px #32cd32;
          }
          50% {
            box-shadow: 0 0 20px #32cd32;
          }
           100% {
            box-shadow: 0 0 5px #32cd32;
          }
        }
      `}</style>
    </div>
  );
}
