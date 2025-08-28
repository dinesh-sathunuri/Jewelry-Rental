import React, { useEffect, useRef } from "react";
import "../styles/Collection_HomePage.css";
import collection1 from "../Images/collection1.jpeg";
import collection2 from "../Images/collection2.jpeg";
import collection3 from "../Images/collection3.jpeg";

const Collections = () => {
  const collectionImages = [
    { src: collection1, alt: "Classic Elegance" },
    { src: collection2, alt: "Modern Statement" },
    { src: collection3, alt: "Timeless Glamour" },
  ];

  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="collections">
      <div className="collections-container">
        <div className="collections-title">
          <h2>Our Signature Collections</h2>
          <p>
            From subtle elegance to bold statements, our signature collections
            offer timeless designs crafted with care for every occasion.
          </p>
        </div>

        <div className="collections-grid">
          {collectionImages.map((image, index) => (
            <div
              className="collection-item hidden"
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={{ animationDelay: `${index * 0.2}s` }}
              tabIndex={0}
            >
              <div className="collection-image-wrapper">
                <img src={image.src} alt={image.alt} />
              </div>
              <p>{image.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
