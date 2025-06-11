import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function Pics() {
  const { currentUser } = useSelector((state) => state.user);
  const [pics, setPics] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newPicUrl, setNewPicUrl] = useState("");
  const [showGrid, setShowGrid] = useState(false); // Toggle for grid/horizontal

  const handleAddPic = () => {
    if (!newPicUrl) return;
    setPics([...pics, { url: newPicUrl, addedAt: new Date() }]);
    setNewPicUrl("");
    setShowInput(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 overflow-y-auto">
      <div className="px-4 py-12 max-w-5xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
          Progress Pics
        </h1>
        <div className="flex w-full justify-center items-center gap-4 mb-8">
          <div
            className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300 text-5xl text-gray-500"
            onClick={() => setShowInput(true)}
          >
            +
          </div>
          {/* Desktop only toggle button */}
          <button
            className="hidden md:inline-block ml-4 px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900 transition"
            onClick={() => setShowGrid((prev) => !prev)}
          >
            {showGrid ? "Show Timeline" : "Show Grid"}
          </button>
        </div>
        {showInput && (
          <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg max-w-xs mx-auto mb-8">
            <input
              type="url"
              value={newPicUrl}
              onChange={(e) => setNewPicUrl(e.target.value)}
              placeholder="Paste image URL"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddPic}
              className="bg-gray-800 text-white p-3 rounded-lg w-full"
            >
              Add Picture
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewPicUrl("");
              }}
              className="bg-gray-300 text-gray-700 p-3 rounded-lg w-full"
            >
              Cancel
            </button>
          </div>
        )}
        {/* Desktop: Timeline or Grid */}
        <div className="w-full flex justify-center">
          {/* Timeline (horizontal scroll) */}
          <div
            className={`${
              showGrid ? "hidden" : "hidden md:flex"
            } flex-row gap-10 items-center overflow-x-auto py-6 px-2 max-w-full`}
            style={{ maxWidth: "100%" }}
          >
            {pics.map((pic, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="w-[350px] h-[350px] bg-white rounded-xl shadow-xl flex items-center justify-center overflow-hidden mb-2"
                  style={{ minWidth: 350, minHeight: 350 }}
                >
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={`Progress ${idx + 1}`}
                      className="w-full h-full object-contain"
                      style={{ imageRendering: "auto" }}
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {pic.addedAt
                    ? new Date(pic.addedAt).toLocaleDateString()
                    : ""}
                </span>
                {idx < pics.length - 1 && (
                  <div className="w-16 h-1 bg-gray-300 rounded-full my-2"></div>
                )}
              </div>
            ))}
          </div>
          {/* Grid layout for desktop */}
          <div
            className={`${
              showGrid ? "md:grid" : "hidden"
            } hidden md:grid-cols-3 md:gap-8 md:py-6 md:px-2 md:w-full`}
          >
            {pics.map((pic, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center mb-8 p-2" // Added padding
              >
                <div
                  className="w-[200px] h-[200px] bg-white rounded-xl shadow-xl flex items-center justify-center overflow-hidden mb-2"
                  style={{ minWidth: 200, minHeight: 200 }} // Reduced size for grid
                >
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={`Progress ${idx + 1}`}
                      className="w-full h-full object-contain"
                      style={{ imageRendering: "auto" }}
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {pic.addedAt
                    ? new Date(pic.addedAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
          {/* Mobile: vertical, no inner scroll */}
          <div className="flex md:hidden flex-col gap-8 items-center w-full">
            {pics.map((pic, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-[350px] h-[350px] bg-white rounded-xl shadow-xl flex items-center justify-center overflow-hidden mb-2"
                    style={{ minWidth: 350, minHeight: 350 }}
                  >
                    {pic.url ? (
                      <img
                        src={pic.url}
                        alt={`Progress ${idx + 1}`}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: "auto" }}
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {pic.addedAt
                      ? new Date(pic.addedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                {idx < pics.length - 1 && (
                  <div className="w-1 h-16 bg-gray-300 rounded-full my-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
