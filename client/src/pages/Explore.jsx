import React, { useState, useEffect } from "react";

const muscleGroups = [
  "abdominals",
  "abductors",
  "adductors",
  "biceps",
  "calves",
  "chest",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "lower_back",
  "middle_back",
  "neck",
  "quadriceps",
  "traps",
  "triceps",
];

const difficultyLevels = ["beginner", "intermediate", "expert"];

export default function Explore() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({}); // To store image URLs

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/exercises?name=${searchQuery}&muscle=${selectedMuscle}&difficulty=${selectedDifficulty}`,
          {
            headers: {
              "X-Api-Key": import.meta.env.VITE_NINJAS_API_KEY, // Use your API key here
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        setExercises(data);
        setFilteredExercises(data);
        fetchImages(data);
      } catch (error) {
        console.error("Failed to fetch exercises", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async (exercises) => {
      const queries = exercises.map((exercise) => exercise.name).join(", ");
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${queries}&client_id=${
            import.meta.env.VITE_UNSPLASH_API_KEY
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        const urls = {};
        data.results.forEach((image) => {
          urls[image.alt_description] = image.urls.small;
        });
        setImageUrls(urls);
      } catch (error) {
        console.error("Failed to fetch images", error);
      }
    };

    fetchExercises();
  }, [searchQuery, selectedMuscle, selectedDifficulty]);

  useEffect(() => {
    // Filter exercises based on search and muscle group
    const filterExercises = () => {
      let filtered = exercises;
      if (searchQuery) {
        filtered = filtered.filter((exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedMuscle) {
        filtered = filtered.filter(
          (exercise) =>
            exercise.muscle.toLowerCase() === selectedMuscle.toLowerCase()
        );
      }
      if (selectedDifficulty) {
        filtered = filtered.filter(
          (exercise) =>
            exercise.difficulty.toLowerCase() ===
            selectedDifficulty.toLowerCase()
        );
      }
      setFilteredExercises(filtered);
    };

    filterExercises();
  }, [searchQuery, selectedMuscle, selectedDifficulty, exercises]);

  // Clear filters function
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMuscle("");
    setSelectedDifficulty("");
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <div className="px-4 py-12 max-w-7xl w-full">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
          Explore Workouts
        </h1>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts"
            className="bg-white rounded-lg p-3 w-full md:w-1/3 border border-gray-300 shadow-md"
          />
          <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="bg-white rounded-lg p-3 w-full md:w-1/3 border border-gray-300 shadow-md"
          >
            <option value="">All Muscle Groups</option>
            {muscleGroups.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() +
                  muscle.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white rounded-lg p-3 w-full md:w-1/3 border border-gray-300 shadow-md"
          >
            <option value="">All Difficulties</option>
            {difficultyLevels.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="bg-red-500 text-white p-3 rounded-lg mb-6 transition-transform transform hover:scale-105"
        >
          Clear Filters
        </button>

        {loading && <p className="text-center">Loading...</p>}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.name}
                className="bg-white p-4 rounded-lg border border-gray-300 shadow-lg transition-transform transform hover:scale-105"
              >
                <img
                  src={
                    imageUrls[exercise.name] ||
                    `https://via.placeholder.com/150`
                  } // Use Unsplash image if available
                  alt={exercise.name}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-bold mb-2">{exercise.name}</h2>
                <p className="text-sm text-gray-600">{exercise.instructions}</p>
                <p className="text-sm font-medium mt-2">{exercise.muscle}</p>
                <p className="text-sm font-medium mt-2">
                  {exercise.difficulty}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
