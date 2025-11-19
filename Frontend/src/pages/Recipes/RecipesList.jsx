import { useState, useEffect } from "react";

import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

import api from "@/api/axios";
import { toast } from "@/lib/toast";

import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";

import {
  HiSearch,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

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

export default function RecipesList() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [recipes, setRecipes] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalData, setTotalData] = useState(0);

  const fetchRecipes = async () => {
    setLoadingState(true);
    setLoadingText("Getting Recipes");
    try {
      const params = new URLSearchParams();

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (selectedDifficulty !== "all") {
        params.append("difficulty", selectedDifficulty.toLowerCase());
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      params.append("sort", sortBy);
      params.append("page", currentPage);
      params.append("limit", 8);

      const { data } = await api.get(`/posts?${params.toString()}`);
      setRecipes(data.payload.datas || []);
      setTotalPages(data.pagination?.max || 1);
      setTotalData(data.pagination?.total);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast(error.response.data.payload.message || "Failed to get recipes", {
        type: "error",
      });
      setRecipes([]);
      setTotalPages(0);
      setTotalData(0);
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  const handleDeleteRecipe = (slug) => {
    setRecipes((prev) => prev.filter((r) => r.slug !== slug));
  };

  useEffect(() => {
    fetchRecipes();
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy, currentPage]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50">
      <Loading status={loadingState} fullscreen text={loadingText} />

      {/* Header */}
      <div className="bg-linear-to-r from-green-500 to-green-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                All Recipes
              </h1>
              <p className="text-green-100 text-sm sm:text-base">
                Discover and explore our collection of delicious recipes
              </p>
            </div>
            {isAdmin && (
              <Link
                to="/add-recipes"
                className="px-6 py-3 bg-white text-green-600 rounded-full font-semibold flex items-center gap-2 hover:bg-green-50 transition shadow-lg cursor-pointer"
              >
                <HiPlus className="w-5 h-5" />
                Add Recipe
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="relative mb-4">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes by name, ingredient, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select w-full rounded-lg border-2 border-gray-200  outline-none cursor-pointer"
              >
                {Object.entries(categoryList).map(([label, value], index) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="select w-full rounded-lg border-2 border-gray-200 outline-none cursor-pointer"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff.toLowerCase()}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select w-full rounded-lg border-2 border-gray-200 outline-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full px-4 py-2 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-green-600 text-lg">
                    {totalData}
                  </span>{" "}
                  recipes found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  showEdit={isAdmin}
                  showDelete={isAdmin}
                  onDelete={handleDeleteRecipe}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
                  style={{
                    backgroundColor: currentPage === 1 ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === 1 ? "#9ca3af" : "white",
                  }}
                >
                  <HiChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page;
                    if (totalPages <= 7) {
                      page = i + 1;
                    } else if (currentPage <= 4) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      page = totalPages - 6 + i;
                    } else {
                      page = currentPage - 3 + i;
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
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "#e5e7eb" : "#4CAF50",
                    color: currentPage === totalPages ? "#9ca3af" : "white",
                  }}
                >
                  Next
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
