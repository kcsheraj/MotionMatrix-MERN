import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const cards = [
    { id: 1, title: "Calendar", path: "/calendar" },
    { id: 2, title: "PR's", path: "/prs" },
    { id: 3, title: "Weight", path: "/weight" },
    { id: 4, title: "Workout Routine", path: "/workoutroutine" },
    { id: 5, title: "Explore", path: "/explore" },
  ];

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 text-center">
        Dashboard
      </h1>
      <div className="flex flex-wrap gap-4 justify-center lg:justify-between">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={card.path}
            className="bg-gray-400 shadow-xl rounded-lg p-6 flex items-center justify-center text-white text-lg font-medium max-w-[200px] w-full lg:min-h-[500px] transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            {card.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
