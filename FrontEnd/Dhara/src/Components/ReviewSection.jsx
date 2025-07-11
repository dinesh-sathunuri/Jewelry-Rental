import React, { useState } from "react";
import "../styles/Reviews_HomePage.css";

const reviews = [
  {
    name: "Sophia A.",
    text: "Absolutely stunning collection! I wore the necklace to a wedding and got so many compliments.",
  },
  {
    name: "Liam K.",
    text: "Great service and high-quality jewelry. Will definitely rent again!",
  },
  {
    name: "Mira P.",
    text: "Easy process and beautiful pieces. Highly recommended!",
  },
];

const ReviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === reviews.length - 1 ? 0 : prev + 1
    );
  };

  const { name, text } = reviews[currentIndex];

  return (
    <section className="review-section">
      <h2>Customer Reviews</h2>
      <div className="review-card">
        <p className="review-text">“{text}”</p>
        <p className="review-author">— {name}</p>

        <div className="review-buttons">
          <button onClick={handlePrev}>&lt;</button>
          <button onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
