// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Dharma_Logo.jpeg";
import homeImg from "../Images/home.png"; // Hero image

const Header = ({ visible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (page) => {
    setIsMenuOpen(false);
    if (page === "home") navigate("/");
    if (page === "collections") navigate("/products");
  };

  const handleShopNow = () => {
    setIsMenuOpen(false);
    navigate("/products");
  };

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", page: "home" },
    { name: "About", href: "#about" },
    { name: "Collections", page: "collections" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="relative z-50">
      {/* Navbar */}
      <nav
        className={`fixed w-full top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
          isScrolled
            ? "bg-emerald-900/95 backdrop-blur-md shadow-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigateTo("home")}
        >
          <img
            src={logo}
            alt="Dhara Logo"
            className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-md"
          />
          <span className="text-yellow-500 font-serif text-2xl tracking-wide hover:scale-105 transition-transform">
            Dhara
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg font-medium text-yellow-200">
          {menuItems.map((item) =>
            item.page ? (
              <li key={item.name}>
                <button
                  onClick={() => navigateTo(item.page)}
                  className="hover:text-yellow-400 transition font-semibold"
                >
                  {item.name}
                </button>
              </li>
            ) : (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="hover:text-yellow-400 transition font-semibold"
                >
                  {item.name}
                </a>
              </li>
            )
          )}
          <li>
            <button
              onClick={() => navigate("/products")}
              className="bg-yellow-500 text-emerald-900 font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition"
            >
              Shop Now
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden flex flex-col gap-1 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={`w-6 h-0.5 bg-yellow-400 transform transition-transform ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-yellow-400 transition-opacity ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-yellow-400 transform transition-transform ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-emerald-900 text-yellow-200 px-6 py-4 space-y-4 z-40 shadow-lg animate-fade-in">
          {menuItems.map((item) =>
            item.page ? (
              <button
                key={item.name}
                onClick={() => navigateTo(item.page)}
                className="block w-full text-left hover:text-yellow-400 transition font-semibold py-2"
              >
                {item.name}
              </button>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left hover:text-yellow-400 transition font-semibold py-2"
              >
                {item.name}
              </a>
            )
          )}
        </div>
      )}


{/* Hero Section */}
{visible && (
  <section className="relative min-h-screen text-yellow-100 pt-16 flex items-center">
    {/* Background Image */}
    <img
      src={homeImg}
      alt="Hero"
      className="absolute inset-0 w-full h-full object-cover brightness-75"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 to-black/70"></div>

    {/* Hero Content */}
    <div className="relative z-10 max-w-3xl px-6 ml-8 md:ml-16">
      <h1 className="text-5xl md:text-6xl font-serif text-yellow-400 drop-shadow mb-4 animate-slide-down">
        BORROW. WEAR. RETURN.
      </h1>
      <p className="text-lg md:text-xl mb-6 text-yellow-200 animate-fade-in">
        Rent exquisite jewelry for life’s most treasured moments ✨
      </p>
      <button
        onClick={handleShopNow}
        className="bg-yellow-500 text-emerald-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition animate-bounce"
      >
        Explore Collections
      </button>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
      <span className="block w-3 h-3 border-b-2 border-r-2 border-yellow-300 rotate-45"></span>
    </div>
  </section>
)}


    </header>
  );
};

export default Header;
