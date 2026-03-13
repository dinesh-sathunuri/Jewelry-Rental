import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles, Crown, Diamond, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const JewelryRentalWebsite = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collections = [
    {
      title: "Classic Elegance",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=600&fit=crop",
      description: "Timeless pieces for sophisticated occasions"
    },
    {
      title: "Modern Statement",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=600&fit=crop",
      description: "Bold designs for the contemporary woman"
    },
    {
      title: "Timeless Glamour",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=600&fit=crop",
      description: "Vintage-inspired luxury for special moments"
    }
  ];

  const reviews = [
    {
      name: "Sophia A.",
      text: "Absolutely stunning collection! I wore the necklace to a wedding and got so many compliments.",
      rating: 5
    },
    {
      name: "Liam K.", 
      text: "Great service and high-quality jewelry. Will definitely rent again!",
      rating: 5
    },
    {
      name: "Mira P.",
      text: "Easy process and beautiful pieces. Highly recommended!",
      rating: 5
    }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-emerald-900/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-yellow-400 tracking-wider hover:scale-105 transition-transform cursor-pointer">
              TREJOURS
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Collections', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white hover:text-yellow-400 transition-colors font-medium tracking-wide"
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-yellow-400 transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-current transform transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                {['Home', 'About', 'Collections', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white hover:text-yellow-400 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-emerald-900/80 via-transparent to-emerald-900/80"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 text-yellow-400/20 animate-bounce">
          <Diamond size={60} />
        </div>
        <div className="absolute bottom-40 right-20 text-yellow-400/20 animate-pulse">
          <Crown size={80} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-yellow-400/10 animate-spin" style={{ animationDuration: '20s' }}>
          <Sparkles size={100} />
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="mb-8 inline-block">
            <div className="flex items-center justify-center space-x-4 text-yellow-400 mb-4">
              <Diamond className="animate-pulse" />
              <Sparkles className="animate-bounce" />
              <Crown className="animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-wider">
            <span className="text-yellow-400">BORROW</span>
            <span className="text-white">.</span>
            <span className="text-yellow-400">WEAR</span>
            <span className="text-white">.</span>
            <span className="text-yellow-400">RETURN</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-light">
            Rent exquisite jewelry for life's most treasured days
          </p>
          
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-4 px-12 rounded-full text-lg tracking-wide transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25">
            SHOP NOW
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-yellow-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-900 to-emerald-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Our Signature Collections</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From subtle elegance to bold statements, our signature collections offer timeless designs crafted with care for every occasion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-yellow-400/10 to-emerald-900/50 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-yellow-400/10"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-2xl">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-3">{collection.title}</h3>
                  <p className="text-gray-300">{collection.description}</p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-800 to-emerald-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Customer Reviews</h2>
            <div className="flex justify-center space-x-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-400/10 to-emerald-800/30 backdrop-blur-sm rounded-3xl p-12 border border-yellow-400/20 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 text-yellow-400">
                  <Diamond size={40} />
                </div>
                <div className="absolute bottom-4 right-4 text-yellow-400">
                  <Crown size={40} />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400">
                  <Sparkles size={60} />
                </div>
              </div>

              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <p className="text-2xl md:text-3xl text-white italic mb-6 leading-relaxed">
                    "{reviews[currentReview].text}"
                  </p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(reviews[currentReview].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xl text-yellow-400 font-semibold">— {reviews[currentReview].name}</p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={prevReview}
                    className="w-12 h-12 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 rounded-full flex items-center justify-center text-yellow-400 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextReview}
                    className="w-12 h-12 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 rounded-full flex items-center justify-center text-yellow-400 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 border-t border-yellow-400/20">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Customer Service */}
            <div>
              <h4 className="text-2xl font-bold text-yellow-400 mb-6 tracking-wide">CUSTOMER SERVICE</h4>
              <ul className="space-y-3">
                {['Shipping & Returns', 'Terms & Conditions', 'Trust & Safety', 'Blog', 'FAQ', 'Our Story'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect + Newsletter */}
            <div>
              <h4 className="text-2xl font-bold text-yellow-400 mb-6 tracking-wide">CONNECT WITH US</h4>
              
              <div className="flex space-x-4 mb-8">
                {[Instagram, Facebook, Mail].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-12 h-12 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 rounded-full flex items-center justify-center text-yellow-400 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone size={18} className="text-yellow-400" />
                  <span>(475) 439 4433</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail size={18} className="text-yellow-400" />
                  <span>info@trejours.com</span>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-4">LET'S KEEP IN TOUCH</h4>
                <p className="text-gray-300 mb-6">
                  Be the first to know about new products, designer collaborations, and more!
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS HERE"
                    className="flex-1 px-4 py-3 bg-emerald-800/50 border border-yellow-400/30 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-r-lg transition-all duration-300 hover:scale-105">
                    ➜
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-yellow-400/20 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2025 Trejours Jewelry Rental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JewelryRentalWebsite;