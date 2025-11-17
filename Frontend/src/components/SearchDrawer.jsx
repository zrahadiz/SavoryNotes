import { useState, useEffect } from "react";
import {
  HiClock,
  HiFilter,
  HiFire,
  HiSearch,
  HiUser,
  HiX,
} from "react-icons/hi";

export default function SearchDrawer({ isOpen, onClose, recipes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    diet: "all",
    difficulty: "all",
  });

  const recipesPerPage = 6;

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDiet =
      selectedFilters.diet === "all" || recipe.diet === selectedFilters.diet;
    const matchesDifficulty =
      selectedFilters.difficulty === "all" ||
      recipe.difficulty?.toLowerCase() === selectedFilters.difficulty;

    return matchesSearch && matchesDiet && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilters]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 right-0 bottom-0 
        bg-white rounded-t-2xl shadow-xl z-50
        h-[75vh]
        transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-green-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-500">
                Search Recipes
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ingredient, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <HiFilter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-600">
                  Filters:
                </span>
              </div>

              <select
                value={selectedFilters.diet}
                onChange={(e) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    diet: e.target.value,
                  }))
                }
                className="px-4 py-1 rounded-full border-2 border-green-500 text-sm outline-none cursor-pointer"
              >
                <option value="all">All Diets</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
              </select>

              <select
                value={selectedFilters.difficulty}
                onChange={(e) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
                className="px-4 py-1 rounded-full border-2 border-orange-500 text-sm outline-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              Found{" "}
              <span className="font-bold text-green-500">
                {filteredRecipes.length}
              </span>{" "}
              recipes
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No recipes found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="flex-shrink-0">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-1 truncate text-gray-800">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <HiClock className="w-3 h-3" />
                            <span>{recipe.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HiFire className="w-3 h-3" />
                            <span>{recipe.difficulty}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HiUser className="w-3 h-3" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>
                        {recipe.tags && (
                          <div className="flex flex-wrap gap-1">
                            {recipe.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full text-xs text-white font-medium bg-orange-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentPage === 1 ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === 1 ? "#9ca3af" : "white",
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10 rounded-full font-semibold transition"
                        style={{
                          backgroundColor:
                            currentPage === page ? "#4CAF50" : "white",
                          color: currentPage === page ? "white" : "#4CAF50",
                          border:
                            currentPage === page ? "none" : "2px solid #4CAF50",
                        }}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === totalPages ? "#9ca3af" : "white",
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
