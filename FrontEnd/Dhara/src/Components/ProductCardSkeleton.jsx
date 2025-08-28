import React from "react";
import ContentLoader from "react-content-loader";

const ProductCardSkeleton = () => (
  <ContentLoader
    speed={2}
    width={250}
    height={350}
    viewBox="0 0 250 350"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {/* Image rectangle */}
    <rect x="0" y="0" rx="10" ry="10" width="250" height="250" />
    {/* Product ID */}
    <rect x="0" y="270" rx="4" ry="4" width="120" height="20" />
    {/* Title */}
    <rect x="0" y="300" rx="4" ry="4" width="180" height="20" />
    {/* Price/Day */}
    <rect x="0" y="330" rx="4" ry="4" width="80" height="15" />
  </ContentLoader>
);

export default ProductCardSkeleton;
