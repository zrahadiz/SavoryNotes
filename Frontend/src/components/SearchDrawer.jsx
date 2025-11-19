import { useState, useEffect } from "react";
import {
  HiX,
  HiSearch,
  HiFilter,
  HiClock,
  HiFire,
  HiUser,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import api from "@/api/axios";
import imgNotFound from "@/assets/imgNotFound.png";

export default function SearchDrawer({ isOpen, onClose, initialSearch }) {
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    difficulty: "all",
  });
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalData, setTotalData] = useState(0);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedFilters.category !== "all") {
        params.append("category", selectedFilters.category.toLowerCase());
      }

      if (selectedFilters.difficulty !== "all") {
        params.append("difficulty", selectedFilters.difficulty.toLowerCase());
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      params.append("page", currentPage);
      params.append("limit", 6);

      const { data } = await api.get(`/posts?${params.toString()}`);
      console.log("Fetched recipes:", data);

      setRecipes(data.payload.datas || []);
      setTotalPages(data.pagination?.max || 1);
      setTotalData(data.pagination?.total);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
      setTotalPages(0);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecipes();
    }
  }, [isOpen, searchQuery, selectedFilters, currentPage]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedFilters]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedFilters({ category: "all", difficulty: "all" });
      setCurrentPage(1);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 transition-opacity backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <div
        className={`search-drawer fixed left-0 right-0 bottom-0 
        bg-white rounded-t-2xl md:rounded-t-3xl shadow-xl z-50
        h-[85vh] md:h-[75vh]
        transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="px-4 sm:px-6 pt-3 pb-4 sm:pb-6 border-b border-gray-200 bg-green-50 shrink-0">
            {/* Drag Handle for Mobile */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>

            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-green-500">
                Search Recipes
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 transition touch-manipulation cursor-pointer"
                aria-label="Close search"
              >
                <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3 sm:mb-4">
              <HiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border-2 border-gray-200 focus:border-green-500 outline-none transition"
              />
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HiFilter className="w-4 h-4 text-gray-600" />
                <span className="text-xs sm:text-sm font-semibold text-gray-600">
                  Filters:
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                <select
                  value={selectedFilters.category}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="select rounded-full border-2 border-primary text-xs sm:text-sm outline-none cursor-pointer touch-manipulation w-full sm:w-auto"
                >
                  <option value="all">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                  <option value="snack">Snack</option>
                </select>

                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="select rounded-full border-2 border-secondary text-xs sm:text-sm outline-none cursor-pointer touch-manipulation w-full sm:w-auto"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <p className="text-xs sm:text-sm text-gray-600">
                Found{" "}
                <span className="font-bold text-green-500">{totalData}</span>{" "}
                recipes
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 text-sm sm:text-base">
                  Loading recipes...
                </p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-base sm:text-lg">
                  No recipes found
                </p>
                <p className="text-gray-400 text-sm sm:text-base mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer border border-gray-100"
                    onClick={() => {
                      // Add navigation to recipe detail page
                      // navigate(`/recipe/${recipe._id}`);
                    }}
                  >
                    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                      {/* Image */}
                      <div className="shrink-0">
                        <img
                          src={recipe.images[0] || imgNotFound}
                          alt={recipe.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-cover"
                          onError={(e) => {
                            e.target.src = imgNotFound;
                            e.target.className =
                              "w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-contain";
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold mb-1 truncate text-gray-800">
                          {recipe.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                          {recipe.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2">
                          {recipe.time && (
                            <div className="flex items-center gap-1">
                              <HiClock className="w-3 h-3" />
                              <span className="hidden xs:inline">
                                {recipe.time}
                              </span>
                            </div>
                          )}
                          {recipe.difficulty && (
                            <div className="flex items-center gap-1">
                              <HiFire className="w-3 h-3" />
                              <span className="hidden sm:inline">
                                {recipe.difficulty}
                              </span>
                              <span className="sm:hidden">
                                {recipe.difficulty[0]}
                              </span>
                            </div>
                          )}
                          {recipe.servings && (
                            <div className="flex items-center gap-1">
                              <HiUser className="w-3 h-3" />
                              <span>{recipe.servings}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {recipe.tags && recipe.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {recipe.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 sm:py-1 rounded-full text-xs text-white font-medium bg-orange-500"
                              >
                                {tag}
                              </span>
                            ))}
                            {recipe.tags.length > 3 && (
                              <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs text-gray-600 font-medium bg-gray-200">
                                +{recipe.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 shrink-0">
              {/* Mobile Pagination - Simplified */}
              <div className="flex sm:hidden items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-full font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
                  style={{
                    backgroundColor: currentPage === 1 ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === 1 ? "#9ca3af" : "white",
                  }}
                >
                  <HiChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <span className="text-sm font-medium text-gray-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-full font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === totalPages ? "#9ca3af" : "white",
                  }}
                >
                  Next
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Pagination - Full */}
              <div className="hidden sm:flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    backgroundColor: currentPage === 1 ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === 1 ? "#9ca3af" : "white",
                  }}
                >
                  <HiChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10 rounded-full font-semibold transition cursor-pointer"
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
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === totalPages ? "#9ca3af" : "white",
                  }}
                >
                  Next
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
