const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const DEFAULT_PRODUCTS = [
  {
    _id: '1',
    name: 'Apex Wireless Headphones',
    description: 'Comfortable noise-canceling headphones with long battery life.',
    price: 99.99,
    category: 'Electronics',
    stock_quantity: 18,
    imageUrl: 'https://via.placeholder.com/400x300?text=Headphones',
  },
  {
    _id: '2',
    name: 'Cozy Home Throw Blanket',
    description: 'Soft knit blanket perfect for the living room or bedroom.',
    price: 34.5,
    category: 'Home',
    stock_quantity: 30,
    imageUrl: 'https://via.placeholder.com/400x300?text=Blanket',
  },
  {
    _id: '3',
    name: 'Classic Paperback Novel',
    description: 'A timeless story for readers who love adventure and mystery.',
    price: 14.99,
    category: 'Books',
    stock_quantity: 24,
    imageUrl: 'https://via.placeholder.com/400x300?text=Book',
  },
  {
    _id: '4',
    name: 'Smart Kids Learning Tablet',
    description: 'Educational tablet with apps for reading, math, and creative play.',
    price: 59.99,
    category: 'Toys',
    stock_quantity: 16,
    imageUrl: 'https://via.placeholder.com/400x300?text=Tablet',
  },
  {
    _id: '5',
    name: 'Portable Bluetooth Speaker',
    description: 'Small speaker with crisp sound and splash-resistant design.',
    price: 45.0,
    category: 'Electronics',
    stock_quantity: 26,
    imageUrl: 'https://via.placeholder.com/400x300?text=Speaker',
  },
];

async function parseJson(response) {
  if (!response.ok) {
    const text = await response.text();
    let message = response.statusText;
    try {
      const json = JSON.parse(text);
      message = json.message || message;
    } catch {
      message = text || message;
    }
    throw new Error(message || 'Request failed');
  }
  return response.json();
}

export async function loadProducts() {
  const response = await fetch(`${API_URL}/products`);
  return await parseJson(response);
}

export async function loadCart(session) {
  const response = await fetch(`${API_URL}/cart/${session}`);
  return await parseJson(response);
}

export async function loadOrders() {
  const response = await fetch(`${API_URL}/orders`);
  return await parseJson(response);
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return await parseJson(response);
}

export async function updateProduct(productId, product) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return await parseJson(response);
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Unable to delete product');
  }
  return true;
}

export async function addToCart(sessionId, product) {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_session_id: sessionId,
      product_id: product._id,
      quantity: 1,
    }),
  });
  return await parseJson(response);
}

export async function removeFromCart(sessionId, productId) {
  const response = await fetch(`${API_URL}/cart/${sessionId}/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove item');
  }
  return true;
}

export async function updateCartQuantity(sessionId, productId, quantity) {
  const response = await fetch(`${API_URL}/cart/${sessionId}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to update quantity');
  }
  return true;
}

export async function submitCheckout(sessionId, cartItems, { name, email }) {
  const response = await fetch(`${API_URL}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_session_id: sessionId,
      user_name: name,
      user_email: email,
    }),
  });
  return await parseJson(response);
}
