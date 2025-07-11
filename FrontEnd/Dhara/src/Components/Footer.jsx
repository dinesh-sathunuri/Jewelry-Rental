import React from "react";
import "../Styles/Footer_HomePage.css";
import { FaInstagram, FaFacebookF, FaPinterestP, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* Customer Service */}
        <div className="footer-column">
          <h4>CUSTOMER SERVICE</h4>
          <ul>
            <li>Shipping & Returns</li>
            <li>Terms & Conditions</li>
            <li>Trust & Safety</li>
            <li>Blog</li>
            <li>FAQ</li>
            <li>Our Story</li>
          </ul>
        </div>

        {/* Vendors */}
        <div className="footer-column">
          <h4>VENDORS</h4>
          <ul>
            <li>Become a Vendor</li>
            <li>Vendor Sign In</li>
          </ul>
          <div className="footer-badge">
            <p>As seen on</p>
            <strong>the Knot</strong>
          </div>
        </div>

        {/* Connect + Newsletter */}
        <div className="footer-column">
          <h4>CONNECT WITH US</h4>
          <div className="footer-icons">
            <FaInstagram />
            <FaFacebookF />
            <FaPinterestP />
          </div>
          <div className="footer-contact">
            <p><FaPhoneAlt /> (475) 439 4433</p>
            <p><FaEnvelope /> info@trejours.com</p>
          </div>
          <div className="newsletter">
            <h4>LET'S KEEP IN TOUCH</h4>
            <p>Be the first to know about new products, designer collaborations, and more!</p>
            <form>
              <input type="email" placeholder="YOUR EMAIL ADDRESS HERE" />
              <button type="submit">➜</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2023 Jewelry Rental. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
