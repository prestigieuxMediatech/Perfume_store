const LIST_FIELDS = [
  'why_love_it',
  'top_notes',
  'heart_notes',
  'base_notes',
  'performance',
  'who_is_this_for',
  'product_details',
  'shipping_returns',
];

const TEXT_FIELDS = [
  'subtitle',
  'detailed_description',
  'disclaimer',
  'cta_text',
];

const emptyDetails = () => ({
  subtitle: '',
  why_love_it: [],
  detailed_description: '',
  top_notes: [],
  heart_notes: [],
  base_notes: [],
  performance: [],
  who_is_this_for: [],
  product_details: [],
  shipping_returns: [],
  disclaimer: '',
  cta_text: '',
});

const cleanList = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);
};

const normalizeProductDetails = (value) => {
  const base = emptyDetails();
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return base;
  }

  for (const field of TEXT_FIELDS) {
    base[field] = String(value[field] ?? '').trim();
  }

  for (const field of LIST_FIELDS) {
    base[field] = cleanList(value[field]);
  }

  return base;
};

const parseProductDetails = (value) => {
  if (!value) return emptyDetails();

  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return normalizeProductDetails(parsed);
  } catch (error) {
    return emptyDetails();
  }
};

const stringifyProductDetails = (value) => {
  const normalized = normalizeProductDetails(value);
  const hasContent = Object.values(normalized).some((entry) => {
    if (Array.isArray(entry)) return entry.length > 0;
    return Boolean(entry);
  });

  return hasContent ? JSON.stringify(normalized) : null;
};

module.exports = {
  emptyDetails,
  normalizeProductDetails,
  parseProductDetails,
  stringifyProductDetails,
};
