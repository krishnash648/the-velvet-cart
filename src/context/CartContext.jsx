import { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast'; // 🥐 Toasts!

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ➕ Add to Cart
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success('Quantity updated in cart');
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
      toast.success('Item added to cart!');
    }
  };

  // ❌ Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.error('Item removed from cart');
  };

  // 🔁 Update Quantity
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // 🧼 Clear Cart
  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared!'); // Optional
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // 🚨 Add it here
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 🔥 Custom hook
export const useCart = () => useContext(CartContext);
