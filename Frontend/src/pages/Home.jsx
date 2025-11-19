import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import api from "@/api/axios";
import { toast } from "@/lib/toast";

import RecipeCarousel from "@/components/RecipeCarousel";
import RecipeCard from "@/components/RecipeCard";
import SearchDrawer from "@/components/SearchDrawer";
import Loading from "@/components/Loading";

import CookIllust from "@/assets/cook.png";
import { HiSearch, HiOutlineSparkles, HiUsers, HiHeart } from "react-icons/hi";

const features = [
  {
    icon: <HiOutlineSparkles className="w-8 h-8" />,
    title: "AI Co-Pilot",
    description:
      "Your personal co-chef! Instantly ask for ingredient substitutes, precise nutritional counts, or cooking tips for each recipe.",
  },
  {
    icon: <HiHeart className="w-8 h-8" />,
    title: "Allergy-Friendly",
    description:
      "Filter recipes by search based on tags and swap any ingridients to ensure safe, delicious meals for everyone.",
  },
  {
    icon: <HiUsers className="w-8 h-8" />,
    title: "Community-Driven",
    description:
      "Share your culinary creations and discover recipes from home cooks around the world.",
  },
];

const categoryList = {
  ALL: "all",
  ENTREE: "entree",
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  DESSERT: "dessert",
  "QUICK BITES": "quickBites",
};

export default function SavoryNotesHome() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialSearch, setInitialSearch] = useState("");

  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const featuredPosts = async () => {
    const params = new URLSearchParams();
    params.append("limit", 10);
    setLoadingState(true);
    setLoadingText("Get Featured recipe...");
    try {
      const { data } = await api.get(`/posts?${params.toString()}`);
      setFeaturedRecipes(data.payload.datas);
    } catch (error) {
      console.error(error);
      toast(
        error.response.data.payload.message ||
          "Failed to get featured recipes.",
        {
          type: "error",
        }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  const getRecipes = async () => {
    const params = new URLSearchParams();
    if (activeFilter !== "all") {
      params.append("category", activeFilter);
    }
    params.append("limit", 6);
    setLoadingState(true);
    setLoadingText("Get recipe...");
    try {
      const { data } = await api.get(`/posts?${params.toString()}`);
      setRecipes(data.payload.datas);
    } catch (error) {
      console.error(error);
      toast(
        error.response.data.payload.message ||
          "Failed to get featured recipes.",
        {
          type: "error",
        }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  useEffect(() => {
    featuredPosts();
  }, []);

  useEffect(() => {
    getRecipes();
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50 py-24">
      <Loading status={loadingState} fullscreen text={loadingText} />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-green-600">
              Cook What You Love,
              <br />
              <span className="text-orange-500">Love What You Cook</span>
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-md mx-auto md:mx-0">
              Discover personalized recipes that match your dietary needs,
              allergies, and taste preferences. Let our AI be your personal chef
              assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/recipes")}
                className="px-8 py-4 rounded-full text-white font-semibold text-lg bg-green-500 hover:bg-green-600 transition transform cursor-pointer hover:scale-105 shadow-lg"
              >
                Start Cooking
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 rounded-full border-2 border-green-500 text-green-500 font-semibold text-lg hover:bg-green-500 hover:text-white transition transform cursor-pointer hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-md flex justify-center md:justify-end">
            <img
              src={CookIllust}
              alt="Cooking illustration"
              className=" w-1/2 md:w-4/5 h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div
            onClick={() => {
              setInitialSearch("");
              setIsSearchOpen(true);
            }}
            className="flex items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-full px-5 py-4 shadow-sm hover:shadow-md"
          >
            <HiSearch className="w-6 h-6 text-gray-500" />
            <span className="ml-3 text-gray-600 text-lg font-medium">
              Search for recipes...
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {["Vegetarian", "High-Protein", "Sweet", "No-Bake", "Baking"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setInitialSearch(tag);
                    setIsSearchOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-full text-sm border border-green-500 text-green-600 cursor-pointer hover:bg-green-500 hover:text-white transition font-medium"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="text-left mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-500">
            Featured Recipes
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Tried, tested, and loved by our community
          </p>
        </div>

        <RecipeCarousel popularRecipes={featuredRecipes} />
      </section>

      {/* Top 6 Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="text-center px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            EMBARK ON A<br />
            JOURNEY
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            With our smart selection of Recipes and Find something to
            <br />
            satisfy every palate.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 px-4 mb-12">
          {Object.entries(categoryList).map(([label, value], index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(value)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                value === activeFilter
                  ? "text-white shadow-lg transform hover:scale-105 bg-primary"
                  : "bg-white text-gray-700 border-2 border-[#e5e7eb] hover:border-[#4CAF50] hover:text-[#4CAF50]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {recipes.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-600">
                No recipes found
              </h2>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-500">
            Why Choose SavoryNotes?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Your personal cooking companion powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80"
                alt="Cooking salmon"
                className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="Chef preparing food"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80"
                alt="Cooking in pan"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col justify-center order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              SMART COOKING,
              <br />
              SIMPLE LIFE
            </h2>
            <p className="text-gray-600 mb-6">
              We started SavoryNotes to remove kitchen stress. Our solution? The
              SavoryNotes AI Chef Bot. This technology is the heart of our
              platform, ensuring that every recipe discovery is perfectly tuned
              to your life—filtering for allergies, calculating nutritional
              facts, and providing on-demand guidance that makes cooking
              enjoyable and effortless.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-500 text-white text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <div className="rounded-3xl p-12 text-center shadow-2xl bg-green-500">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to inspire other home cooks?
            </h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Share your favorite recipes and become part of our growing
              community!
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 rounded-full font-bold text-lg text-green-800 bg-yellow-300 hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg cursor-pointer"
            >
              Register Now
            </button>
          </div>
        </section>
      )}

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialSearch={initialSearch}
      />
    </div>
  );
}
