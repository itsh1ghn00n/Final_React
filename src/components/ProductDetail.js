function ProductDetail({ product, addToCart, onBack }) {
  if (!product) {
    return (
      <section className="product-detail-section">
        <div className="section-heading">
          <div>
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
          </div>
          <button className="secondary-button" onClick={onBack}>Back to Browse</button>
        </div>
      </section>
    );
  }

  return (
    <section className="product-detail-section">
      <div className="section-heading">
        <div>
          <h2>{product.name}</h2>
          <p>Product details and options.</p>
        </div>
        <button className="secondary-button" onClick={onBack}>Back to Browse</button>
      </div>

      <div className="product-detail-content">
        <div className="product-detail-image">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400x300?text=Product"}
            alt={product.name}
          />
        </div>

        <div className="product-detail-info">
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-stock">In stock: {product.stock_quantity || 0}</p>
          <div className="product-detail-actions">
            <span className="product-price">${Number(product.price || 0).toFixed(2)}</span>
            <button className="primary-button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;