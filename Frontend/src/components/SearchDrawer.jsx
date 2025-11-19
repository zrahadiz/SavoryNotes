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
  HiTag,
} from "react-icons/hi";
import { toast } from "@/lib/toast";
import api from "@/api/axios";
import imgNotFound from "@/assets/imgNotFound.png";
import { useNavigate } from "react-router-dom";

const categoryList = {
  ALL: "all",
  ENTREE: "entree",
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  DESSERT: "dessert",
  "QUICK BITES": "quickBites",
};

const difficulties = ["All", "Easy", "Medium", "Hard"];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

export default function SearchDrawer({ isOpen, onClose, initialSearch }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    difficulty: "all",
    sort: "newest",
  });
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalData, setTotalData] = useState(0);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedFilters.category !== "all") {
        params.append("category", selectedFilters.category);
      }

      if (selectedFilters.difficulty !== "all") {
        params.append("difficulty", selectedFilters.difficulty.toLowerCase());
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      params.append("sort", selectedFilters.sort);
      params.append("page", currentPage);
      params.append("limit", 6);

      const { data } = await api.get(`/posts?${params.toString()}`);
      console.log("Fetched recipes:", data);

      setRecipes(data.payload.datas || []);
      setTotalPages(data.pagination?.max || 1);
      setTotalData(data.pagination?.total);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast(error.response.data.payload.message || "Failed to get recipes.", {
        type: "error",
      });
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`search-drawer fixed left-0 right-0 bottom-0 
      bg-white rounded-t-3xl shadow-2xl z-50
      h-[90vh] md:h-[80vh]
      transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="px-4 sm:px-6 pt-3 pb-4 sm:pb-5 border-b border-gray-200 bg-linear-to-br from-green-50 to-green-100/50 shrink-0">
            {/* Drag Handle for Mobile */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <HiSearch className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Find Your Recipe
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/80 transition-all duration-200 touch-manipulation cursor-pointer"
                aria-label="Close search"
              >
                <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ingredient, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm sm:text-base rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-200 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HiFilter className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-700">
                  Filter Results
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <select
                  value={selectedFilters.category}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="select  rounded-lg border-2 border-gray-200 bg-white text-sm outline-none cursor-pointer"
                >
                  {Object.entries(categoryList).map(([label, value], index) => (
                    <option key={index} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="select  rounded-lg border-2 border-gray-200 bg-white text-sm outline-none cursor-pointer"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff.toLowerCase()}>
                      {diff}
                    </option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={selectedFilters.sort}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      sort: e.target.value,
                    }))
                  }
                  className="select  rounded-lg border-2 border-gray-200 bg-white text-sm outline-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Clear Button */}
                <button
                  onClick={() => {
                    setSelectedFilters({
                      category: "all",
                      difficulty: "all",
                      sort: "newest",
                    });
                    setSearchQuery("");
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border-2 border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                >
                  🔄 Clear
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found{" "}
                  <span className="font-bold text-primary">{totalData}</span>{" "}
                  {totalData === 1 ? "recipe" : "recipes"}
                </p>
                {(selectedFilters.category !== "all" ||
                  selectedFilters.difficulty !== "all" ||
                  searchQuery) && (
                  <span className="text-xs text-primary font-medium">
                    Filters active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base font-medium">
                  Searching recipes...
                </p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-6xl sm:text-7xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">
                  No recipes found
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer border-2 border-gray-100 hover:border-green-200 overflow-hidden"
                    onClick={() => {
                      navigate(`/recipe/${recipe.slug}`);
                      onClose();
                    }}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="shrink-0 relative">
                        <img
                          src={recipe.images?.[0] || imgNotFound}
                          alt={recipe.title}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm"
                          onError={(e) => {
                            e.target.src = imgNotFound;
                            e.target.className =
                              "w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-contain shadow-sm";
                          }}
                        />

                        {/* Category Badge on Image */}
                        {recipe.category && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            {recipe.category}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-800 line-clamp-1">
                            {recipe.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                            {recipe.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            {recipe.time && (
                              <div className="flex items-center gap-1">
                                <HiClock className="w-3.5 h-3.5 text-green-600" />
                                <span className="font-medium">
                                  {recipe.time}
                                </span>
                              </div>
                            )}
                            {recipe.difficulty && (
                              <div className="flex items-center gap-1">
                                <HiFire
                                  className={`w-3.5 h-3.5 ${
                                    recipe.difficulty?.toLowerCase() === "easy"
                                      ? "text-green-600"
                                      : recipe.difficulty?.toLowerCase() ===
                                        "medium"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                />
                                <span className="font-medium capitalize">
                                  {recipe.difficulty}
                                </span>
                              </div>
                            )}
                            {recipe.servings && (
                              <div className="flex items-center gap-1">
                                <HiUser className="w-3.5 h-3.5 text-orange-600" />
                                <span className="font-medium">
                                  {recipe.servings}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        {recipe.tags && recipe.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {recipe.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                              >
                                <HiTag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                            {recipe.tags.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
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
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-linear-to-br from-gray-50 to-white shrink-0">
              {/* Mobile Pagination */}
              <div className="flex sm:hidden items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer shadow-sm ${
                    currentPage === 1
                      ? "bg-[#e5e7eb] #9ca3af"
                      : "bg-primary text-white"
                  }`}
                >
                  <HiChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-gray-700">
                    Page {currentPage}
                  </span>
                  <span className="text-xs text-gray-500">of {totalPages}</span>
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer shadow-sm ${
                    currentPage === totalPages
                      ? "bg-[#e5e7eb] #9ca3af"
                      : "bg-primary text-white"
                  }`}
                >
                  Next
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md ${
                    currentPage === 1
                      ? "bg-[#e5e7eb] #9ca3af"
                      : "bg-primary text-white"
                  }`}
                >
                  <HiChevronLeft className="w-5 h-5" />
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
                        className={`w-10 h-10 rounded-xl font-semibold transition-all cursor-pointer hover:scale-105 ${
                          currentPage === page
                            ? "bg-primary text-white border-0 shadow-primary"
                            : "bg-white text-primary border-2 border-primary shadow-none"
                        }`}
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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md ${
                    currentPage === totalPages
                      ? "bg-[#e5e7eb] #9ca3af"
                      : "bg-primary text-white"
                  }`}
                >
                  Next
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
