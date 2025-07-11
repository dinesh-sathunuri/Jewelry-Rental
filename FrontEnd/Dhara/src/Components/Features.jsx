import React from "react";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react"; 
import "../Styles/Features_HomePage.css"; 
const Features = () => {
  const features = [
    { icon: <Truck size={32} />, title: "Very Fast Shipping" },
    { icon: <ShieldCheck size={32} />, title: "Secure Payments" },
    { icon: <RotateCcw size={32} />, title: "Hassle-Free Returns" },
  ];

  return (
    <section class="Features">
        <div class="Features-grid">
          {features.map((feature, index) => (
            <div class="Features-grid-item" key={index}>
              <span class="icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>
    </section>
  );
};
export default Features;