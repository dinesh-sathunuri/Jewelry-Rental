// src/components/HomePage.jsx
import React from 'react';
import '../Styles/Header_HomePage.css'; // Adjust the path as necessary

const HomePage = () => {
  return (
    <div>
      <section className="home-section">
       <nav className="navbar">
          <div className="logo">
            <h1>Dhara</h1>
          </div>
          <ul className="nav-menu">
            <li className="nav-item"><a href="#home">Home</a></li>
            <li className="nav-item"><a href="#about">About</a></li>
            <li className="nav-item"><a href="#products">Products</a></li>
            <li className="nav-item"><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="hero">
          <div className="hero-text">
            <h1>BORROW.WEAR.RETURN</h1>
            <p>Rent exquisite jewelry for life's most treasured days</p>
            <button>Shop Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;