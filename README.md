# Chopzy Backend API
**Node.js · Express · MySQL · Sequelize**

Complete REST API backend for the Chopzy Flutter grocery delivery app.

---

## Project Structure

```
chopzy-backend/
├── server.js                   ← Entry point
├── package.json
├── .env.example                ← Copy to .env and fill in values
├── chopzy_schema.sql           ← Raw SQL schema (optional, Sequelize auto-syncs)
│
├── config/
│   ├── database.js             ← Sequelize connection
│   └── seeder.js               ← Seeds categories + all products
│
├── models/
│   ├── index.js                ← All models + associations
│   ├── User.js
│   ├── Otp.js
│   ├── Category.js
│   ├── Product.js
│   ├── Address.js
│   ├── Order.js
│   └── OrderItem.js
│
├── controllers/
│   ├── authController.js       ← OTP send/verify, JWT, profile
│   ├── categoryController.js
│   ├── productController.js
│   ├── orderController.js
│   └── addressController.js
│
├── middleware/
│   ├── auth.js                 ← JWT protect middleware
│   └── errorHandler.js        ← Global error handler + validator
│
└── routes/
    ├── auth.js
    ├── categories.js
    ├── products.js
    ├── orders.js
    └── addresses.js
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials, JWT secret, SMS keys
```

### 3. Create MySQL database
```sql
CREATE DATABASE chopzy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Or import the full schema:
```bash
mysql -u root -p chopzy_db < chopzy_schema.sql
```

### 4. Start the server (tables auto-created by Sequelize)
```bash
npm run dev    # development with nodemon
npm start      # production
```

### 5. Seed all products & categories
```bash
npm run seed
```

---

## API Reference

### Auth
| Method | Endpoint             | Auth | Description                      |
|--------|----------------------|------|----------------------------------|
| POST   | /api/auth/send-otp   | No   | Send OTP to phone number         |
| POST   | /api/auth/verify-otp | No   | Verify OTP → returns JWT token   |
| GET    | /api/auth/me         | Yes  | Get current user profile         |
| PUT    | /api/auth/profile    | Yes  | Update name / email / avatar     |

### Categories
| Method | Endpoint            | Auth | Description            |
|--------|---------------------|------|------------------------|
| GET    | /api/categories     | No   | All active categories  |
| GET    | /api/categories/:id | No   | Single category        |

### Products
| Method | Endpoint                  | Auth | Description                             |
|--------|---------------------------|------|-----------------------------------------|
| GET    | /api/products             | No   | List products (filterable, paginated)   |
| GET    | /api/products/search?q=   | No   | Search by name                          |
| GET    | /api/products/featured    | No   | Top-rated products (rating ≥ 4.7)       |
| GET    | /api/products/:id         | No   | Single product detail                   |

**Product query params:**
- `category` — category name or id
- `type` — `raw` or `cut`
- `in_stock` — `true` or `false`
- `badge` — badge text filter
- `page`, `limit` — pagination

### Orders
| Method | Endpoint               | Auth | Description             |
|--------|------------------------|------|-------------------------|
| POST   | /api/orders            | Yes  | Place new order         |
| GET    | /api/orders            | Yes  | User order history      |
| GET    | /api/orders/:id        | Yes  | Single order detail     |
| PATCH  | /api/orders/:id/cancel | Yes  | Cancel order            |

### Addresses
| Method | Endpoint                    | Auth | Description          |
|--------|-----------------------------|------|----------------------|
| GET    | /api/addresses              | Yes  | User addresses       |
| POST   | /api/addresses              | Yes  | Add address          |
| PUT    | /api/addresses/:id          | Yes  | Update address       |
| DELETE | /api/addresses/:id          | Yes  | Delete address       |
| PATCH  | /api/addresses/:id/default  | Yes  | Set as default       |

---

## Authentication

All protected routes need:
```
Authorization: Bearer <jwt_token>
```

---

## OTP Flow

1. App calls `POST /api/auth/send-otp` with phone
2. OTP is sent via SMS (Robeeta); in **development** mode, `dev_otp` is returned in the response for testing without real SMS
3. App calls `POST /api/auth/verify-otp` with phone + otp
4. Server returns `{ token, user, is_new_user }`
5. App stores the JWT and sends it in every subsequent request

---

## Pricing Logic (in orderController.js)

| Item             | Value                            |
|------------------|----------------------------------|
| Delivery fee     | ₹29 (free if subtotal ≥ ₹299)   |
| App charge       | ₹2                               |
| Service fee      | 2% of subtotal                   |
| GST              | 5% of (subtotal + delivery fee)  |

---

## Flutter Integration

In your Flutter app, update `lib/config/api_config.dart`:

```dart
class ApiConfig {
  static const String baseUrl = 'http://YOUR_SERVER_IP:3000/api';

  // Auth
  static const String sendOtp    = '$baseUrl/auth/send-otp';
  static const String verifyOtp  = '$baseUrl/auth/verify-otp';
  static const String profile    = '$baseUrl/auth/me';

  // Data
  static const String categories = '$baseUrl/categories';
  static const String products   = '$baseUrl/products';
  static const String orders     = '$baseUrl/orders';
  static const String addresses  = '$baseUrl/addresses';
}
```

Replace `YOUR_SERVER_IP` with:
- `10.0.2.2` for Android emulator (maps to localhost)
- `localhost` for iOS simulator
- Your LAN IP (e.g. `192.168.1.x`) for real devices

---

## Database ER Diagram

```
users ──────┬──── addresses ────── orders ──── order_items ──── products
            │                         │                              │
            └──── orders ─────────────┘                    categories ──┘
```

---

## Environment Variables

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| PORT                  | Server port (default 3000)           |
| NODE_ENV              | development / production             |
| DB_HOST               | MySQL host                           |
| DB_PORT               | MySQL port (default 3306)            |
| DB_NAME               | Database name                        |
| DB_USER               | MySQL username                       |
| DB_PASSWORD           | MySQL password                       |
| JWT_SECRET            | Secret key for JWT signing           |
| JWT_EXPIRES_IN        | Token expiry (e.g. 7d)               |
| ROBEETA_API_KEY       | Your existing SMS provider API key   |
| ROBEETA_TEMPLATE_ID   | SMS template ID                      |
| ROBEETA_SENDER_ID     | Sender ID                            |
| OTP_EXPIRES_MINUTES   | OTP validity in minutes (default 10) |
