import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import { productApi } from "../api";
import {
  TAG_OPTIONS,
  LENGTH_OPTIONS,
  DESIGN_OPTIONS,
  MATERIAL_OPTIONS,
} from "../Constants/productOptions";
import "../styles/ProductsPage.css";
import ProductAccordion from "../Components/ProductAccordion.jsx";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tagFilter, setTagFilter] = useState("");
  const [designFilter, setDesignFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [lengthFilter, setLengthFilter] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const productsPerPage = 12; // updated

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalProduct) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalProduct]);

  const handleImageLoad = (productId) => {
    setImageLoadingStates((prev) => ({ ...prev, [productId]: false }));
  };

  const handleImageLoadStart = (productId) => {
    setImageLoadingStates((prev) => ({ ...prev, [productId]: true }));
  };

  if (loading)
    return (
      <div className="products-page loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">Loading amazing products...</p>
      </div>
    );

  if (error) return <div className="products-page error">{error}</div>;

  const filteredProducts = products.filter((product) => {
    const matchesTag =
      !tagFilter ||
      (product.tag &&
        Array.isArray(product.tag) &&
        product.tag.some((t) => t.toLowerCase() === tagFilter.toLowerCase()));

    const matchesDesign =
      !designFilter ||
      (product.design &&
        Array.isArray(product.design) &&
        product.design.some(
          (d) => d.toLowerCase() === designFilter.toLowerCase()
        ));

    const matchesMaterial =
      !materialFilter ||
      (product.material &&
        product.material.toLowerCase() === materialFilter.toLowerCase());

    const matchesLength = !lengthFilter || product.length === lengthFilter;

    return matchesTag && matchesDesign && matchesMaterial && matchesLength;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNum) => setCurrentPage(pageNum);

  const openModal = (product) => {
    const imagesArray = Array.isArray(product.productImages)
      ? product.productImages
      : Object.values(product.productImages || {});
    setModalProduct(product);
    setSelectedImage(imagesArray.length > 0 ? imagesArray[0].imageUrl : null);
  };

  const closeModal = () => {
    setModalProduct(null);
    setSelectedImage(null);
  };

  return (
    <div className="products-page luxury-bg">
      <Header />
      <div className="products-container">
        {/* === Compact Luxury Filters === */}
        <div className="filters-row luxury-filters">
          <select value={tagFilter} onChange={e => { setTagFilter(e.target.value); setCurrentPage(1); }} className="luxury-filter-select">
            <option value="">Tag</option>
            {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <select value={designFilter} onChange={e => { setDesignFilter(e.target.value); setCurrentPage(1); }} className="luxury-filter-select">
            <option value="">Design</option>
            {DESIGN_OPTIONS.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)}
          </select>
          <select value={materialFilter} onChange={e => { setMaterialFilter(e.target.value); setCurrentPage(1); }} className="luxury-filter-select">
            <option value="">Material</option>
            {MATERIAL_OPTIONS.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)}
          </select>
          <select value={lengthFilter} onChange={e => { setLengthFilter(e.target.value); setCurrentPage(1); }} className="luxury-filter-select">
            <option value="">Length</option>
            {LENGTH_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <button className="luxury-clear-filters" onClick={() => { setTagFilter(""); setDesignFilter(""); setMaterialFilter(""); setLengthFilter(""); setCurrentPage(1); }}>Clear</button>
        </div>

        {/* === Products Grid === */}
        {currentProducts.length === 0 ? (
          <div className="no-results">No products match your filters.</div>
        ) : (
          <>
            <div className="products-grid">
              {currentProducts.map((product) => {
                let imagesArray = [];
                if (Array.isArray(product.productImages)) {
                  imagesArray = product.productImages;
                } else if (product.productImages && typeof product.productImages === "object") {
                  imagesArray = Object.values(product.productImages);
                }
                imagesArray = imagesArray.filter((img) => img && typeof img === "object" && img.imageUrl);
                const imageUrl = imagesArray.length > 0 ? imagesArray[0].imageUrl : "/placeholder-image.jpg";
                const isImageLoading = imageLoadingStates[product.id];

                return (
                  <div key={product.id} className="product-card luxury-card" onClick={() => openModal(product)}>
                    <div className="product-image-container">
                      {isImageLoading && (
                        <div className="image-loading-overlay">
                          <div className="image-spinner"></div>
                        </div>
                      )}
                      <img
                        src={imageUrl}
                        alt={product.title || "Product image"}
                        className="product-image"
                        onLoadStart={() => handleImageLoadStart(product.id)}
                        onLoad={() => handleImageLoad(product.id)}
                        onError={(e) => { e.target.src = "/placeholder-image.jpg"; handleImageLoad(product.id); }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <p className="product-price">${product.pricePerDay}/day</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button key={num} className={currentPage === num ? "active" : ""} onClick={() => paginate(num)}>
                  {num}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>Next</button>
            </div>
          </>
        )}
      </div>

      {/* === Modal === */}
      {modalProduct && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <div className="modal-layout">
              <div className="modal-images">
                <div className="modal-main-image-container">
                  <img
                    src={selectedImage || "/placeholder-image.jpg"}
                    alt="Main"
                    className="modal-main-image"
                    onError={e => (e.target.src = "/placeholder-image.jpg")}
                  />
                </div>
                <div className="image-thumbnails">
                  {(Array.isArray(modalProduct.productImages)
                    ? modalProduct.productImages
                    : Object.values(modalProduct.productImages || {})
                  ).map((img, idx) => (
                    <div key={idx} className="thumbnail-container">
                      <img
                        src={img.imageUrl}
                        alt={`thumb-${idx}`}
                        className={`thumbnail-image ${selectedImage === img.imageUrl ? "selected" : ""}`}
                        onClick={() => setSelectedImage(img.imageUrl)}
                        onError={e => (e.target.src = "/placeholder-image.jpg")}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-details">
                <h2>{modalProduct.title || modalProduct.name}</h2>
                <p><strong>Tag:</strong> {Array.isArray(modalProduct.tag) ? modalProduct.tag.join(", ") : modalProduct.tag}</p>
                <p><strong>Design:</strong> {Array.isArray(modalProduct.design) ? modalProduct.design.join(", ") : modalProduct.design}</p>
                <p><strong>Material:</strong> {modalProduct.material}</p>
                <p><strong>Length:</strong> {modalProduct.length}</p>
                <p><strong>Color:</strong> {modalProduct.color}</p>
                <p><strong>Price/day:</strong> ${modalProduct.pricePerDay}</p>
                <div className="btn-container">
                  <button className="action-btn" onClick={() => navigate(`/products/${modalProduct.id}`)}>Rent Now</button>
                  <button className="action-btn whatsapp" onClick={closeModal}>Chat with us</button>
                </div>
                <ProductAccordion product={modalProduct} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
