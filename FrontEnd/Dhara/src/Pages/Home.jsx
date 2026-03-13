// src/pages/HomePage.jsx
import React from 'react';
import Header from '../Components/Header.jsx';
import Collections from '../Components/Collections.jsx';
import ReviewSection from '../Components/ReviewSection.jsx';
import Footer from '../Components/Footer.jsx';
import HowItWorks from '../Components/HowItWorks.jsx';
export default function HomePage() {
  return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900">
      <Header visible={true} />
      <Collections />
      <HowItWorks />
      <ReviewSection />
      <Footer />
    </div>
  );
}
