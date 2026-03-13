// src/Components/Footer.jsx
import React from "react";
import { FaInstagram, FaFacebookF, FaPinterestP, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import logo from "../Images/Dharma_Logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-yellow-100">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left Side: Logo + Content */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <img src={logo} alt="Dhara Logo" className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-md"/>
          <div>
            <h2 className="text-2xl font-serif text-yellow-400 mb-2">Dhara</h2>
            <p className="text-yellow-200 max-w-xs">
              Rent exquisite jewelry for life’s most treasured moments. Elegant designs, timeless style, and exceptional quality for every occasion.
            </p>
          </div>
        </div>

        {/* Right Side: Customer Service + Connect */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Customer Service */}
          <div>
            <h4 className="text-xl font-serif mb-4 text-yellow-400">CUSTOMER SERVICE</h4>
            <ul className="space-y-2">
              {["Shipping & Returns", "Terms & Conditions", "Trust & Safety", "Blog", "FAQ", "Our Story"].map((item) => (
                <li key={item} className="hover:text-yellow-300 transition-colors cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xl font-serif mb-4 text-yellow-400">CONNECT WITH US</h4>
            <div className="flex gap-4 mb-4 text-yellow-100">
              <a href="https://instagram.com/dharafashionsdmv" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="hover:text-yellow-300 cursor-pointer" />
              </a>
              <a href="https://facebook.com/dharafashionsdmv" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="hover:text-yellow-300 cursor-pointer" />
              </a>
            </div>
            <div className="space-y-2 text-yellow-200">
              <p><FaPhoneAlt className="inline mr-2" /> (475) 439 4433</p>
              <p>
                <FaEnvelope className="inline mr-2" />
                <a href="mailto:dharafashionsdmv@gmail.com" className="underline hover:text-yellow-300">dharafashionsdmv@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-yellow-500 mt-6 pt-4 text-center text-yellow-200">
        © 2025 Dhara. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
