import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

import { toast } from "@/lib/toast";
import ImageUploader from "@/components/ImageUploader";
import Loading from "@/components/Loading";

import { HiPlus, HiX, HiArrowLeft, HiCheck, HiSparkles } from "react-icons/hi";
import InstructionsInput from "../../components/InstructionInput";

const categories = [
  { value: "entree", label: "Entree" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "dessert", label: "Dessert" },
  { value: "quickBites", label: "Quick Bites" },
];

const difficulties = [
  { value: "easy", label: "Easy", emoji: "😊" },
  { value: "medium", label: "Medium", emoji: "🤔" },
  { value: "hard", label: "Hard", emoji: "😰" },
];

export default function CreateRecipePage() {
  const navigate = useNavigate();

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "enttree",
    time: 0,
    difficulty: "easy",
    servings: 1,
    tags: [],
    ingredients: [],
    prepTime: 0,
    cookTime: 0,
    images: [],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentIngredient, setCurrentIngredient] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    setFormData((prev) => {
      const newData = { ...prev, [name]: numValue };

      const prepTime = name === "prepTime" ? numValue : prev.prepTime;
      const cookTime = name === "cookTime" ? numValue : prev.cookTime;
      newData.time = prepTime + cookTime;

      return newData;
    });
  };

  const generateTags = async () => {
    setLoadingState(true);
    setLoadingText("Generating the tags...");
    try {
      console.log(formData);
      const { data } = await api.post("/ai/generate-tags", {
        title: formData.title,
        ingredients: formData.ingredients,
        content: formData.ingredients,
      });
      console.log(data);
      const aiTags = data.payload.datas;

      setFormData((prev) => ({
        ...prev,
        tags: Array.from(new Set([...prev.tags, ...aiTags])),
      }));
      toast("Successfully add generate tags.", {
        type: "success",
      });
    } catch (error) {
      console.error("Error generating tags:", error);
      toast(
        error.response.data.payload.message ||
          "Failed to generate tags. Please try again.",
        {
          type: "error",
        }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (currentIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()],
      }));
      setCurrentIngredient("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast("Please enter a recipe title", {
        type: "warning",
      });
      return;
    }
    if (!formData.description.trim()) {
      toast("Please enter a description", {
        type: "warning",
      });
      return;
    }
    if (!formData.content.trim()) {
      toast("Please enter cooking instructions", {
        type: "warning",
      });
      return;
    }
    if (formData.ingredients.length === 0) {
      toast("Please add at least one ingredient", {
        type: "warning",
      });
      return;
    }

    setLoadingState(true);
    setLoadingText("Creating the recipe...");
    try {
      const submissionData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") return;
        if (Array.isArray(value)) {
          submissionData.append(key, JSON.stringify(value));
        } else {
          submissionData.append(key, value);
        }
      });

      formData.images.forEach((file) => {
        submissionData.append("images", file);
      });
      console.log(submissionData);

      const { data } = await api.post("/posts", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Recipe created:", data.payload.datas);
      toast(data.payload.message || "Recipe created successfully!", {
        type: "success",
      });
      navigate("/recipes");
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast(
        error.response.data.payload.message ||
          "Failed to create recipe. Please try again.",
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
    <div className="min-h-screen bg-linear-to-b from-white to-green-50">
      <Loading status={loadingState} fullscreen text={loadingText} />

      {/* Header */}
      <div className="bg-linear-to-r from-primary to-green-600 text-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-green-100 transition mb-4 cursor-pointer"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold">Create New Recipe</h1>
          <p className="text-green-100 mt-2">
            Share your culinary masterpiece with the community
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📝 Basic Information
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Homemade Margherita Pizza"
                className="input w-full rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A brief description of your recipe..."
                rows="3"
                className="textarea w-full rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select w-full border-2 border-gray-200 focus:border-primary rounded-xl outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: diff.value,
                        }))
                      }
                      className={`btn rounded-xl font-semibold text-sm transition cursor-pointer ${
                        formData.difficulty === diff.value
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {diff.emoji} {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prep Time (min)
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleTimeChange}
                  min="0"
                  className="input w-full rounded-xl border-2 border-gray-200  focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cook Time (min)
                </label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleTimeChange}
                  min="0"
                  className="input w-full rounded-xl border-2 border-gray-200  focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  min="1"
                  className="input w-full rounded-xl border-2 border-gray-200  focus:border-primary outline-none transition"
                />
              </div>
            </div>

            {formData.time > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  ⏱️ Total Time:{" "}
                  <span className="font-bold">{formData.time} minutes</span>
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🥗 Ingredients
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient(e)}
                placeholder="e.g., 2 cups all-purpose flour"
                className="input flex-1 rounded-xl border-2 border-gray-200  focus:border-primary outline-none transition"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="btn rounded-xl bg-primary text-white font-semibold hover:bg-hprimary transition flex items-center gap-2"
              >
                <HiPlus className="w-5 h-5" />
                Add
              </button>
            </div>

            {formData.ingredients.length > 0 && (
              <ul className="space-y-2 max-h-48 overflow-auto">
                {formData.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <HiCheck className="w-5 h-5 text-primary" />
                      {ingredient}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-1 hover:bg-red-100 rounded-full transition cursor-pointer"
                    >
                      <HiX className="w-5 h-5 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📖 Cooking Instructions
            </h2>

            <InstructionsInput
              value={formData.content}
              onChange={(e) => handleChange(e)}
              name="content"
              required
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🏷️ Tags
              </h2>
              <button
                type="button"
                onClick={generateTags}
                className="btn rounded-xl font-semibold flex items-center gap-2 
             bg-linear-to-r from-[#6F73FF] to-[#9A6BFF]
             text-white shadow-md hover:shadow-lg
             hover:from-[#7A7EFF] hover:to-[#A978FF]
             transition-all active:scale-95"
              >
                <HiSparkles className="w-5 h-5" />
                Generate Tags
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                placeholder="e.g., Vegan, Gluten-Free, Italian"
                className="input flex-1 rounded-xl border-2 border-gray-200  focus:border-primary outline-none transition"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn bg-primary text-white rounded-xl font-semibold hover:bg-hprimary transition flex items-center gap-2"
              >
                <HiPlus className="w-5 h-5" />
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-full font-medium flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-green-200 rounded-full transition cursor-pointer"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📸 Recipe Images
            </h2>

            <ImageUploader
              maxFiles={6}
              maxSizeMB={5}
              onChange={(files) =>
                setFormData((prev) => ({
                  ...prev,
                  images: [...(prev.images || []), ...files],
                }))
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-xl md:btn-lg flex-1 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-xl md:btn-lg flex-1 bg-linear-to-r from-primary to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition cursor-pointer "
            >
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
