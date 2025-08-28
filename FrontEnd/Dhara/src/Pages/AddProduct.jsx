// src/pages/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productApi } from "../api";
import Select from "react-select";
import {
  TAG_OPTIONS,
  LENGTH_OPTIONS,
  DESIGN_OPTIONS,
  MATERIAL_OPTIONS,
  STATUS_OPTIONS,
  COLOR_OPTIONS,
} from "../Constants/productOptions";
import "../styles/AddProduct.css";
import Sidebar from "../Components/Sidebar";

export default function AddProduct() {
  const [product, setProduct] = useState({
    id: "",
    title: "",
    design: [],
    material: [],
    color: [],
    pricePerDay: 0,
    status: "AVAILABLE",
    adminId: null,
    tag: [],
    length: "",
    comments: "",
  });

  const [manualTag, setManualTag] = useState("");
  const [manualLength, setManualLength] = useState("");
  const [manualMaterial, setManualMaterial] = useState("");
  const [manualDesign, setManualDesign] = useState("");
  const [manualColor, setManualColor] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { admin } = useAuth();
  const navigate = useNavigate();

  // Handles multi-select changes from react-select component
  const handleMultiSelectChange = (field, selectedOptions) => {
    setProduct((prev) => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  // Handles single select changes (native select)
  const handleSingleSelectChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));

    // Clear manual inputs if user changes select away from "Other"
    if (field === "tag" && value !== "Other") setManualTag("");
    if (field === "length" && value !== "Other") setManualLength("");
    if (field === "material" && value !== "Other") setManualMaterial("");
    if (field === "design" && value !== "Other") setManualDesign("");
    if (field !== "color") setManualColor("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    // Resolve final values including manual input if "Other" selected
    const finalTag = product.tag.includes("Other") && manualTag
      ? [...product.tag.filter((t) => t !== "Other"), manualTag.trim()]
      : product.tag;
    const finalLength = product.length === "Other" ? manualLength.trim() : product.length;
    const finalMaterial = product.material.includes("Other") && manualMaterial
      ? [...product.material.filter((m) => m !== "Other"), manualMaterial.trim()]
      : product.material;
    const finalDesign = product.design.includes("Other") && manualDesign
      ? [...product.design.filter((d) => d !== "Other"), manualDesign.trim()]
      : product.design;
    const finalColor = product.color.includes("Other") && manualColor
      ? [...product.color.filter((c) => c !== "Other"), manualColor.trim()]
      : product.color;

    if (
      (!finalTag.length && product.tag.includes("Other")) ||
      (!finalLength && product.length === "Other") ||
      (!finalMaterial.length && product.material.includes("Other")) ||
      (!finalDesign.length && product.design.includes("Other")) ||
      (!finalColor.length && product.color.includes("Other"))
    ) {
      alert("Please fill out all required fields or provide manual inputs.");
      return;
    }

    const request = {
      ...product,
      tag: finalTag,
      length: finalLength,
      material: finalMaterial,
      design: finalDesign,
      color: finalColor,
      pricePerDay: Number(product.pricePerDay),
      adminId: admin?.id,
    };

    try {
      setLoading(true);
      await productApi.create(request, images);
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Failed to create product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = [...images, ...newFiles];

    if (totalFiles.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    setImages(totalFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Render multi-select react-select with manual input for "Other"
  const renderMultiSelect = (label, field, options, manualValue, setManualValue) => (
    <label>
      {label}:
      <Select
        isMulti
        options={[...options.map((opt) => ({ value: opt, label: opt })), { value: "Other", label: "Other" }]}
        onChange={(selected) => handleMultiSelectChange(field, selected)}
        value={product[field].map((val) => ({ value: val, label: val }))}
        placeholder={`Select ${label.toLowerCase()}`}
      />
      {product[field].includes("Other") && (
        <input
          type="text"
          placeholder={`Enter ${label.toLowerCase()} manually`}
          value={manualValue}
          onChange={(e) => setManualValue(e.target.value)}
          required
          className="manual-input"
        />
      )}
    </label>
  );

  // Render single select for length (or others if needed)
  const renderSingleSelect = (label, field, options, manualValue, setManualValue) => (
    <label>
      {label}:
      <select
        value={product[field]}
        onChange={(e) => handleSingleSelectChange(field, e.target.value)}
        required
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        <option value="Other">Other</option>
      </select>
      {product[field] === "Other" && (
        <input
          type="text"
          placeholder={`Enter ${label.toLowerCase()} manually`}
          value={manualValue}
          onChange={(e) => setManualValue(e.target.value)}
          required
          className="manual-input"
        />
      )}
    </label>
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="product-form">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Product ID:
            <input
              type="text"
              value={product.id}
              onChange={(e) => setProduct({ ...product, id: e.target.value })}
              placeholder="Product ID"
              required
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              placeholder="Product Title"
              required
            />
          </label>

          {renderMultiSelect("Design", "design", DESIGN_OPTIONS, manualDesign, setManualDesign)}
          {renderSingleSelect("Material", "material", MATERIAL_OPTIONS, manualMaterial, setManualMaterial)}
          {renderMultiSelect("Color", "color", COLOR_OPTIONS, manualColor, setManualColor)}

          <label>
            Price Per Day:
            <input
              type="number"
              value={product.pricePerDay}
              onChange={(e) => setProduct({ ...product, pricePerDay: e.target.value })}
              placeholder="Price Per Day"
              min="0"
              required
            />
          </label>

          <label>
            Status:
            <select
              value={product.status}
              onChange={(e) => setProduct({ ...product, status: e.target.value })}
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>

          {renderMultiSelect("Tag", "tag", TAG_OPTIONS, manualTag, setManualTag)}
          {renderSingleSelect("Length", "length", LENGTH_OPTIONS, manualLength, setManualLength)}

          <label>
            Comments:
            <textarea
              placeholder="Add optional comments"
              value={product.comments}
              onChange={(e) => setProduct({ ...product, comments: e.target.value })}
            />
          </label>

          <label>
            Upload Images:
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div className="image-container" key={index}>
                  <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => {
                      const newPreviews = [...imagePreviews];
                      const newImages = [...images];
                      newPreviews.splice(index, 1);
                      newImages.splice(index, 1);
                      setImagePreviews(newPreviews);
                      setImages(newImages);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit">Save</button>
        </form>
        {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Uploading product, please wait...</p>
        </div>
      )}
      </div>
    </div>
  );
}
