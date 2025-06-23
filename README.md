**Backend Development Task Document**

**Project:** E‑Commerce Platform Backend

---

## 1. Objective

Design and implement a modular, microservice‑oriented backend for an e‑commerce application using Node.js and Express. The system will cover core features such as user management, product catalog, order processing, payments, and supporting services like emailing and scheduled discount jobs.

## 2. Tech Stack

* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ORM)
* **Authentication:** JWT (JSON Web Tokens)
* **Caching & Queuing:** Redis, BullMQ
* **Microservices:**

  * **Email Service** (Node.js + Express)
  * **Scheduler Service** (cron jobs via node-cron)

## 3. System Architecture

#### 1. **API Gateway:** Single entry point for client requests (Express).
#### 2. **Services:**

   * **User Service** (users, auth, roles)
   * **Product Service** (product catalog, seeder)
   * **Order Service** (order lifecycle, status)
   * **Payment Service** (mock payment processor)
   * **Email Service** (order confirmations, notifications)
   * **Scheduler Service** (apply discounts, send promotional emails)
#### 3. **Redis & BullMQ:** Message queue for asynchronous tasks (emails, order fulfillment).

> *Note:* Communication between services via RESTful HTTP and Redis‑backed BullMQ queues.

## 4. Database Schemas (Mongoose Models)

### 4.1 User

* Keys: `name`, `email`, `password`, `role`, `createdAt`

### 4.2 Product

* Keys: `name`, `description`, `price`, `quantity`, `discount`, `sellerId`, `createdAt`, `saleStart`, `saleEnd`, `salePercentage`

### 4.3 Order

* Keys: `buyerId`, `items` (with `productId`, `quantity`, `priceAtPurchase`), `couponCode`, `discountAmount`, `originalAmount`, `totalAmount`, `status`, `cancelledBy`, `cancelReason`, `createdAt`

### 4.4 Payment

* Keys: `orderId`, `amount`, `method`, `status`, `createdAt`, `refunded`, `refundDate`

### 4.5 Cart

* Keys: `userId`, `items` (with `productId`, `quantity`, `price`), `createdAt`, `updatedAt`

### 4.6 Coupon

* Keys: `code`, `discountPercentage`, `validFrom`, `validTo`, `usageLimit`, `usedCount`, `sellerId`, `isActive`, `createdAt`

## 5. API Endpoints

### 5.1 Authentication & Users

* **POST** `/auth/register` – Register as buyer or seller
* **POST** `/auth/login` – Login, receive JWT
* **GET** `/users/me` – Get own profile (JWT-protected)

### 5.2 Products

* **GET** `/products` – List all (filters: seller, price range, discount)
* **GET** `/products/:id` – Get product details
* **POST** `/products` – Create product (seller only)
* **PUT** `/products/:id` – Update product (seller only)
* **DELETE** `/products/:id` – Remove product (seller only)
* **POST** `/products/:id/sale` – Schedule sale window and percentage (seller only)

### 5.3 Cart Management

* **POST** `/cart` – Add product to cart
* **GET** `/cart` – View cart contents
* **PUT** `/cart/:productId` – Update cart quantity
* **DELETE** `/cart/:productId` – Remove item from cart

### 5.4 Checkout

* **POST** `/checkout` – Process cart checkout with optional coupon code

  * Body: `{ cartId: "cart_123", couponCode? }`
  * Applies coupon discount, calculates totals, creates order draft, returns payment info

### 5.5 Orders

* **POST** `/orders` – Place order (buyer)
* **GET** `/orders` – List orders (buyer & seller; role-based)
* **GET** `/orders/:id` – Get order details
* **PATCH** `/orders/:id/status` – Update order status (seller)
* **PATCH** `/orders/:id/cancel` – Cancel order (buyer or seller)

  * Triggers refund via Payment Service if prepaid
  * Updates status to `cancelled` and notifies parties

### 5.6 Payments

* **POST** `/payments` – Initiate payment for an order
* **GET** `/payments/:id` – Check payment status

### 5.7 Wishlist

* **POST** `/wishlist` – Add product to wishlist
* **GET** `/wishlist` – View wishlist items
* **DELETE** `/wishlist/:productId` – Remove product from wishlist

### 5.8 Product Reviews

* **POST** `/products/:id/review` – Submit review (buyer only)
* **GET** `/products/:id/reviews` – List all reviews for a product

### 5.9 Coupon System

* **POST** `/coupons` – Create coupon (seller/admin)
* **GET** `/coupons/apply?code=XYZ` – Apply promo code at checkout

## 6. Checkout & Payment Flow (Example Payloads)

### 6.1 Checkout API

**POST** `/checkout`

#### Request:

```json
{
  "cartId": "64fb9f4a98c0f32d6c4a3ef9",
  "couponCode": "SUMMER25"
}
```

#### Response:

```json
{
  "orderId": "ord_00123",
  "payableAmount": 875.00,
  "discountApplied": 125.00,
  "originalTotal": 1000.00,
  "paymentOptions": ["UPI", "CARD", "COD"]
}
```

> Creates an order with status `pending_payment`

### 6.2 Payment API

**POST** `/payments`

#### Request:

```json
{
  "orderId": "ord_00123",
  "method": "UPI",
  "transactionId": "txn_abc_98765"
}
```

#### Response:

```json
{
  "paymentId": "pay_77889",
  "status": "success",
  "orderStatus": "processing",
  "message": "Payment completed successfully"
}
```

> Updates order status to `processing`, triggers email service.

## 7. Authentication & Authorization

* **JWT Strategy** in Express middleware (passport-jwt or custom).
* **Role-based guards**: enforce buyer/seller/admin access per route.

## 8. Seeder Module

* **Goal:** Preload DB with sample users, products, orders, payments.
* **Usage:** Update `seed.js` as you implement features to reflect current schema and aid testing.

## 9. Redis & BullMQ Queues

* **Queues:** `emailQueue`, `orderQueue` for async tasks.
* **Workers:** Process jobs for emails, order fulfillment, refunds.

## 10. Email Microservice

* Node.js + Express + BullMQ consumer.
* Subscribes to `emailQueue`, sends transactional emails via SMTP/SendGrid.

## 11. Scheduler Microservice

* Node.js + node-cron.
* Daily job at midnight to apply/expire sale discounts and enqueue promotional emails.

## 12. Folder Structure

```
backend/
├─ controllers/          # Route handlers
│  ├─ auth.controller.js
│  ├─ product.controller.js
│  ├─ order.controller.js
│  ├─ payment.controller.js
│  ├─ cart.controller.js
│  └─ coupon.controller.js
│
├─ models/               # Mongoose schemas
│  ├─ user.model.js
│  ├─ product.model.js
│  ├─ order.model.js
│  ├─ payment.model.js
│  ├─ cart.model.js
│  └─ coupon.model.js
│
├─ services/             # Business logic
│  ├─ auth.service.js
│  ├─ product.service.js
│  ├─ order.service.js
│  ├─ payment.service.js
│  ├─ cart.service.js
│  └─ coupon.service.js
│
├─ routes/               # Route definitions
│  ├─ auth.routes.js
│  ├─ product.routes.js
│  ├─ order.routes.js
│  ├─ payment.routes.js
│  ├─ cart.routes.js
│  └─ coupon.routes.js
│
├─ middleware/           # Auth, validation, rate limiting
├─ utils/                # Helpers
├─ config/               # Environment & DB configs
├─ queues/               # BullMQ queues & workers
│  ├─ index.js
│  └─ workers/
│
├─ microservices/        # Email & scheduler services
│  ├─ email-service/
│  └─ scheduler-service/
│
├─ seed.js               # Seeder script
└─ app.js / server.js    # Entry point
```

## 13. Security Practices

### During Development

* **Input Validation:** Joi/Zod for payloads.
* **Authentication & Authorization:** JWT middleware, role checks.
* **Rate Limiting:** General & strict on sensitive routes.
* **Password Security:** Bcrypt hashing.
* **CORS:** Whitelist domains in production.

### Final Phase

* **Env Vars:** Use dotenv, exclude `.env`.
* **Error Handling:** Standardize and sanitize responses.
* **Secure Headers:** Helmet.js.
* **Logging:** Winston/Pino for audits.

---

**Deliverables:**

1. GitHub repo with finalized structure.
2. Postman/Swagger collection.
3. Updated seed script for testing.

Good luck, and reach out with any questions!
