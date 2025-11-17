import { useEffect, useState } from "react";
import { FaCircleLeft, FaCircleRight } from "react-icons/fa6";
import RecipeCard from "@/components/RecipeCard";

export default function RecipeCarousel({ popularRecipes }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const recipesPerSlide = {
    mobile: 1,
    desktop: 2,
  };

  const totalSlidesDesktop = Math.ceil(
    popularRecipes.length / recipesPerSlide.desktop
  );
  const totalSlidesMobile = Math.ceil(
    popularRecipes.length / recipesPerSlide.mobile
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalSlides = isMobile ? totalSlidesMobile : totalSlidesDesktop;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <button
          onClick={prevSlide}
          className="hidden bg-primary md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg transition transform hover:scale-110 cursor-pointer"
          aria-label="Previous slide"
        >
          <FaCircleLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden bg-primary md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 rounded-full items-center justify-center shadow-lg transition transform hover:scale-110 cursor-pointer"
          aria-label="Next slide"
        >
          <FaCircleRight className="w-6 h-6 text-white" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlidesDesktop }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="hidden md:grid md:grid-cols-2 gap-8 min-w-full p-5"
              >
                {popularRecipes
                  .slice(slideIndex * 2, slideIndex * 2 + 2)
                  .map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                  ))}
              </div>
            ))}

            {/* Mobile View: 1 recipe per slide */}
            {popularRecipes.map((recipe, index) => (
              <div key={`mobile-${index}`} className="md:hidden min-w-full p-3">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="flex md:hidden justify-center gap-4">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#4CAF50" }}
            aria-label="Previous slide"
          >
            <FaCircleLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#4CAF50" }}
            aria-label="Next slide"
          >
            <FaCircleRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: currentSlide === index ? "#4CAF50" : "#d1d5db",
                transform: currentSlide === index ? "scale(1.2)" : "scale(1)",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* View All Button */}
      {/* <div className="text-center mt-12">
        <button
          className="px-8 py-3 rounded-full font-semibold text-white transition transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: "#FF8F3A" }}
        >
          View All Recipes
        </button>
      </div> */}
    </div>
  );
}
