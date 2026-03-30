"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const BASE = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE}/api/auth/cart`, {
        headers: getAuthHeaders(),
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const addItem = async ({ product_id, variant_id, quantity = 1 }) => {
    if (!user) return { ok: false, reason: "auth" };
    try {
      await axios.post(
        `${BASE}/api/auth/cart`,
        { product_id, variant_id, quantity },
        { headers: getAuthHeaders() }
      );
      await refresh();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Could not add to cart",
      };
    }
  };

  const updateItem = async (id, quantity) => {
    if (!user) return { ok: false, reason: "auth" };
    try {
      await axios.put(
        `${BASE}/api/auth/cart/${id}`,
        { quantity },
        { headers: getAuthHeaders() }
      );
      await refresh();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Could not update quantity",
      };
    }
  };

  const removeItem = async (id) => {
    if (!user) return { ok: false, reason: "auth" };
    try {
      await axios.delete(`${BASE}/api/auth/cart/${id}`, {
        headers: getAuthHeaders(),
      });
      await refresh();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Could not remove item",
      };
    }
  };

  const clearCart = async () => {
    if (!user) return { ok: false, reason: "auth" };
    try {
      await axios.delete(`${BASE}/api/auth/cart`, {
        headers: getAuthHeaders(),
      });
      await refresh();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Could not clear cart",
      };
    }
  };

  const count = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [items]
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const unit = Number(item.discount_price || item.price) || 0;
        return sum + unit * (Number(item.quantity) || 0);
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        count,
        total,
        refresh,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
