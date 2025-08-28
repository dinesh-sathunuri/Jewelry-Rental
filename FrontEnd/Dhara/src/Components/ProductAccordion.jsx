import { useState } from 'react';
import '../styles/ProductAccordion.css';

export default function ProductAccordion({ product }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="accordion-wrapper">
      {['Product Details', 'Shipping & Returns', 'FAQ'].map((section, index) => (
        <div className="accordion-item" key={index}>
          <div className="accordion-header" onClick={() => toggleSection(section)}>
            <span>{section}</span>
            <span className={`arrow ${openSection === section ? 'open' : ''}`}>&#9662;</span>
          </div>
          <div className={`accordion-content ${openSection === section ? 'open' : ''}`}>
            {section === 'Product Details' && (
              <p>{product.comments}</p>
            )}
            {section === 'Shipping & Returns' && (
              <p>At Glamourental, we understand that fit is important. However, due to the nature of fashion rentals, we do not offer refunds for sizing issues...</p>
            )}
            {section === 'FAQ' && (
              <p>For any product-related queries, contact us via WhatsApp or fill out the form below.</p>
            )}
          </div>
        </div>
      ))}

      <div className="accordion-footer">
        <a
          href="https://wa.me/919999999999?text=I'm%20interested%20in%20this%20product"
          className="icon-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">❓</span> Ask a question
        </a>

        <a
          href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
          className="icon-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">📝</span> Fill Google Form
        </a>

        <a href="#" className="icon-link">
          <span className="icon">🔗</span> Share
        </a>
      </div>
    </div>
  );
}
