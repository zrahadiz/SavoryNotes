import { useState } from "react";
import { HiClock, HiFire, HiUser, HiPencil, HiTrash } from "react-icons/hi";
import imgNotFound from "@/assets/imgNotFound.png";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

import { toast } from "@/lib/toast";
import Loading from "@/components/Loading";

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

  const [selectedSlug, setSelectedSlug] = useState(null);

  const handleDelete = async (slug) => {
    setLoadingState(true);
    setLoadingText("Deleting post...");
    try {
      const { data } = await api.delete(`/posts/${recipe.slug}`);

      console.log(data);

      toast(data.payload.message || "Recipe updated successfully!", {
        type: "success",
      });

      if (onDelete) onDelete(recipe.slug);
    } catch (error) {
      console.error("Error deleting recipe: ", error);
      toast(
        error.response.data.payload.message ||
          "Failed to update recipe. Please try again.",
        {
          type: "error",
        }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group flex flex-col">
        <Loading status={loadingState} fullscreen text={loadingText} />

        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={recipe.images[0] || imgNotFound}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = imgNotFound;
              e.target.className =
                "w-full h-full object-contain transition-transform duration-500 group-hover:scale-110";
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 leading-snug line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <HiClock className="w-4 h-4" style={{ color: "#4CAF50" }} />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiFire className="w-4 h-4" style={{ color: "#FF8F3A" }} />
                <span>{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiUser className="w-4 h-4" style={{ color: "#FFDA5A" }} />
                <span>{recipe.servings}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col gap-2">
            <button className="btn w-full py-3 rounded-full font-semibold transition-all duration-300 border-2 border-primary bg-transparent hover:bg-primary text-primary hover:text-white cursor-pointer">
              VIEW RECIPE
            </button>

            {(showEdit || showDelete) && (
              <div className="flex justify-between mt-2 gap-2">
                {showEdit && (
                  <button
                    onClick={() => navigate(`/recipes/edit/${recipe.slug}`)}
                    className="btn flex-1 flex items-center justify-center gap-1 py-2 rounded-full font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition cursor-pointer"
                  >
                    <HiPencil className="w-4 h-4" /> Edit
                  </button>
                )}
                {showDelete && (
                  <button
                    onClick={() => {
                      setSelectedSlug(recipe.slug);
                      setModalOpen(true);
                    }}
                    className="btn flex-1 flex items-center justify-center gap-1 py-2 rounded-full font-semibold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
                  >
                    <HiTrash className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <p>Are you sure you want to delete: {selectedSlug}</p>

            <div className="modal-action">
              <button
                onClick={() => {
                  handleDelete(selectedSlug);
                  setModalOpen(false);
                }}
                className="btn bg-primary text-white"
              >
                Yes
              </button>

              <button onClick={() => setModalOpen(false)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
