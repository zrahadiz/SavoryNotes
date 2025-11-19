import { Link } from "react-router-dom";
import {
  HiSparkles,
  HiHeart,
  HiUsers,
  HiLightBulb,
  HiSearch,
  HiClock,
} from "react-icons/hi";

const features = [
  {
    icon: <HiSparkles className="w-8 h-8" />,
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
  {
    icon: <HiSearch className="w-8 h-8" />,
    title: "Smart Search",
    description:
      "Find recipes by title, description, tags, cooking time, difficulty level, or cuisine type in seconds.",
  },
  {
    icon: <HiClock className="w-8 h-8" />,
    title: "Time-Saving",
    description:
      "Get personalized meal suggestions that fit your schedule and cooking skill level.",
  },
  {
    icon: <HiLightBulb className="w-8 h-8" />,
    title: "Easy to Follow",
    description:
      "Step-by-step instructions with beautiful formatting make cooking a breeze.",
  },
];

const values = [
  {
    emoji: "🌱",
    title: "Inclusivity",
    description:
      "Everyone deserves delicious food, regardless of dietary restrictions or cooking experience.",
  },
  {
    emoji: "🤝",
    title: "Community",
    description:
      "We believe the best recipes come from shared experiences and home cooks helping each other.",
  },
  {
    emoji: "✨",
    title: "Innovation",
    description:
      "We use cutting-edge AI technology to make recipe discovery smarter and more personalized.",
  },
  {
    emoji: "💚",
    title: "Quality",
    description:
      "Every recipe is crafted with care, tested by real people, and designed to bring joy to your kitchen.",
  },
];

const stats = [
  { heading: "Intelligent", label: "Ask anything to our ChefBot" },
  { heading: "Precision", label: "Recipes Filtering" },
  { heading: "Fully", label: "Search Engine" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-green-500 to-green-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🍳</div>
          <div className="absolute top-40 right-20 text-7xl">🥗</div>
          <div className="absolute bottom-20 left-1/4 text-8xl">🍝</div>
          <div className="absolute bottom-10 right-10 text-6xl">🥘</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            About SavoryNotes
          </h1>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Where AI meets culinary passion, guiding you to discover, create,
            and share recipes—with instant, expert answers to all your cooking
            questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recipes"
              className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-xl"
            >
              Explore Recipes
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition shadow-xl"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We believe cooking should be{" "}
            <span className="font-bold text-green-600">
              accessible, enjoyable, and personalized
            </span>{" "}
            for everyone. SavoryNotes was born from a simple idea: what if
            technology could help you find the perfect recipe that matches not
            just your taste, but your dietary needs, time constraints, and skill
            level?
          </p>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 shadow-lg">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Whether you're navigating food allergies, tracking calories,
            following a specific diet, or just need a quick weeknight meal, our{" "}
            <span className="font-semibold ">AI ChefBot</span> is your culinary
            co-pilot. Instantly swap ingredients, count nutrition, and discover
            recipes that work only for{" "}
            <span className="font-semibold italic">you</span>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            More than just a recipe website, SavoryNotes is a community of home
            cooks, food enthusiasts, and culinary adventurers sharing their love
            of cooking with the world.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-linear-to-r from-green-500 to-green-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.heading}
                </div>
                <div className="text-green-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Makes Us Special
          </h2>
          <p className="text-xl text-gray-600">
            Features designed to make your cooking journey easier and more
            enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">{value.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of home cooks discovering recipes they love
          </p>
          <Link
            to="/recipes"
            className="inline-block px-10 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-xl transform hover:scale-105"
          >
            Explore Recipes Now
          </Link>
        </div>
      </div>

      {/* Team/Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            We'd Love to Hear From You
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions, feedback, or just want to say hi? We're always here
            to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:savorynotes009@gmail.com"
              className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
            >
              📧 Email Us
            </a>
            <Link
              to="/register"
              className="px-6 py-3 bg-white border-2 border-green-500 text-green-600 rounded-full font-semibold hover:bg-green-50 transition"
            >
              💬 Join Our Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
