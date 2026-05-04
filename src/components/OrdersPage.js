function OrdersPage({ orders, onBrowse }) {
  return (
    <section className="orders-section">
      <div className="section-heading">
        <div>
          <h2>Order History</h2>
          <p>Review your recent purchases and order details.</p>
        </div>
        <button className="secondary-button" onClick={onBrowse}>Browse Products</button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">No orders found yet.</div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.order_id || order.id || order._id} className="order-card">
              <div className="order-header">
                <h3>{order.order_id || order.id}</h3>
                <p>
                  {order.createdAt
                    ? order.createdAt.toLocaleString()
                    : "Date unavailable"}
                </p>
              </div>
              <p className="order-total">Order total: ${Number(order.total || order.amount || 0).toFixed(2)}</p>
              <ul>
                {(order.items || []).map((item, index) => (
                  <li key={`${order.order_id || order.id}-${index}`}>
                    {item.product?.name || item.name} x {item.quantity || 1}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
