import { HiSearch, HiOutlineSparkles, HiUsers, HiHeart } from "react-icons/hi";

import api from "@/api/axios";

import CookIllust from "@/assets/cook.png";
import RecipeCarousel from "../components/RecipeCarousel";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import SearchDrawer from "../components/SearchDrawer";

const features = [
  {
    icon: <HiOutlineSparkles className="w-8 h-8" />,
    title: "AI-Powered Search",
    description:
      "Our smart AI finds recipes that match your dietary needs and preferences perfectly.",
  },
  {
    icon: <HiHeart className="w-8 h-8" />,
    title: "Allergy-Friendly",
    description:
      "Filter out allergens and find safe, delicious recipes tailored to your health needs.",
  },
  {
    icon: <HiUsers className="w-8 h-8" />,
    title: "Personalized Plans",
    description:
      "Get custom meal suggestions based on your diet plan, whether keto, vegan, or paleo.",
  },
];

export default function SavoryNotesHome() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [popularRecipes, setPopularRecipes] = useState([]);
  const categoryList = {
    ALL: "all",
    ENTREE: "entree",
    BREAKFAST: "breakfast",
    LUNCH: "lunch",
    DINNER: "dinner",
    DESSERT: "dessert",
    "QUICK BITES": "quickBites",
  };
  const [activeFilter, setActiveFilter] = useState("all");

  const getPosts = async () => {
    const params = new URLSearchParams();
    if (activeFilter !== "all") {
      params.append("category", activeFilter.toLowerCase());
    }

    // if (selectedTags.length > 0) {
    //   params.append("tags", selectedTags.join(","));
    // }

    // if (searchTerm) {
    //   params.append("search", searchTerm);
    // }

    // params.append("sort", sort);
    // params.append("page", page);
    // params.append("limit", 10);
    try {
      const { data } = await api.get(`/posts?${params.toString()}`);
      console.log(data);
      setPopularRecipes(data.payload.datas);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
          {/* Text Content */}
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
              <button className="px-8 py-4 rounded-full text-white font-semibold text-lg bg-green-500 hover:bg-green-600 transition transform hover:scale-105 shadow-lg">
                Start Cooking
              </button>
              <button className="px-8 py-4 rounded-full border-2 border-green-500 text-green-500 font-semibold text-lg hover:bg-green-500 hover:text-white transition transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Illustrations */}
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Search Bar Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center flex-1 bg-gray-100 rounded-full px-4 py-3 shadow-sm hover:shadow-md transition">
              <HiSearch className="w-6 h-6 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search for recipes... (e.g., 'gluten-free pasta')"
                className="flex-1 bg-transparent outline-none text-base sm:text-lg ml-3"
              />
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-8 py-3 rounded-full text-white font-semibold bg-orange-500 hover:bg-orange-600 transition shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {["Vegan", "Keto", "Gluten-Free", "Dairy-Free"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-sm border-2 border-green-500 text-green-500 cursor-pointer hover:bg-green-500 hover:text-white transition font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-500">
            Featured Recipes
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Tried, tested, and loved by our community
          </p>
        </div>

        <RecipeCarousel popularRecipes={popularRecipes} />
      </section>

      {/* List Recipes Section */}
      <div className="">
        {/* Main Heading */}
        <div className="text-center px-4 mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#4CAF50" }}
          >
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {popularRecipes.length === 0 ? (
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
              {popularRecipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-bold text-white mb-6 w-fit"
              style={{ backgroundColor: "#FF8F3A" }}
            >
              OUR BLOG
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#4CAF50" }}
            >
              OUR CULINARY
              <br />
              CHRONICLE
            </h2>
            <p className="text-gray-600 mb-6">
              Immerse yourself in our culinary creativity, and discover the
              stories behind our signature dishes and culinary experiences. Join
              us in savoring the essence of every dish on your table.
            </p>
            <button
              className="px-8 py-3 rounded-full font-semibold text-white w-fit transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: "#4CAF50" }}
            >
              READ MORE
            </button>
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl p-12 text-center shadow-2xl bg-green-500">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to inspire other home cooks?
          </h2>
          <p className="text-white text-lg mb-8 opacity-90">
            Share your favorite recipes and become part of our growing
            community!
          </p>
          <button className="px-10 py-4 rounded-full font-bold text-lg text-green-800 bg-yellow-300 hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg">
            Register Now
          </button>
        </div>
      </section>

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        recipes={popularRecipes}
      />
    </div>
  );
}
