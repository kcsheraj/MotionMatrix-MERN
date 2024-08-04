import React from "react";

export default function About() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <div className="px-8 py-12 max-w-2xl bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
          About MotionMatrix
        </h1>
        <p className="mb-4 text-gray-800">
          Motion Matrix is a comprehensive web application designed to
          streamline and enhance your workout tracking experience. It offers a
          user-friendly interface to log workouts, track personal records,
          manage routines, and visualize progress. With Motion Matrix, you can
          efficiently plan and monitor your fitness journey from one centralized
          platform.
        </p>
        <p className="mb-4 text-gray-800">
          The idea for Motion Matrix originated from my need to consolidate
          various physical methods I used for tracking my workouts, including
          paper logs and printed calendars. I decided to integrate these
          disparate systems into a unified web app, creating a seamless
          experience that combines the efficiency of digital tools with the
          familiarity of traditional tracking methods.
        </p>
        <p className="mb-4 text-gray-800">
          Looking ahead, Motion Matrix envisions a future where workout tracking
          is not only about recording data but also about gaining insights and
          optimizing performance. We aim to incorporate advanced features like
          personalized recommendations, integration with wearables, and
          predictive analytics to help users achieve their fitness goals more
          effectively.
        </p>
      </div>
    </div>
  );
}
