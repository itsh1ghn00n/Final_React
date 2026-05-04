import { useState } from "react";

const DEFAULT_PRODUCT = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: ""
};

function AdminPage({ products, onCreateProduct, onDeleteProduct, onUpdateProduct }) {
  const [productForm, setProductForm] = useState(DEFAULT_PRODUCT);
  const [editingProduct, setEditingProduct] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const price = Number(productForm.price);
    if (!productForm.name || !productForm.category || !productForm.description || !price) {
      return;
    }
    if (editingProduct) {
      onUpdateProduct(editingProduct._id || editingProduct.id, {
        ...productForm,
        price,
        stock_quantity: editingProduct.stock_quantity || 10,
      });
      setEditingProduct(null);
    } else {
      onCreateProduct({
        ...productForm,
        price,
        stock_quantity: 10,
        category: productForm.category,
        imageUrl: productForm.imageUrl || "https://via.placeholder.com/400x300?text=New+Product"
      });
    }
    setProductForm(DEFAULT_PRODUCT);
  }

  function startEdit(product) {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || "",
    });
  }

  function cancelEdit() {
    setEditingProduct(null);
    setProductForm(DEFAULT_PRODUCT);
  }

  return (
    <section className="admin-section">
      <div className="section-heading">
        <div>
          <h2>Admin Panel</h2>
          <p>Add new products and manage your catalog.</p>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Product name
            <input name="name" value={productForm.name} onChange={handleChange} required />
          </label>
          <label>
            Category
            <input name="category" value={productForm.category} onChange={handleChange} required />
          </label>
          <label>
            Price
            <input name="price" type="number" step="0.01" value={productForm.price} onChange={handleChange} required />
          </label>
          <label className="full-width">
            Description
            <textarea name="description" value={productForm.description} onChange={handleChange} required />
          </label>
          <label className="full-width">
            Image URL
            <input name="imageUrl" value={productForm.imageUrl} onChange={handleChange} />
          </label>
        </div>
        <div className="form-actions">
          <button className="primary-button" type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
          {editingProduct && <button className="secondary-button" type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <div className="admin-product-list">
        {products.length === 0 ? (
          <div className="empty-state">No products available yet.</div>
        ) : (
          <div className="grid-3">
            {products.map(product => (
              <div key={product._id || product.id} className="admin-product-card">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <p>${Number(product.price || 0).toFixed(2)}</p>
                </div>
                <div className="admin-actions">
                  <button className="secondary-button" onClick={() => startEdit(product)}>Edit</button>
                  <button className="secondary-button" onClick={() => onDeleteProduct(product._id || product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;
