import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productApi } from "../api";
import Select from "react-select";
import {
  TAG_OPTIONS,
  LENGTH_OPTIONS,
  DESIGN_OPTIONS,
  MATERIAL_OPTIONS,
  COLOR_OPTIONS,
  STATUS_OPTIONS,
} from "../Constants/productOptions";
import "../styles/EditProduct.css";
import Sidebar from "../Components/Sidebar";

const toReactSelectOptions = (array) => array.map((val) => ({ label: val, value: val }));
const fromReactSelectValues = (selected) => selected.map((item) => item.value);

export default function EditProduct() {
  const [product, setProduct] = useState({
    title: "",
    tag: [],
    length: "",
    design: [],
    material: "",
    color: [],
    pricePerDay: 0,
    status: "AVAILABLE",
    comments: "",
    adminId: null,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { admin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getById(id);
        const {
          title,
          tag,
          length,
          design,
          material,
          color,
          pricePerDay,
          status,
          comments,
          productImages,
        } = response.data;

        setProduct({
          title,
          tag: Array.isArray(tag) ? tag : [tag],
          length,
          design: Array.isArray(design) ? design : [design],
          material,
          color: Array.isArray(color) ? color : [color],
          pricePerDay,
          status,
          comments: comments || "",
          adminId: admin?.id,
        });

        setExistingImages(productImages || []);
        setNewImages([]);
        setRemovedImageIds([]);
      } catch (error) {
        alert("Failed to fetch product: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, admin?.id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + newImages.length + files.length > 5) {
      alert("You can upload a maximum of 5 images total.");
      return;
    }

    const filesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...filesWithPreview]);
  };

  const removeImage = (index, type) => {
    if (existingImages.length + newImages.length <= 1) {
      alert("At least one image is required.");
      return;
    }
    if (type === "existing") {
      const removedId = existingImages[index].id;
      setRemovedImageIds((prev) => [...prev, removedId]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "new") {
      setNewImages((prev) => {
        URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingImages.length + newImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    setLoading(true);
    const updatedProduct = {
      ...product,
      id,
    };

    const request = {
      ...updatedProduct,
      adminId: admin?.id,
      removedImageIds,
    };

    try {
      const filesToUpload = newImages.map((img) => img.file);
      await productApi.update(id, request, filesToUpload);
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Failed to update product: " + error.message);
    } finally {
      setLoading(false);
      alert("Product updated successfully!");
    }
  };

    function Loader() {
    return (
      <div className="loader-overlay">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="dashboard-container">
      <Sidebar />
      {loading && <Loader />}
      <div className="product-form">
        <h2 className="form-title">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              placeholder="Product Title"
              required
            />
          </div>

          <div className="form-group">
            <label>Tag</label>
            <Select
              isMulti
              value={toReactSelectOptions(product.tag)}
              onChange={(selected) =>
                setProduct({ ...product, tag: fromReactSelectValues(selected) })
              }
              options={toReactSelectOptions(TAG_OPTIONS)}
            />
          </div>

          <div className="form-group">
            <label>Length</label>
            <select
              value={product.length}
              onChange={(e) => setProduct({ ...product, length: e.target.value })}
              required
            >
              <option value="">Select Length</option>
              {LENGTH_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Design</label>
            <Select
              isMulti
              value={toReactSelectOptions(product.design)}
              onChange={(selected) =>
                setProduct({ ...product, design: fromReactSelectValues(selected) })
              }
              options={toReactSelectOptions(DESIGN_OPTIONS)}
            />
          </div>

          <div className="form-group">
            <label>Material</label>
            <select
              value={product.material}
              onChange={(e) => setProduct({ ...product, material: e.target.value })}
              required
            >
              <option value="">Select Material</option>
              {MATERIAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Color</label>
            <Select
              isMulti
              value={toReactSelectOptions(product.color)}
              onChange={(selected) =>
                setProduct({ ...product, color: fromReactSelectValues(selected) })
              }
              options={toReactSelectOptions(COLOR_OPTIONS)}
            />
          </div>

          <div className="form-group">
            <label>Price Per Day</label>
            <input
              type="number"
              value={product.pricePerDay}
              onChange={(e) =>
                setProduct({ ...product, pricePerDay: parseFloat(e.target.value) })
              }
              placeholder="Price Per Day"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={product.status}
              onChange={(e) => setProduct({ ...product, status: e.target.value })}
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={product.comments}
              onChange={(e) => setProduct({ ...product, comments: e.target.value })}
              placeholder="Comment (optional)"
            />
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="image-previews">
              {existingImages.map((img, i) => (
                <div key={"exist-" + i} className="image-container">
                  <img
                    src={`${img.imageUrl}`}
                    alt={`Existing Preview ${i}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeImage(i, "existing")}
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {newImages.map((imgObj, i) => (
                <div key={"new-" + i} className="image-container">
                  <img
                    src={imgObj.preview}
                    alt={`New Preview ${i}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeImage(i, "new")}
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}