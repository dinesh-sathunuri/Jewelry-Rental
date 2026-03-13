// src/Components/HowItWorks.jsx
import React from "react";
import { Calendar, Store, Gem } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Calendar className="w-10 h-10 text-yellow-400" />,
      title: "Book an Appointment",
      description:
        "Reserve your slot easily through our Google Sheet booking system.",
    },
    {
      icon: <Store className="w-10 h-10 text-yellow-400" />,
      title: "Visit Our Store",
      description:
        "Come to our store at your booked time and explore our jewelry collection in person.",
    },
    {
      icon: <Gem className="w-10 h-10 text-yellow-400" />,
      title: "Choose & Rent",
      description:
        "Pick your favorite design, complete the rental process, and shine at your event!",
    },
  ];

  return (
<section className="py-20 bg-yellow-50 text-emerald-900">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-serif mb-12 text-emerald-700">
      How It Works
    </h2>

    <div className="grid md:grid-cols-3 gap-10">
      {steps.map((step, index) => (
        <div
          key={index}
          className="p-8 rounded-2xl bg-white shadow-lg border border-yellow-200 hover:shadow-yellow-400/40 transition-transform transform hover:-translate-y-2"
        >
          <div className="flex justify-center mb-6">{step.icon}</div>
          <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
          <p className="text-emerald-700">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default HowItWorks;
