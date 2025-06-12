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
      setPersistedDates(data);
    } catch (error) {
      console.error("Failed to fetch persisted dates", error);
    }
  };

  const handleToggleDate = async () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    if (persistedDates.some((d) => d.date === dateStr)) {
      await handleDeleteDate(dateStr);
    } else {
      await handleAddDate(dateStr);
    }
    setSelectedDate(selectedDate);
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
      setNoteExists(true);
      setNote("");
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
      setSelectedDate(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete date", error);
    }
  };

  const handleAddNote = async () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
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
      setTimeout(() => setGlow(false), 1000);
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  const handleDeleteNote = async () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
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
    const dateStr = date.toISOString().split("T")[0];
    return persistedDates.some((d) => d.date === dateStr)
      ? "react-calendar__tile--active"
      : "react-calendar__tile--default";
  };

  const onClickDay = (value) => {
    setSelectedDate(value);
    const dateStr = value.toISOString().split("T")[0];
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="px-4 py-12 max-w-7xl w-full bg-white/60 backdrop-blur-md rounded-lg shadow-lg border border-white/30">
        <h1 className="text-4xl font-extrabold mb-10 text-slate-800 text-center">
          Calendar
        </h1>
        <div className="flex justify-center mb-6">
          <Calendar
            tileClassName={tileClassName}
            onClickDay={onClickDay}
            className="react-calendar modern-calendar"
          />
        </div>
        {selectedDate && (
          <div className="text-center">
            <button
              onClick={handleToggleDate}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              Toggle Date
            </button>
            {isDatePersisted() && (
              <div className="mt-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border rounded-lg p-4 w-full mt-2 bg-white/80 text-lg shadow-md resize-none"
                  placeholder="Add a note..."
                />
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    onClick={handleAddNote}
                    className={`bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${
                      glow ? "glow" : ""
                    }`}
                  >
                    Save Note
                  </button>
                  <button
                    onClick={handleDeleteNote}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                  >
                    Delete Note
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        .modern-calendar {
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 1.25rem;
          width: 100%;
          max-width: 800px;
        }

        .react-calendar__tile {
          border: 1.5px solid #d1d5db !important; /* Add border to each date */
          border-radius: 0.5rem;
          background: #fff;
          transition: border-color 0.2s;
        }
        .react-calendar__tile--active {
          background-color: #4f5b62;
          color: #ffffff;
          border-radius: 0.5rem;
          border: 2px solid #4f5b62 !important; /* Highlight border for active */
        }
        .react-calendar__tile--default {
          border-radius: 0.5rem;
        }
        .react-calendar__tile:focus {
          outline: none;
          border-color: #6366f1 !important; /* Indigo border on focus */
        }
        .react-calendar__month-view__days {
          font-size: 1.25rem;
        }
        .react-calendar__month-view__days__day {
          height: 3rem;
          width: 3rem;
        }
        .react-calendar__month-view__weekdays {
          font-size: 1.125rem;
          color: #888888;
        }
        .react-calendar {
          border-radius: 1rem;
        }
        .glow {
          animation: glow 1s ease-in-out;
        }
        @keyframes glow {
          0% {
            box-shadow: 0 0 8px rgba(50, 205, 50, 0.6);
          }
          50% {
            box-shadow: 0 0 20px rgba(50, 205, 50, 0.8);
          }
          100% {
            box-shadow: 0 0 8px rgba(50, 205, 50, 0.6);
          }
        }
      `}</style>
    </div>
  );
}
