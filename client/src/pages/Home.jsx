import React from "react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <div
        className="text-center px-8 py-12 max-w-lg mx-auto rounded-2xl shadow-xl border border-white/50"
        style={{
          backgroundColor: "#EEEFF1", // replace with your hex value
          marginTop: "-20vh",
        }}
      >
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          Welcome to MotionMatrix!
        </h1>
        <img
          src="/logoHomePage.jpg" // replace with the correct path
          alt="Description of image"
          className="mx-auto mb-6 w-full max-w-xs rounded-xl"
        />
        <p className="text-lg text-gray-800">
          Explore the future of fitness tracking.
        </p>
      </div>
    </div>
  );
}
