import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Header_HomePage.css"; // Your CSS file
import logo from "../Images/Dharma_Logo.jpeg";

const Header = ({ visible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateHome = () => {
    setIsMenuOpen(false);
    navigate("/");
  };

  const navigateProducts = () => {
    setIsMenuOpen(false);
    navigate("/products");
  };

  const navigateAbout = () => {
    setIsMenuOpen(false);
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigateContact = () => {
    setIsMenuOpen(false);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShopNow = () => {
    setTimeout(() => {
      navigate("/products");
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector(".navbar");
      if (navbar && !navbar.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <section className="home-section" role="banner">
      <nav
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className="logo"
          onClick={navigateHome}
          tabIndex={0}
          role="link"
          aria-label="Navigate to home"
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && navigateHome()
          }
        >
          <img src={logo} alt="Dhara Logo" className="logo-image" />
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-button"
              onClick={navigateAbout}
              aria-label="Scroll to About section"
            >
              About
            </button>
          </li>
          <li className="nav-item">
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-button"
              onClick={navigateContact}
              aria-label="Scroll to Contact section"
            >
              Contact
            </button>
          </li>
        </ul>

        <div
          className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleMenu();
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {visible && (
        <div className="hero" role="main">
          <div className="hero-text">
            <h1>BORROW.WEAR.RETURN</h1>
            <p>Rent exquisite jewelry for life's most treasured days</p>
            <button
              onClick={handleShopNow}
              onMouseEnter={(e) =>
                (e.target.style.transform = "translateY(-4px) scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "translateY(0) scale(1)")
              }
            >
              Shop Now
            </button>
          </div>

          <div className="scroll-indicator" aria-hidden="true"></div>
        </div>
      )}
    </section>
  );
};

export default Header;
