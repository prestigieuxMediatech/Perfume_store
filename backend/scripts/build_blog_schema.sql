CREATE TABLE IF NOT EXISTS blogs (
  id                VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title             VARCHAR(220) NOT NULL,
  slug              VARCHAR(240) NOT NULL UNIQUE,
  category_label    VARCHAR(80) DEFAULT 'Journal',
  excerpt           TEXT NOT NULL,
  content           LONGTEXT NOT NULL,
  cover_image       VARCHAR(255) DEFAULT NULL,
  author_name       VARCHAR(120) DEFAULT '7EVEN Editorial',
  read_time_minutes INT DEFAULT 4,
  is_published      BOOLEAN DEFAULT FALSE,
  published_at      DATETIME DEFAULT NULL,
  created_at        DATETIME DEFAULT NOW(),
  updated_at        DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE INDEX idx_blogs_published_at ON blogs (published_at);
CREATE INDEX idx_blogs_is_published ON blogs (is_published);
