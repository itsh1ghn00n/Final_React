import { useEffect, useRef, useState } from "react";
import FrontPage from "./components/FrontPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrdersPage from "./components/OrdersPage";
import AdminPage from "./components/AdminPage";
import ProductDetail from "./components/ProductDetail";
import {
  DEFAULT_PRODUCTS,
  addToCart as addToCartApi,
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  loadCart,
  loadOrders,
  loadProducts,
  removeFromCart as removeFromCartApi,
  submitCheckout as submitCheckoutApi,
  updateCartQuantity as updateCartQuantityApi,
  updateProduct as updateProductApi,
} from "./actions/storeActions";

function getSessionId() {
  const key = "react_ecommerce_session";
  let session = localStorage.getItem(key);
  if (!session) {
    session = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, session);
  }
  return session;
}

function App() {
    const [view, setView] = useState("browse");
    const [products, setProducts] = useState(DEFAULT_PRODUCTS);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [sessionId, setSessionId] = useState("");
    const [notification, setNotification] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const notificationTimer = useRef(null);

    const cartQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    useEffect(() => {
        const session = getSessionId();
        setSessionId(session);
        fetchProducts();
        fetchCart(session);
        fetchOrders();
        return () => {
        if (notificationTimer.current) {
            clearTimeout(notificationTimer.current);
        }
        };
    }, []);

    function clearNotification() {
        if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
        }
        notificationTimer.current = setTimeout(() => setNotification(""), 5000);
    }

    async function fetchProducts() {
        try {
        const data = await loadProducts();
        setProducts(Array.isArray(data) && data.length ? data : DEFAULT_PRODUCTS);
        } catch (error) {
        setNotification("Backend unavailable - using sample product data.");
        setProducts(DEFAULT_PRODUCTS);
        clearNotification();
        }
    }

    async function fetchCart(session) {
        if (!session) return;
        try {
        const data = await loadCart(session);
        setCartItems(normalizeCartItems(data));
        } catch (error) {
        setCartItems([]);
        }
    }

    function normalizeCartItems(items) {
        return items.map(item => ({
            id: item.product?._id || item.product_id || item.id,
            name: item.product?.name || item.name,
            price: Number(item.product?.price || item.price || 0),
            quantity: Number(item.quantity || 1),
            imageUrl: item.product?.imageUrl || item.imageUrl || "https://via.placeholder.com/100",
        }));
    }

    function normalizeOrders(orders) {
        return orders.map(order => {
            const rawDate = order.created_at || order.date || order.order_date;

            let parsedDate = null;

            if (rawDate) {
            const d = new Date(rawDate);
            parsedDate = isNaN(d.getTime()) ? null : d;
            }

            return {
            id: order.order_id || order.id || order._id,
            total: Number(order.total_amount || order.total || order.amount || 0),
            createdAt: parsedDate,
            items: (order.items || []).map(item => ({
                name: item.product?.name || item.name || "Item",
                quantity: Number(item.quantity || 1),
            })),
            };
        });
    }

    async function fetchOrders() {
        try {
        const data = await loadOrders();
        setOrders(normalizeOrders(Array.isArray(data) ? data : []));
        } catch (error) {
        setOrders([]);
        }
    }

    async function addToCart(product) {
        if (!sessionId) {
        setNotification("Unable to add item to cart.");
        clearNotification();
        return;
    }

    try {
      await addToCartApi(sessionId, product);
      await fetchCart(sessionId);
      setNotification("Product added to cart.");
    } catch (error) {
        setCartItems(prevCart => {
            const existing = prevCart.find(item => item.product._id === product._id);
            if (existing) {
            return prevCart.map(item =>
                item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            }
            return [
                ...prevCart,
                {
                    id: product._id,
                    name: product.name,
                    price: Number(product.price),
                    quantity: 1,
                    imageUrl: product.imageUrl,
                },
            ];
        });
        setNotification("Cannot add to cart right now; using local fallback.");
        } finally {
        clearNotification();
        }
    }

    async function removeFromCart(productId) {
        if (!sessionId) {
        setNotification("Unable to remove item.");
        clearNotification();
        return;
        }

        try {
        await removeFromCartApi(sessionId, productId);
        await fetchCart(sessionId);
        setNotification("Item removed from cart.");
        } catch (error) {
        setCartItems(prevCart => prevCart.filter(item => item.product._id !== productId));
        setNotification("Backend unavailable. Removed locally.");
        } finally {
        clearNotification();
        }
    }

    async function updateCartQuantity(productId, quantity) {
        if (quantity <= 0) {
        removeFromCart(productId);
        return;
        }

        if (!sessionId) {
        setNotification("Unable to update cart.");
        clearNotification();
        return;
        }

        try {
        await updateCartQuantityApi(sessionId, productId, quantity);
        await fetchCart(sessionId);
        setNotification("Cart quantity updated.");
        } catch (error) {
        setCartItems(prevCart =>
            prevCart.map(item =>
            item.product._id === productId ? { ...item, quantity } : item
            )
        );
        setNotification("Backend unavailable. Quantity updated locally.");
        } finally {
        clearNotification();
        }
    }

    async function submitCheckout({ name, email }) {
        if (cartItems.length === 0) {
        setNotification("Add items to your cart before checkout.");
        clearNotification();
        return;
        }

        setCheckoutLoading(true);
        try {
        const data = await submitCheckoutApi(sessionId, cartItems, { name, email });
        setNotification(`Order ${data.order_id || data.id || "placed"} placed successfully.`);
        setCartItems([]);
        await fetchOrders();
        setView("orders");
        } catch (error) {
        setNotification(error?.message || "Checkout failed.");
        } finally {
        setCheckoutLoading(false);
        clearNotification();
        }
    }

    async function createProduct(product) {
        try {
        await createProductApi(product);
        await fetchProducts();
        setNotification("Product added successfully.");
        } catch (error) {
        setNotification(error?.message || "Unable to create product.");
        } finally {
        clearNotification();
        }
    }

    async function deleteProduct(productId) {
        try {
        await deleteProductApi(productId);
        await fetchProducts();
        setNotification("Product deleted.");
        } catch (error) {
        setNotification(error?.message || "Unable to delete product.");
        } finally {
        clearNotification();
        }
    }

    async function updateProduct(productId, product) {
        try {
        await updateProductApi(productId, product);
        await fetchProducts();
        setNotification("Product updated successfully.");
        } catch (error) {
        setNotification(error?.message || "Unable to update product.");
        } finally {
        clearNotification();
        }
    }

    return (
        <div className="app-shell">
        <header className="app-header">
            <div>
            <h1>E-Commerce Storefront</h1>
            <p>Browse products, manage your cart, and place orders from a clean shopping experience.</p>
            </div>
            <button className="cart-icon-button" onClick={() => setView("cart")}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.1.9 2 2 2h10v-2h-10l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.3.12-.48 0-.55-.45-1-1-1h-14.31l-.94-2z" />
                </svg>

                {cartQuantity > 0 && (
                    <span className="cart-badge">{cartQuantity}</span>
                )}
                </button>
        </header>

        {notification && (
            <div
                className="toast"
                onClick={() => setNotification("")}
            >
                {notification}
            </div>
        )}

        <nav className="page-nav">
            <button className={view === "browse" ? "nav-button active" : "nav-button"} onClick={() => setView("browse")}>
            Browse
            </button>
            <button className={view === "orders" ? "nav-button active" : "nav-button"} onClick={() => setView("orders")}>
            Orders
            </button>
            <button className={view === "admin" ? "nav-button active" : "nav-button"} onClick={() => setView("admin")}>
            Admin
            </button>
        </nav>

        <main className="page-content">
            {view === "browse" && (
            <FrontPage
                products={products}
                addToCart={addToCart}
                searchQuery={searchQuery}
                category={category}
                onSearch={setSearchQuery}
                onCategoryChange={setCategory}
                onViewDetail={(product) => { setSelectedProduct(product); setView("product"); }}
            />
            )}

            {view === "product" && (
            <ProductDetail
                product={selectedProduct}
                addToCart={addToCart}
                onBack={() => setView("browse")}
            />
            )}

            {view === "cart" && (
            <CartPage
                cartItems={cartItems}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                onCheckout={() => setView("checkout")}
                onContinue={() => setView("browse")}
                />
            )}

            {view === "checkout" && (
            <CheckoutPage
                cartItems={cartItems}
                cartQuantity={cartQuantity}
                cartTotal={cartTotal}
                onSubmitCheckout={submitCheckout}
                checkoutLoading={checkoutLoading}
                onBack={() => setView("cart")}
            />
            )}

            {view === "orders" && (
            <OrdersPage orders={orders} onBrowse={() => setView("browse")} />
            )}

            {view === "admin" && (
            <AdminPage
                products={products}
                onCreateProduct={createProduct}
                onDeleteProduct={deleteProduct}
                onUpdateProduct={updateProduct}
            />
            )}
        </main>
        </div>
    );
}

export default App;