function CheckoutPage({ cartItems, cartTotal, onSubmitCheckout, checkoutLoading, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    onSubmitCheckout({
      name: form.name.value,
      email: form.email.value,
    });
  };

  return (
    <section className="checkout-section">
      <div className="section-heading">
        <h2>Checkout</h2>
        <button className="secondary-button" onClick={onBack}>Back</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">Add items before checkout</div>
      ) : (
        <form className="checkout-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />

          <div className="checkout-summary-card">
            <p>Total: ${cartTotal.toFixed(2)}</p>
          </div>

          <button className="primary-button" disabled={checkoutLoading}>
            {checkoutLoading ? "Processing..." : "Place Order"}
          </button>
        </form>
      )}
    </section>
  );
}

export default CheckoutPage;
