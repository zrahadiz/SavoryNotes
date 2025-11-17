import { useState } from "react";

import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold" style={{ color: "#4CAF50" }}>
              SavoryNotes
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#recipes"
              className="text-gray-700 hover:text-[#4CAF50] transition"
            >
              Recipes
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-[#4CAF50] transition"
            >
              About
            </a>
            <a
              href="#blog"
              className="text-gray-700 hover:text-[#4CAF50] transition"
            >
              Blog
            </a>
            <button
              className="px-6 py-2 rounded-full text-white font-semibold transition transform hover:scale-105"
              style={{ backgroundColor: "#FF8F3A" }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 space-y-4 z-40">
            <a
              href="#recipes"
              className="block text-gray-700 hover:text-[#4CAF50]"
            >
              Recipes
            </a>
            <a
              href="#about"
              className="block text-gray-700 hover:text-[#4CAF50]"
            >
              About
            </a>
            <a
              href="#blog"
              className="block text-gray-700 hover:text-[#4CAF50]"
            >
              Blog
            </a>
            <button className="w-full px-6 py-2 rounded-full text-white font-semibold bg-[#FF8F3A]">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
