import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

import SearchDrawer from "../SearchDrawer";

import {
  HiMenu,
  HiX,
  HiSearch,
  HiChevronDown,
  HiLogout,
  HiBell,
} from "react-icons/hi";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const profileRef = useRef(null);

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Recipes", path: "/recipes" },
    { label: "About", path: "/about" },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleProfile = () => setProfileOpen((prev) => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl font-bold">🍳</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                SavoryNotes
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      active
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                }}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 group cursor-pointer"
                aria-label="Search"
              >
                <HiSearch className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
              </button>

              {/* Auth Actions */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full text-white font-semibold bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Login
                </Link>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-linear-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {getInitials(user?.name)}
                    </div>
                    <span className="font-medium text-gray-800 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <HiChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 bg-linear-to-r from-green-50 to-green-100 border-b border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {getInitials(user?.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-semibold truncate">
                              {user?.name}
                            </p>
                            <p className="text-green-700 text-sm font-medium truncate">
                              {user?.role || "Member"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => navigate("/approve-user")}
                          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
                        >
                          <HiBell className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                          <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                            Inbox
                          </span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors group cursor-pointer"
                        >
                          <HiLogout className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
                          <span className="text-gray-700 group-hover:text-red-600 font-medium">
                            Logout
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiX className="w-6 h-6 text-gray-700" />
              ) : (
                <HiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-linear-to-b from-white to-gray-50 border-t border-gray-100 px-4 py-6 space-y-3">
            {/* Navigation Links */}
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    active
                      ? "text-green-600 bg-green-100 shadow-sm"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {active && (
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Search Button */}
            <button
              onClick={() => {
                closeMenu();
                setIsSearchOpen(true);
              }}
              className="w-full px-4 py-3 rounded-xl flex items-center gap-3 bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
            >
              <HiSearch className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
              <span className="text-gray-700 group-hover:text-green-600 font-medium">
                Search Recipes
              </span>
            </button>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center py-3 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md mt-4"
              >
                Login
              </Link>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <div className="px-4 py-3 bg-linear-to-r from-green-50 to-green-100 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold truncate">
                        {user?.name}
                      </p>
                      <p className="text-green-700 text-sm font-medium truncate">
                        {user?.role || "Member"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/approve-user")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
                >
                  <HiBell className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                    Inbox
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <HiLogout className="w-5 h-5 text-gray-600" />
                  <span className="text-red-600 font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 bg-opacity-50 transition-opacity z-40 backdrop-blur-xs"
          onClick={closeMenu}
        />
      )}

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
