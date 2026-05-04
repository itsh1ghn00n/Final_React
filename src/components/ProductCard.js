function ProductCard({ product, addToCart, onViewDetail }) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <article className="product-card">
      <div className="product-image">
        <img
          src={product.imageUrl || "https://via.placeholder.com/400x300?text=Product"}
          alt={product.name}
        />
      </div>

      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-actions">
          <span className="product-price">${Number(product.price || 0).toFixed(2)}</span>

          <div className="product-buttons">
            <button onClick={() => onViewDetail(product)}>
              View Details
            </button>

            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;