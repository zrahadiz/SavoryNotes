import { useState, useEffect } from "react";
import {
  HiSearch,
  HiFilter,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiClock,
  HiFire,
  HiUser,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { useAuthStore } from "@/store/authStore";
import api from "@/api/axios";
import imgNotFound from "@/assets/imgNotFound.png";

export default function RecipesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  const recipesPerPage = 12;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
  ];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Most Popular", value: "popular" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
  ];

  // Fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory.toLowerCase());
      }

      if (selectedDifficulty !== "all") {
        params.append("difficulty", selectedDifficulty.toLowerCase());
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      params.append("sort", sortBy);
      params.append("page", currentPage);
      params.append("limit", recipesPerPage);

      const { data } = await api.get(`/posts?${params.toString()}`);
      setRecipes(data.payload.datas || []);
      setTotalRecipes(data.payload.total || data.payload.datas?.length || 0);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
      setTotalRecipes(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy, currentPage]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Delete recipe
  const handleDelete = async () => {
    if (!recipeToDelete) return;

    try {
      await api.delete(`/posts/${recipeToDelete._id}`);
      setShowDeleteModal(false);
      setRecipeToDelete(null);
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-green-50 to-white">
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
              <button
                onClick={() => (window.location.href = "/recipes/create")}
                className="px-6 py-3 bg-white text-green-600 rounded-full font-semibold flex items-center gap-2 hover:bg-green-50 transition shadow-lg cursor-pointer"
              >
                <HiPlus className="w-5 h-5" />
                Add Recipe
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          {/* Search Bar */}
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

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select w-full rounded-lg border-2 border-gray-200  outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
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

            {/* Sort By */}
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

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-2 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-green-600 text-lg">
                    {totalRecipes}
                  </span>{" "}
                  recipes found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-lg">Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
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
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.images || imgNotFound}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = imgNotFound;
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Admin Actions Overlay */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() =>
                            (window.location.href = `/recipes/edit/${recipe._id}`)
                          }
                          className="p-2 bg-white rounded-full hover:bg-blue-50 transition shadow-lg"
                          title="Edit"
                        >
                          <HiPencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setRecipeToDelete(recipe);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-red-50 transition shadow-lg"
                          title="Delete"
                        >
                          <HiTrash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      {recipe.time && (
                        <div className="flex items-center gap-1">
                          <HiClock className="w-4 h-4 text-green-500" />
                          <span>{recipe.time}</span>
                        </div>
                      )}
                      {recipe.difficulty && (
                        <div className="flex items-center gap-1">
                          <HiFire className="w-4 h-4 text-orange-500" />
                          <span>{recipe.difficulty}</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-1">
                          <HiUser className="w-4 h-4 text-yellow-500" />
                          <span>{recipe.servings}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {recipe.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{recipe.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={() =>
                        (window.location.href = `/recipes/${recipe._id}`)
                      }
                      className="w-full py-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold transition flex items-center justify-center gap-2"
                    >
                      <HiEye className="w-4 h-4" />
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Delete Recipe</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRecipeToDelete(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{recipeToDelete?.title}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRecipeToDelete(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
