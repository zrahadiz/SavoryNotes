import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  HiArrowLeft,
  HiClock,
  HiFire,
  HiUser,
  HiPencil,
  HiTrash,
  HiShare,
  HiPrinter,
  HiCheck,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import { toast } from "@/lib/toast";
import api from "@/api/axios";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/Loading";

import RecipeInstructions from "@/components/RecipeInstructions";
import AiChefBot from "@/components/AIChefBot";

import imgNotFound from "@/assets/imgNotFound.png";

const categoryLabels = {
  entree: "Entree",
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  dessert: "Dessert",
  quickBites: "Quick Bites",
};

const categoryColors = {
  entree: "bg-purple-100 text-purple-600",
  breakfast: "bg-yellow-100 text-yellow-600",
  lunch: "bg-blue-100 text-blue-600",
  dinner: "bg-red-100 text-red-600",
  dessert: "bg-pink-100 text-pink-600",
  quickBites: "bg-green-100 text-green-600",
};

const difficultyColors = {
  easy: "bg-green-100 text-green-600",
  medium: "bg-orange-100 text-orange-600",
  hard: "bg-red-100 text-red-600",
};

export default function RecipeDetail() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [recipe, setRecipe] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  const isAdmin = user?.role === "admin";

  const fetchRecipe = async () => {
    setLoadingState(true);
    setLoadingText("Getting recipe...");
    try {
      const { data } = await api.get(`/posts/${slug}`);
      const recipeData = data.payload.datas;
      setRecipe(recipeData);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast(error.response.data.payload.message || "Failed to get recipes.", {
        type: "error",
      });
      navigate("/recipes");
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [slug, navigate]);

  const handleDelete = async () => {
    try {
      const { data } = await api.delete(`/posts/${slug}`);
      toast(data.payload.message || "Recipe deleted!", {
        type: "success",
      });
      navigate("/recipes");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast(
        error.response.data.payload.message || "Failed to delete recipes.",
        {
          type: "error",
        }
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
        toast("Share cancelled", {
          type: "error",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!", {
        type: "error",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === recipe.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? recipe.images.length - 1 : prev - 1
    );
  };

  if (!recipe) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-green-50 to-white">
      <Loading status={loadingState} fullscreen text={loadingText} />
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] bg-gray-900">
        {/* Image Carousel */}
        {recipe.images && recipe.images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={recipe.images[currentImageIndex] || imgNotFound}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = imgNotFound;
                e.target.className = "w-full h-full object-contain";
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Image Navigation */}
            {recipe.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition cursor-pointer"
                  aria-label="Previous image"
                >
                  <HiChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition cursor-pointer"
                  aria-label="Next image"
                >
                  <HiChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {recipe.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition ${
                        index === currentImageIndex
                          ? "bg-white w-8"
                          : "bg-white/50 w-2"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-green-400 to-green-600">
            <span className="text-9xl">🍳</span>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/recipes")}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition backdrop-blur-sm cursor-pointer"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Back</span>
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition backdrop-blur-sm cursor-pointer"
            aria-label="Share recipe"
          >
            <HiShare className="w-6 h-6 text-gray-700" />
          </button>
          <button
            disabled={!recipe}
            onClick={handlePrint}
            className="hidden sm:block p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition backdrop-blur-sm cursor-pointer"
            aria-label="Print recipe"
          >
            <HiPrinter className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${
                  categoryColors[recipe.category]
                }`}
              >
                {categoryLabels[recipe.category]}
              </span>
              <span
                className={`px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${
                  difficultyColors[recipe.difficulty]
                }`}
              >
                {recipe.difficulty.charAt(0).toUpperCase() +
                  recipe.difficulty.slice(1)}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {recipe.title}
            </h1>
            <p className="text-white/90 text-lg mb-4 max-w-2xl drop-shadow">
              {recipe.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <HiClock className="w-5 h-5" />
                <span>{recipe.time} min</span>
              </div>
              <div className="flex items-center gap-2">
                <HiFire className="w-5 h-5" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiUser className="w-5 h-5" />
                <span>
                  {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Actions */}
        {isAdmin && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-8 flex flex-wrap gap-3">
            <span className="text-orange-700 font-semibold flex items-center gap-2">
              🔐 Admin Controls
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => navigate(`/recipes/edit/${slug}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer"
              >
                <HiPencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}
        {/* Time Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Prep Time</p>
            <p className="text-2xl font-bold text-green-600">
              {recipe.prepTime || 0} min
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Cook Time</p>
            <p className="text-2xl font-bold text-orange-600">
              {recipe.cookTime || 0} min
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center col-span-2 md:col-span-1">
            <p className="text-gray-500 text-sm mb-1">Total Time</p>
            <p className="text-2xl font-bold text-blue-600">
              {recipe.time} min
            </p>
          </div>
        </div>
        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-medium text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Ingredients */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🥗 Ingredients
          </h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => toggleIngredient(index)}
                >
                  <div className="shrink-0 mt-1">
                    {checkedIngredients.includes(index) ? (
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                        <HiCheck className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      checkedIngredients.includes(index)
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No ingredients listed</p>
          )}
        </div>
        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📖 Instructions
          </h2>
          <RecipeInstructions content={recipe.content} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky bottom-4">
            <AiChefBot recipe={recipe} />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <HiTrash className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Recipe?
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{recipe.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .search-drawer {
            display: none !important;
          }
          button, .no-print {
            display: none !important;
          }
          .bg-linear-to-b {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
