ALTER TABLE products
  ADD COLUMN show_on_home BOOLEAN NOT NULL DEFAULT FALSE AFTER details_json,
  ADD COLUMN home_display_order INT NULL AFTER show_on_home;

CREATE INDEX idx_products_show_on_home_order
  ON products (show_on_home, home_display_order, created_at);
