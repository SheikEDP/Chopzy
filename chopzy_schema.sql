-- ============================================================
-- Chopzy App — MySQL Database Schema
-- Run this before starting the server (or let Sequelize sync)
-- ============================================================

CREATE DATABASE IF NOT EXISTS chopzy_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chopzy_db;

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           CHAR(36)       NOT NULL PRIMARY KEY,          -- UUID
  phone        VARCHAR(20)    NOT NULL UNIQUE,
  name         VARCHAR(100)   DEFAULT NULL,
  email        VARCHAR(150)   DEFAULT NULL UNIQUE,
  avatar_url   TEXT           DEFAULT NULL,
  is_verified  TINYINT(1)     NOT NULL DEFAULT 0,
  is_active    TINYINT(1)     NOT NULL DEFAULT 1,
  last_login   DATETIME       DEFAULT NULL,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── otps ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otps (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT PRIMARY KEY,
  phone       VARCHAR(20)    NOT NULL,
  otp_code    VARCHAR(6)     NOT NULL,
  expires_at  DATETIME       NOT NULL,
  is_used     TINYINT(1)     NOT NULL DEFAULT 0,
  attempts    INT            NOT NULL DEFAULT 0,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone     (phone),
  INDEX idx_otp_code  (otp_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── categories ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)   NOT NULL UNIQUE,
  emoji        VARCHAR(10)    DEFAULT NULL,
  color        VARCHAR(20)    DEFAULT NULL,       -- hex e.g. #2E7D32
  image_url    TEXT           DEFAULT NULL,
  description  TEXT           DEFAULT NULL,
  sort_order   INT            NOT NULL DEFAULT 0,
  is_active    TINYINT(1)     NOT NULL DEFAULT 1,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             INT UNSIGNED       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(150)       NOT NULL,
  category_id    INT UNSIGNED       NOT NULL,
  product_type   ENUM('raw','cut')  NOT NULL DEFAULT 'raw',
  price          DECIMAL(10,2)      NOT NULL,
  original_price DECIMAL(10,2)      DEFAULT NULL,
  unit           VARCHAR(50)        NOT NULL,         -- 500g, 1 kg, 300ml
  emoji          VARCHAR(10)        DEFAULT NULL,
  image_url      TEXT               DEFAULT NULL,
  rating         DECIMAL(3,1)       NOT NULL DEFAULT 0.0,
  review_count   INT                NOT NULL DEFAULT 0,
  badge          VARCHAR(50)        DEFAULT NULL,     -- Fresh, Organic, Best Seller
  in_stock       TINYINT(1)         NOT NULL DEFAULT 1,
  description    TEXT               DEFAULT NULL,
  is_active      TINYINT(1)         NOT NULL DEFAULT 1,
  sort_order     INT                NOT NULL DEFAULT 0,
  created_at     DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_category FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_category_id  (category_id),
  INDEX idx_product_type (product_type),
  INDEX idx_in_stock     (in_stock),
  INDEX idx_name         (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── addresses ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id      CHAR(36)       NOT NULL,
  label        VARCHAR(50)    NOT NULL,            -- Home, Office, Other
  full_address TEXT           NOT NULL,
  landmark     VARCHAR(150)   DEFAULT NULL,
  city         VARCHAR(100)   DEFAULT NULL,
  pincode      VARCHAR(10)    DEFAULT NULL,
  latitude     DECIMAL(10,8)  DEFAULT NULL,
  longitude    DECIMAL(11,8)  DEFAULT NULL,
  is_default   TINYINT(1)     NOT NULL DEFAULT 0,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_address_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                 VARCHAR(30)    NOT NULL PRIMARY KEY,   -- ORD-<timestamp>
  user_id            CHAR(36)       NOT NULL,
  address_id         INT UNSIGNED   DEFAULT NULL,
  delivery_address   TEXT           NOT NULL,               -- snapshot
  delivery_slot      VARCHAR(50)    NOT NULL,
  delivery_date      DATE           DEFAULT NULL,
  subtotal           DECIMAL(10,2)  NOT NULL,
  delivery_fee       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  app_charge         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  service_fee        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  gst                DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  discount           DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  total              DECIMAL(10,2)  NOT NULL,
  payment_method     ENUM('razorpay','upi','card','netbanking','wallet','cod') NOT NULL DEFAULT 'cod',
  payment_status     ENUM('pending','paid','failed','refunded')                NOT NULL DEFAULT 'pending',
  razorpay_order_id  VARCHAR(100)   DEFAULT NULL,
  razorpay_payment_id VARCHAR(100)  DEFAULT NULL,
  status             ENUM('placed','confirmed','preparing','out_for_delivery','delivered','cancelled')
                                    NOT NULL DEFAULT 'placed',
  notes              TEXT           DEFAULT NULL,
  created_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user    FOREIGN KEY (user_id)    REFERENCES users(id)     ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_user_id       (user_id),
  INDEX idx_status        (status),
  INDEX idx_payment_status(payment_status),
  INDEX idx_created_at    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── order_items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            INT UNSIGNED       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id      VARCHAR(30)        NOT NULL,
  product_id    INT UNSIGNED       NOT NULL,
  product_name  VARCHAR(150)       NOT NULL,         -- snapshot
  product_type  ENUM('raw','cut')  NOT NULL,
  unit          VARCHAR(50)        NOT NULL,
  unit_price    DECIMAL(10,2)      NOT NULL,
  quantity      INT                NOT NULL DEFAULT 1,
  total_price   DECIMAL(10,2)      NOT NULL,
  emoji         VARCHAR(10)        DEFAULT NULL,
  image_url     TEXT               DEFAULT NULL,
  created_at    DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_order_id   (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Seed categories ───────────────────────────────────────────────────────────
INSERT IGNORE INTO categories (name, emoji, color, description, sort_order) VALUES
  ('Vegetables',  '🥦', '#2E7D32', 'Farm-fresh vegetables, raw & cut', 1),
  ('Fruits',      '🍎', '#E53935', 'Seasonal fruits, raw & sliced',    2),
  ('Health Food', '🥗', '#00897B', 'Salad packs & healthy combos',     3),
  ('Fresh Juice', '🍹', '#FB8C00', 'Cold-pressed & natural juices',    4);
