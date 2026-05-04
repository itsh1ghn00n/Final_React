function ProductCard({ product, addToCart, onViewDetail }) {
  const { _id, name, price, category, description, imageUrl } = product;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="product-details">
        <h3>{name}</h3>
        <p className="product-category">{category}</p>
        <p className="product-description">{description}</p>

        <div className="product-actions">
          <span className="product-price">${price.toFixed(2)}</span>
          <div className="product-buttons">
            <button onClick={() => onViewDetail(product)}>View</button>
            <button onClick={() => addToCart(product)}>Add</button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;