import ProductList from "./ProductList";

const CATEGORY_OPTIONS = ["All", "Electronics", "Clothing", "Home", "Books", "Toys"];

function FrontPage({ products, addToCart, searchQuery, category, onSearch, onCategoryChange, onViewDetail }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <h2>Find something great today</h2>
          <p>Filter by category, search by keyword, and add items to your cart for easy checkout.</p>
        </div>
      </section>

      <section className="filter-bar">
        <div className="search-box">
          <label htmlFor="search">Search products</label>
          <input
            id="search"
            type="search"
            value={searchQuery}
            placeholder="Search by name or description"
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {CATEGORY_OPTIONS.map(option => (
            <button
              key={option}
              className={option === category ? 'category-button active' : 'category-button'}
              onClick={() => onCategoryChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <ProductList
        products={products}
        addToCart={addToCart}
        searchQuery={searchQuery}
        category={category}
        onViewDetail={onViewDetail}
      />
    </>
  );
}

export default FrontPage;
