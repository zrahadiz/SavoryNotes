import { HiClock, HiFire, HiUser } from "react-icons/hi";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
      {/* Image */}

      <div className="relative h-56 overflow-hidden">
        <img
          src={recipe.images}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3" style={{ color: "#333" }}>
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

        {/* View Recipe Button */}
        <button className="btn w-full py-3 rounded-full font-semibold transition-all duration-300 border-2 border-primary bg-transparent hover:bg-primary text-primary hover:text-white  cursor-pointer">
          VIEW RECIPE
        </button>
      </div>
    </div>
  );
}
