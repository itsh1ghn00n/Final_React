import ProductCard from "./ProductCard";

const sampleProducts = [
  {
    _id: "1",
    name: "Apex Wireless Headphones",
    description: "Comfortable noise-canceling headphones with long battery life.",
    price: 99.99,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/400x300?text=Headphones",
  },
  {
    _id: "2",
    name: "Cozy Home Throw Blanket",
    description: "Soft knit blanket perfect for the living room or bedroom.",
    price: 34.50,
    category: "Home",
    imageUrl: "https://via.placeholder.com/400x300?text=Blanket",
  },
  {
    _id: "3",
    name: "Classic Paperback Novel",
    description: "A timeless story for readers who love adventure and mystery.",
    price: 14.99,
    category: "Books",
    imageUrl: "https://via.placeholder.com/400x300?text=Book",
  },
  {
    _id: "4",
    name: "Smart Kids Learning Tablet",
    description: "Educational tablet with apps for reading, math, and creative play.",
    price: 59.99,
    category: "Toys",
    imageUrl: "https://via.placeholder.com/400x300?text=Tablet",
  },
  {
    _id: "5",
    name: "Portable Bluetooth Speaker",
    description: "Small speaker with crisp sound and splash-resistant design.",
    price: 45.0,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/400x300?text=Speaker",
  },
];

function ProductList({ products, addToCart, searchQuery, category, onViewDetail }) {
  const effectiveProducts = Array.isArray(products) && products.length > 0 ? products : sampleProducts;

  const filteredProducts = effectiveProducts.filter(product => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch =
      normalizedSearch === "" ||
      product.name?.toLowerCase().includes(normalizedSearch) ||
      product.description?.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="product-list-section">
      <div className="section-heading">
        <h2>Featured Products</h2>
        <p>{filteredProducts.length} items available</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          No products found. Try a different keyword or category.
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard
              key={p._id || p.id}
              product={p}
              addToCart={addToCart}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;