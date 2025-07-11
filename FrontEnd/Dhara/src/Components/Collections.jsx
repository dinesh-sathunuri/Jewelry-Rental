import React from "react";
import "../styles/Collection_HomePage.css";
import collection1 from "../Images/collection1.png";
import collection2 from "../Images/collection2.png";
import collection3 from "../Images/collection3.png";

const Collections = () => {
  const collectionImages = [
    { src: collection1, alt: "Classic Elegance" },
    { src: collection2, alt: "Modern Statement" },
    { src: collection3, alt: "Timeless Glamour" },
  ];

  return (
    <section className="collections">
      <div className="collections-container">
        <div className="collections-title">
          <h2>Our Signature Collections</h2>
          <p>
            Whether you seek elegant simplicity for everyday wear or a striking
            design for life's grand occasions, our collections offer a diverse
            range of styles to suit every taste and preference.
          </p>
        </div>

        <div className="collections-grid">
          {collectionImages.map((image, index) => (
            <div className="collection-item" key={index}>
              <img src={image.src} alt={image.alt} />
              <p>{image.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
