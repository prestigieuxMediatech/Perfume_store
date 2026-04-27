"use client";

import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  return `INR ${amount.toLocaleString("en-IN")}`;
};

const getFamilyLabel = (product) => {
  if (product.category_name && product.brand_name) {
    return `${product.category_name} / ${product.brand_name}`;
  }
  return product.category_name || product.brand_name || "Signature Fragrance";
};

const getNotes = (product) => {
  const subtitle = product.details?.subtitle?.trim();
  if (subtitle) return subtitle;
  if (product.description) return product.description;
  return "Crafted for theSEVENEVEN signature collection.";
};

export const mapHomeProduct = (product) => ({
  id: product.id,
  family: getFamilyLabel(product),
  name: product.name,
  notes: getNotes(product),
  price: formatPrice(product.starting_price),
  size: product.variants?.[0]?.size || null,
  rating: 5,
  img: product.primary_image ? `${BASE}${product.primary_image}` : "/one.webp",
});

export const fetchHomeProducts = async () => {
  const res = await axios.get(`${BASE}/api/products?home=true`);
  return Array.isArray(res.data) ? res.data.map(mapHomeProduct) : [];
};
