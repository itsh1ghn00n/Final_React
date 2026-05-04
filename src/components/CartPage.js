function CartPage({ cartItems, updateCartQuantity, removeFromCart, onCheckout, onContinue }) {
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="cart-section">
      <div className="section-heading">
        <h2>Your Cart</h2>
        <button className="secondary-button" onClick={onContinue}>Continue Shopping</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">Cart is empty</div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map(item => (
              <div className="cart-item-card">
                <div className="cart-item-left">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-image" />

                  <div>
                    <h3>{item.name}</h3>
                    <p>${(Number(item.price) || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="cart-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item.id, Number(e.target.value))}
                  />

                  <button
                    className="icon-button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <div>
              <p>Items: <strong>{count}</strong></p>
              <p>Total: <strong>${total.toFixed(2)}</strong></p>
            </div>

            <button
              className="primary-button"
              onClick={onCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default CartPage;
