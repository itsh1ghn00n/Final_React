const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

async function request(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

export const storeApi = {
  getProducts: () => request("/products"),
  getCart: (session) => request(`/cart/${session}`),
  getOrders: () => request("/orders"),

  addToCart: (session, productId) =>
    request("/cart/add", {
      method: "POST",
      body: JSON.stringify({ user_session_id: session, product_id: productId, quantity: 1 }),
    }),

  updateCart: (session, productId, quantity) =>
    request(`/cart/${session}/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (session, productId) =>
    request(`/cart/${session}/${productId}`, { method: "DELETE" }),

  checkout: (session, name, email) =>
    request("/checkout", {
      method: "POST",
      body: JSON.stringify({ user_session_id: session, user_name: name, user_email: email }),
    }),
};