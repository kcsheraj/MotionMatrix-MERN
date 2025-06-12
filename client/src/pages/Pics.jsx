import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Pics() {
  const { currentUser } = useSelector((state) => state.user);
  const [pics, setPics] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newPicUrl, setNewPicUrl] = useState("");
  const [showGrid, setShowGrid] = useState(false);
  const [editingDateId, setEditingDateId] = useState(null);
  const [editingDateValue, setEditingDateValue] = useState("");

  // Fetch pics on mount
  useEffect(() => {
    const fetchPics = async () => {
      if (!currentUser) return;
      const res = await fetch("/api/pics", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      // Sort by most recent first
      setPics(data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)));
    };
    fetchPics();
  }, [currentUser]);

  // Add pic to backend
  const handleAddPic = async () => {
    if (!newPicUrl) return;
    const res = await fetch("/api/pics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ url: newPicUrl }),
    });
    const data = await res.json();
    setPics([data, ...pics]); // Add new pic to the front
    setNewPicUrl("");
    setShowInput(false);
  };

  // Delete pic from backend
  const handleDeletePic = async (id) => {
    if (!window.confirm("Delete this picture?")) return;
    await fetch(`/api/pics/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    setPics(pics.filter((pic) => pic._id !== id));
  };

  // Edit date for a pic
  const handleEditDate = (pic) => {
    setEditingDateId(pic._id);
    setEditingDateValue(pic.addedAt ? pic.addedAt.slice(0, 10) : "");
  };

  const handleSaveDate = async (pic) => {
    if (!editingDateValue) return;
    const res = await fetch(`/api/pics/${pic._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ addedAt: editingDateValue }),
    });
    const updated = await res.json();
    setPics((prev) =>
      prev
        .map((p) =>
          p._id === pic._id ? { ...p, addedAt: updated.addedAt } : p
        )
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    );
    setEditingDateId(null);
    setEditingDateValue("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 overflow-y-auto">
      <div className="px-4 py-12 max-w-5xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
          Progress Pics
        </h1>
        <div className="flex flex-col w-full items-center gap-2 mb-8">
          <div
            className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300 text-3xl text-gray-500"
            onClick={() => setShowInput(true)}
          >
            +
          </div>
          {/* Desktop only toggle button, now smaller and below add */}
          <button
            className="hidden md:inline-block mt-2 px-3 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900 transition text-sm"
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
              <div key={pic._id} className="flex flex-col items-center">
                <div
                  className="relative"
                  style={{ minWidth: 420, minHeight: 420 }}
                >
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={`Progress ${idx + 1}`}
                      className="w-[420px] h-[420px] rounded-2xl shadow-xl object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                  <button
                    onClick={() => handleDeletePic(pic._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-xs shadow hover:bg-red-700"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
                {/* Editable date */}
                {editingDateId === pic._id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="date"
                      value={editingDateValue}
                      onChange={(e) => setEditingDateValue(e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => handleSaveDate(pic)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDateId(null)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span
                    className="text-xs text-gray-500 cursor-pointer hover:underline mt-1"
                    onClick={() => handleEditDate(pic)}
                    title="Edit date"
                  >
                    {pic.addedAt
                      ? new Date(pic.addedAt).toLocaleDateString(undefined, {
                          timeZone: "UTC",
                        })
                      : ""}
                  </span>
                )}
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
                key={pic._id}
                className="flex flex-col items-center mb-8 p-2"
              >
                <div
                  className="relative"
                  style={{ minWidth: 320, minHeight: 320 }}
                >
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={`Progress ${idx + 1}`}
                      className="w-[320px] h-[320px] rounded-2xl shadow-xl object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                  <button
                    onClick={() => handleDeletePic(pic._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-xs shadow hover:bg-red-700"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
                {/* Editable date */}
                {editingDateId === pic._id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="date"
                      value={editingDateValue}
                      onChange={(e) => setEditingDateValue(e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => handleSaveDate(pic)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDateId(null)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span
                    className="text-xs text-gray-500 cursor-pointer hover:underline mt-1"
                    onClick={() => handleEditDate(pic)}
                    title="Edit date"
                  >
                    {pic.addedAt
                      ? new Date(pic.addedAt).toLocaleDateString(undefined, {
                          timeZone: "UTC",
                        })
                      : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* Mobile: vertical, no inner scroll */}
          <div className="flex md:hidden flex-col gap-8 items-center w-full">
            {pics.map((pic, idx) => (
              <React.Fragment key={pic._id}>
                <div className="flex flex-col items-center">
                  <div
                    className="relative"
                    style={{ minWidth: 380, minHeight: 380 }}
                  >
                    {pic.url ? (
                      <img
                        src={pic.url}
                        alt={`Progress ${idx + 1}`}
                        className="w-[380px] h-[380px] rounded-2xl shadow-xl object-cover"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                    <button
                      onClick={() => handleDeletePic(pic._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-xs shadow hover:bg-red-700"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                  {/* Editable date */}
                  {editingDateId === pic._id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="date"
                        value={editingDateValue}
                        onChange={(e) => setEditingDateValue(e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleSaveDate(pic)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDateId(null)}
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      className="text-xs text-gray-500 cursor-pointer hover:underline mt-1"
                      onClick={() => handleEditDate(pic)}
                      title="Edit date"
                    >
                      {pic.addedAt
                        ? new Date(pic.addedAt).toLocaleDateString(undefined, {
                            timeZone: "UTC",
                          })
                        : ""}
                    </span>
                  )}
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
