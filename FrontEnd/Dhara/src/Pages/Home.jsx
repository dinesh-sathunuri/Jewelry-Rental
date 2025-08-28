// src/pages/HomePage.jsx
import React from 'react';
import Header from '../Components/Header.jsx';
import Features from '../Components/Features.jsx';
import Collections from '../Components/Collections.jsx';
import Footer from '../Components/Footer.jsx';
import ReviewSection from '../Components/ReviewSection.jsx';
export default function HomePage() {
  return (
    <>
      <Header visible={true} />
      <Collections />
      <ReviewSection />
      <Footer />
    </>
  );
}
