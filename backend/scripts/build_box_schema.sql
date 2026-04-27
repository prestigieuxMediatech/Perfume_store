-- Build Your Box tables
CREATE TABLE IF NOT EXISTS boxes (
  id           VARCHAR(36)  PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  cover_image  VARCHAR(255) DEFAULT NULL,
  price        DECIMAL(10,2) NOT NULL,
  items_count  INT NOT NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS box_allowed_categories (
  id          VARCHAR(36) PRIMARY KEY,
  box_id      VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_box_items (
  id              VARCHAR(36) PRIMARY KEY,
  user_id         VARCHAR(36) NOT NULL,
  box_id          VARCHAR(36) NOT NULL,
  quantity        INT DEFAULT 1,
  selections_json JSON NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  created_at      DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_box_details (
  id              VARCHAR(36) PRIMARY KEY,
  order_id        VARCHAR(36) NOT NULL,
  box_id          VARCHAR(36) NOT NULL,
  box_name        VARCHAR(200) NOT NULL,
  quantity        INT DEFAULT 1,
  unit_price      DECIMAL(10,2) NOT NULL,
  line_total      DECIMAL(10,2) NOT NULL,
  selections_json JSON NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
