import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { toast } from "@/lib/toast";
import Loading from "@/components/Loading";

import imgNotFound from "@/assets/imgNotFound.png";

import {
  HiClock,
  HiFire,
  HiUser,
  HiPencil,
  HiTrash,
  HiBookOpen,
  HiTag,
  HiEye,
} from "react-icons/hi";

const getCategoryColor = (category) => {
  const colors = {
    entree: "bg-purple-100 text-purple-700 border-purple-200",
    appetizer: "bg-blue-100 text-blue-700 border-blue-200",
    dessert: "bg-pink-100 text-pink-700 border-pink-200",
    breakfast: "bg-yellow-100 text-yellow-700 border-yellow-200",
    lunch: "bg-green-100 text-green-700 border-green-200",
    dinner: "bg-orange-100 text-orange-700 border-orange-200",
    snack: "bg-teal-100 text-teal-700 border-teal-200",
    beverage: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  return (
    colors[category?.toLowerCase()] ||
    "bg-gray-100 text-gray-700 border-gray-200"
  );
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: "text-blue-600",
    medium: "text-yellow-600",
    hard: "text-red-600",
  };
  return colors[difficulty?.toLowerCase()] || "text-gray-600";
};

export default function RecipeCard({
  recipe,
  showEdit = false,
  showDelete = false,
  onDelete,
}) {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    setLoadingState(true);
    setLoadingText("Deleting recipe...");
    try {
      const { data } = await api.delete(`/posts/${recipe.slug}`);
      toast(data.payload.message || "Recipe deleted!", {
        type: "success",
      });
      if (onDelete) onDelete(recipe.slug);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast(
        error.response.data.payload.message || "Failed to delete recipes.",
        {
          type: "error",
        }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
      setModalOpen(false);
    }
  };

  return (
    <>
      <Loading status={loadingState} fullscreen text={loadingText} />

      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <img
            src={imageError ? imgNotFound : recipe.images?.[0] || imgNotFound}
            alt={recipe.title}
            className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
              imageError ? "object-contain p-4" : "object-cover"
            }`}
            onError={(e) => {
              setImageError(true);
              e.target.src = imgNotFound;
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {recipe.category && (
            <div className="absolute top-3 left-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getCategoryColor(
                  recipe.category
                )}`}
              >
                <HiBookOpen className="w-3.5 h-3.5" />
                {recipe.category}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {showEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/recipes/edit/${recipe.slug}`);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg cursor-pointer"
                title="Edit Recipe"
              >
                <HiPencil className="w-4 h-4" />
              </button>
            )}
            {showDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg cursor-pointer"
                title="Delete Recipe"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-gray-800 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {recipe.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {recipe.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-full text-xs font-medium transition-colors duration-200 cursor-default"
                >
                  <HiTag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  +{recipe.tags.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="flex-1" />

          <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <HiClock className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {recipe.time}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  recipe.difficulty?.toLowerCase() === "easy"
                    ? "bg-blue-50"
                    : recipe.difficulty?.toLowerCase() === "medium"
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }`}
              >
                <HiFire
                  className={`w-5 h-5 ${getDifficultyColor(recipe.difficulty)}`}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 capitalize">
                {recipe.difficulty}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <HiUser className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {recipe.servings}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/recipe/${recipe.slug}`)}
            className="w-full mt-4 py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <HiEye className="w-5 h-5" />
            View Recipe
          </button>

          {/* Edit/Delete Buttons (Mobile Fallback) */}
          {(showEdit || showDelete) && (
            <div className="flex gap-2 mt-2 md:hidden">
              {showEdit && (
                <button
                  onClick={() => navigate(`/recipes/edit/${recipe.slug}`)}
                  className="flex-1 py-2.5 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <HiPencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              {showDelete && (
                <button
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  className="flex-1 py-2.5 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <HiTrash className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
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
                onClick={() => setModalOpen(false)}
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
    </>
  );
}
