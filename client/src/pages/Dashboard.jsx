import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const cards = [
    { id: 1, title: "Calendar", path: "/calendar" },
    { id: 2, title: "PR's", path: "/prs" },
    { id: 3, title: "Weight Tracker", path: "/weight" },
    { id: 4, title: "Workout Routine", path: "/workoutroutine" },
    { id: 5, title: "Explore", path: "/explore" },
  ];

  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Push yourself because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Believe it. Build it.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Don't stop when you're tired. Stop when you're done.",
    "Success is what comes after you stop making excuses.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Your only limit is you.",
    "Sweat is just fat crying.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "A little progress each day adds up to big results.",
    "The body achieves what the mind believes.",
    "Your body can stand almost anything. It’s your mind that you have to convince.",
    "The hardest lift of all is lifting your butt off the couch.",
    "If you still look good at the end of your workout, you didn’t train hard enough.",
    "Be stronger than your strongest excuse.",
    "Fitness is not about being better than someone else. It’s about being better than you used to be.",
    "Believe you can and you're halfway there.",
    "Every workout counts, even if it's just a little bit.",
    "Energy and persistence conquer all things.",
    "You’re only one workout away from a good mood.",
  ];

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <div className="px-4 py-12 max-w-7xl w-full mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-4 justify-center mb-40">
          {cards.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg border border-white/50 p-6 flex items-center justify-center text-gray-800 text-lg font-medium w-full max-w-[220px] lg:min-h-[220px] transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              {card.title}
            </Link>
          ))}
        </div>
        <p className="text-lg font-medium text-gray-800 text-center italic mt-16">
          "{getRandomQuote()}"
        </p>
      </div>
    </div>
  );
}
