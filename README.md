# ✨ Aura & Co. Boutique

<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
<img src="https://img.shields.io/badge/MongoDB-9.7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Redux%20Toolkit-State%20Management-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit">
<img src="https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO">
<img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">
<img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">

<br><br>

**A modern, full-stack AI-powered e-commerce platform for curated lifestyle products.**

A production-oriented boutique storefront combining modern UI/UX, intelligent product discovery, secure authentication, real-time notifications, inventory management, order processing, analytics, and an AI shopping concierge.

</div>

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Project Objectives](#-project-objectives)
* [Key Features](#-key-features)
* [Application Architecture](#-application-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Frontend](#-frontend)
* [Backend](#-backend)
* [Authentication & Authorization](#-authentication--authorization)
* [AI Shopping Concierge](#-ai-shopping-concierge)
* [Real-Time Communication](#-real-time-communication)
* [E-Commerce Features](#-e-commerce-features)
* [Administration](#-administration)
* [Security](#-security)
* [Database Design](#-database-design)
* [API Overview](#-api-overview)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Running the Application](#-running-the-application)
* [Docker Deployment](#-docker-deployment)
* [Render Deployment](#-render-deployment)
* [Vercel Deployment](#-vercel-deployment)
* [Production Considerations](#-production-considerations)
* [Development Workflow](#-development-workflow)
* [Future Improvements](#-future-improvements)
* [Author](#-author)
* [License](#-license)

---

# 🌟 Overview

**Aura & Co. Boutique** is a full-stack e-commerce application designed around a premium, minimalist shopping experience.

The platform provides customers with a complete digital shopping journey:

> **Discover → Explore → Personalize → Add to Cart → Checkout → Track Orders → Receive Notifications**

The application combines a modern React frontend with a Node.js/Express backend, MongoDB persistence, Socket.IO real-time communication, JWT authentication, and Google Gemini-powered AI assistance.

The architecture is designed to support both **customer-facing commerce operations** and **administrative business workflows**.

### Core Concept

Aura & Co. focuses on three main pillars:

* 🛍️ **Modern E-Commerce**
* 🤖 **AI-Assisted Shopping**
* 🔐 **Secure & Scalable Backend Architecture**

---

# 🎯 Project Objectives

The project was developed with the following objectives:

1. Build a complete modern e-commerce experience.
2. Provide intuitive product discovery and filtering.
3. Implement authentication and role-based authorization.
4. Introduce an AI shopping assistant using Google Gemini.
5. Provide real-time notifications using Socket.IO.
6. Implement shopping cart, wishlist, orders, reviews and checkout workflows.
7. Provide inventory and stock management.
8. Provide administrative analytics and audit logging.
9. Implement API protection using rate limiting and validation.
10. Support containerized deployment with Docker.
11. Provide deployment configurations for cloud hosting.
12. Maintain a modular and maintainable full-stack architecture.

---

# 🚀 Key Features

## 🛒 Customer Experience

* Modern responsive storefront
* Product catalog
* Product categories
* Product search
* Advanced filtering
* Price filtering
* Rating filtering
* Stock filtering
* Sorting
* Product details
* Product variants
* Shopping cart
* Wishlist
* Product reviews
* Checkout
* Order creation
* Order history
* Invoice generation
* Order status tracking
* Delivery options
* Notifications

---

## 🤖 AI Shopping Concierge

Aura integrates an AI-powered shopping assistant based on **Google Gemini**.

The assistant is designed to help customers:

* Discover products
* Ask product-related questions
* Receive recommendations
* Navigate the catalog
* Find suitable products
* Interact with the store conversationally

The AI layer is exposed through a dedicated backend API instead of exposing the Gemini API key directly in the browser.

### AI Architecture

```text
Customer
   │
   ▼
React AI Assistant
   │
   ▼
Axios API Request
   │
   ▼
Express API
   │
   ▼
AI Controller
   │
   ▼
Google Gemini API
   │
   ▼
AI Response
   │
   ▼
Customer
```

AI requests are additionally protected by a dedicated rate limiter to control API consumption and reduce abuse.

---

# 🏗️ Application Architecture

Aura follows a modular full-stack architecture.

```text
┌─────────────────────────────────────────────┐
│                 Client                      │
│                                             │
│ React + Vite + TailwindCSS                  │
│ Redux Toolkit + RTK Query                   │
│ Socket.IO Client                            │
│ Motion / Lucide React                       │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API / WebSocket
                       ▼
┌─────────────────────────────────────────────┐
│                 Server                      │
│                                             │
│ Node.js + Express.js                       │
│ Authentication                              │
│ Controllers                                 │
│ Middleware                                  │
│ Services                                    │
│ Socket.IO                                   │
│ AI Integration                              │
└──────────────────────┬──────────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
       ┌─────────────┐   ┌──────────────┐
       │  MongoDB    │   │ Google       │
       │  Database   │   │ Gemini API   │
       └─────────────┘   └──────────────┘
```

---

# 💻 Technology Stack

## Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React 19         | UI development                |
| Vite             | Development/build tooling     |
| Tailwind CSS 4   | Styling                       |
| Redux Toolkit    | Global state management       |
| RTK Query        | API data fetching and caching |
| Axios            | HTTP communication            |
| Socket.IO Client | Real-time communication       |
| Motion           | Animations                    |
| Lucide React     | UI icons                      |

---

## Backend

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| Node.js            | Runtime                   |
| Express.js         | REST API                  |
| MongoDB            | Database                  |
| Mongoose           | ODM                       |
| JWT                | Authentication            |
| bcryptjs           | Password hashing          |
| Socket.IO          | Real-time communication   |
| express-rate-limit | API protection            |
| express-validator  | Input validation          |
| CORS               | Cross-origin access       |
| dotenv             | Environment configuration |
| Google GenAI       | AI integration            |

---

# 📁 Project Structure

```text
Aura-Project-main/
│
├── Client/
│   ├── components/
│   │   ├── AdminModal.jsx
│   │   ├── AiAssistant.jsx
│   │   ├── AuthModal.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationCenter.jsx
│   │   ├── OrderSuccessModal.jsx
│   │   ├── OrdersModal.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductModal.jsx
│   │   ├── ReviewModal.jsx
│   │   └── WishlistModal.jsx
│   │
│   ├── data/
│   │   └── products.js
│   │
│   ├── store/
│   │   ├── apiSlice.js
│   │   └── store.js
│   │
│   ├── utils/
│   │   ├── imageFallback.js
│   │   └── socket.js
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── index.html
│   ├── main.jsx
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── seedData.js
│   │
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── analyticsController.js
│   │   ├── auditController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── couponController.js
│   │   ├── deliveryController.js
│   │   ├── emailController.js
│   │   ├── inventoryController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── uploadController.js
│   │   └── wishlistController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── validators.js
│   │
│   ├── models/
│   │   ├── AuditLog.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── EmailRecord.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── StockMovement.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── auditRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── emailRoutes.js
│   │   ├── index.js
│   │   ├── inventoryRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── wishlistRoutes.js
│   │
│   ├── services/
│   │   ├── auditService.js
│   │   ├── emailService.js
│   │   ├── paymentService.js
│   │   └── pdfService.js
│   │
│   └── websockets/
│       ├── index.js
│       └── socketHandler.js
│
├── server.js
├── docker-compose.yml
├── render.yaml
├── package.json
├── package-lock.json
├── bun.lock
├── .dockerignore
└── .gitignore
```

---

# 🎨 Frontend

The frontend is implemented using **React 19 + Vite**.

The application uses a component-oriented architecture where each major business feature is encapsulated in its own component.

### Main UI Components

* `Navbar` — global navigation
* `HeroBanner` — storefront introduction
* `ProductCard` — product presentation
* `ProductModal` — detailed product interaction
* `CartDrawer` — shopping cart
* `CheckoutModal` — checkout workflow
* `OrdersModal` — customer order history
* `WishlistModal` — wishlist management
* `ReviewModal` — product reviews
* `AuthModal` — authentication
* `AdminModal` — administration interface
* `AiAssistant` — AI shopping concierge
* `NotificationCenter` — notifications
* `Footer` — application footer

### Product Discovery

The storefront supports URL-synchronized filters.

Example:

```text
/?category=electronics&q=headphones&sort=price-asc&minPrice=20&maxPrice=200&inStock=true
```

This provides shareable and bookmarkable catalog states.

---

# 🔄 State Management

Aura uses **Redux Toolkit** and **RTK Query** for application state and server-state management.

```text
React Components
       │
       ▼
Redux Store
       │
       ├── RTK Query
       │      │
       │      └── API Requests
       │
       └── Application State
```

RTK Query provides:

* API request handling
* Query caching
* Automatic loading states
* Data synchronization
* Refetching
* API state management

---

# 🔐 Authentication & Authorization

Authentication is implemented using **JSON Web Tokens (JWT)**.

The backend provides different authorization levels.

### Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Express Auth Controller
 │
 ▼
Password Verification
 │
 ▼
JWT Generation
 │
 ▼
Client
 │
 ▼
Authorization Header
 │
 ▼
JWT Middleware
 │
 ▼
Protected Resource
```

### Authorization Levels

#### Guest

Can access public storefront functionality.

#### Authenticated User

Can access features such as:

* Orders
* Wishlist
* Notifications
* Personalized functionality
* Reviews

#### Administrator

Can access:

* Product management
* User management
* Inventory
* Coupons
* Orders
* Analytics
* Audit logs
* Email administration
* Review moderation

---

# 🛡️ Security

Security is treated as a first-class concern throughout the application.

## JWT Authentication

Protected routes validate JWT tokens before allowing access.

```text
Authorization: Bearer <JWT>
```

---

## Password Protection

Passwords are hashed using:

```text
bcryptjs
```

Plain-text passwords are not intended to be stored in the database.

---

## Role-Based Access Control

Administrative operations require an administrator role.

```text
requireAdmin()
      │
      ▼
JWT Verification
      │
      ▼
Role Verification
      │
      ├── admin → Allow
      │
      └── user → Deny
```

---

## Rate Limiting

The project implements multiple rate-limiting layers.

| Area           |                  Limit |
| -------------- | ---------------------: |
| General API    | 1500 requests / 15 min |
| Authentication |  150 attempts / 15 min |
| AI Assistant   |      25 requests / min |
| Orders         |     30 orders / 15 min |
| Reviews        |    20 reviews / 10 min |
| Uploads        |    50 uploads / 15 min |

This provides protection against:

* Brute-force authentication attempts
* API abuse
* Excessive AI requests
* Review spam
* Order abuse
* Upload abuse

---

## Input Validation

Backend requests are validated using:

```text
express-validator
```

Validation is applied to important business operations such as:

* Authentication
* Products
* Orders
* Reviews
* Coupons
* Inventory
* Uploads
* Order status updates

---

## CORS

Cross-Origin Resource Sharing is configured to support frontend/backend separation.

The architecture supports deployments such as:

```text
Vercel Frontend
       │
       ▼
Render Backend
       │
       ▼
MongoDB Atlas
```

---

## Correlation IDs

Requests receive correlation identifiers for traceability.

```text
X-Correlation-ID
```

This makes it easier to associate requests with audit events and troubleshoot distributed application behavior.

---

# ⚡ Real-Time Communication

Aura uses **Socket.IO** for real-time application events.

### Supported Concepts

* User-specific rooms
* Admin rooms
* Order rooms
* Real-time notifications
* Order status updates
* Inventory alerts

### Socket Architecture

```text
                    Socket.IO
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       User Room    Order Room   Admin Room
          │            │            │
          ▼            ▼            ▼
     Notifications  Order Events  Alerts
```

The socket layer also supports JWT-based authentication.

---

# 🛍️ E-Commerce Features

## Product Catalog

Customers can:

* Browse products
* Search products
* Filter by category
* Filter by price
* Filter by rating
* Filter by availability
* Sort products
* Open detailed product information

---

## Shopping Cart

The cart supports:

* Adding products
* Product variants
* Quantity changes
* Removing products
* Automatic cart totals
* User-specific persistence

Cart data is scoped by user email in local browser storage.

---

## Wishlist

Users can:

* Add products to wishlist
* Remove products
* View saved products

---

## Product Reviews

The review system supports:

* Review submission
* Rating
* Review retrieval
* Review moderation
* Review rate limiting

Administrators can moderate reviews.

---

# 📦 Orders & Checkout

The platform provides a complete order workflow.

```text
Shopping Cart
      │
      ▼
Checkout
      │
      ▼
Customer Information
      │
      ▼
Delivery Selection
      │
      ▼
Payment Simulation
      │
      ▼
Order Creation
      │
      ▼
Confirmation
      │
      ▼
Real-Time Status Updates
```

Customers can view their previous orders and access invoice information.

---

# 💳 Payment Simulation

The project includes a payment simulation service for development and demonstration purposes.

Supported payment concepts include:

* Card
* PayPal
* Apple Pay

The payment simulation intentionally avoids persisting full card numbers or CVV information.

> **Important:** This implementation is a simulation and should not be considered a production payment processor. Production systems should integrate a PCI-compliant payment provider such as Stripe, Adyen, or another appropriate provider.

---

# 📧 Email System

The backend contains an email service architecture supporting templates such as:

* Order confirmation
* Order status updates

Email records can also be managed through administrative endpoints.

The system provides retry functionality for failed email delivery workflows.

---

# 📄 Invoice Generation

Aura includes an invoice generation service capable of producing invoice HTML for orders.

Invoice information can include:

* Customer information
* Order identifier
* Products
* Quantities
* Unit prices
* Line totals
* Delivery information
* Order totals

---

# 📊 Administration

The administrative layer provides business-management functionality.

## Admin Capabilities

### User Management

Administrators can:

* View users
* Update user roles
* Manage user status

### Product Management

Administrators can:

* Create products
* Update products
* Delete products
* Moderate reviews

### Inventory Management

Administrators can:

* View inventory summaries
* Identify low-stock products
* Adjust stock
* Review stock movements

### Coupon Management

Administrators can:

* Create coupons
* Validate coupons
* Delete coupons

### Order Management

Administrators can:

* View all orders
* Update order status
* Monitor order activity

### Analytics

The backend exposes administrative analytics through:

```text
GET /api/admin/analytics
```

### Audit Logging

Administrative activity can be recorded with:

* Actor
* Role
* Action
* Target resource
* Target identifier
* Details
* Correlation ID
* Timestamp
* IP address

This creates an audit trail for important administrative operations.

---

# 🗄️ Database Design

Aura uses **MongoDB** through **Mongoose**.

The project contains dedicated models for the major business domains.

```text
User
 │
 ├── Orders
 ├── Wishlist
 ├── Notifications
 └── Reviews

Product
 │
 ├── Category
 ├── Reviews
 └── Inventory

Order
 │
 ├── User
 ├── Products
 ├── Delivery
 └── Payment

Inventory
 │
 └── Stock Movements

Administration
 │
 ├── Audit Logs
 ├── Email Records
 └── Analytics
```

### Main Collections

* `users`
* `products`
* `categories`
* `orders`
* `wishlists`
* `notifications`
* `coupons`
* `stockmovements`
* `auditlogs`
* `emailrecords`

---

# 🔌 API Overview

The API is mounted under:

```text
/api
```

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Reviews

```text
GET    /api/products/:productId/reviews
POST   /api/products/:productId/reviews
PUT    /api/products/:productId/reviews/:reviewId/moderate
```

### Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:orderId
PUT    /api/orders/:orderId/status
GET    /api/orders/:orderId/invoice
```

### Wishlist

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

### Inventory

```text
GET    /api/inventory/summary
GET    /api/inventory/low-stock
GET    /api/inventory/stock-movements
POST   /api/inventory/adjust
```

### Notifications

```text
GET    /api/notifications
PUT    /api/notifications/:id/read
POST   /api/notifications/clear-all
```

### Coupons

```text
GET    /api/coupons
POST   /api/coupons
POST   /api/coupons/validate
DELETE /api/coupons/:id
```

### AI

```text
/api/ai
```

The AI routes provide the backend interface for the Gemini-powered shopping concierge.

### Health Check

```text
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "mongoConnected": true,
  "hasGeminiKey": true,
  "timestamp": "2026-09-01T00:00:00.000Z"
}
```

---

# ⚙️ Environment Variables

Create an environment file for local development.

Example:

```env
NODE_ENV=development
PORT=3000

MONGO_URI=mongodb://localhost:27017/aura_boutique

JWT_SECRET=replace_with_a_long_random_secret

GEMINI_API_KEY=your_gemini_api_key

CORS_ORIGIN=http://localhost:5173

PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

### Production

Never commit real secrets to Git.

Use your hosting provider's environment-variable management system.

Recommended secrets include:

```text
MONGO_URI
JWT_SECRET
GEMINI_API_KEY
PAYMENT_WEBHOOK_SECRET
CORS_ORIGIN
```

---

# 📦 Installation

## Prerequisites

Make sure you have installed:

* Node.js 18+
* npm
* MongoDB or MongoDB Atlas
* Git

Optional:

* Docker
* Docker Compose

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/aura-boutique.git
cd aura-boutique
```

---

## 2. Install Dependencies

From the project root:

```bash
npm install
```

If working directly with the frontend:

```bash
cd Client
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
.env
```

and configure:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

---

# ▶️ Running the Application

## Development

The root project is configured to run the application through:

```bash
npm run dev
```

The server starts on:

```text
http://localhost:3000
```

The Vite development middleware is integrated into the server for development mode.

---

## Frontend Development

Alternatively:

```bash
cd Client
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

## Production Build

Build the frontend using:

```bash
npm run build
```

Then start the server:

```bash
npm start
```

---

# 🐳 Docker Deployment

The project includes Docker Compose configuration.

Start the application using:

```bash
docker compose up --build
```

The application is exposed through:

```text
http://localhost:3000
```

MongoDB is provided through a dedicated container.

### Docker Architecture

```text
Docker Compose
│
├── aura_boutique_app
│   ├── Node.js
│   ├── Express
│   ├── React/Vite
│   └── Socket.IO
│
└── aura_boutique_db
    └── MongoDB 7
```

Persistent MongoDB data is stored in the:

```text
mongo_data
```

Docker volume.

---

# ☁️ Render Deployment

The repository includes:

```text
render.yaml
```

for Render deployment.

The backend is configured as a Node.js web service.

The health check is:

```text
/api/health
```

### Recommended Render Variables

Configure:

```text
NODE_ENV=production
MONGO_URI=<MongoDB Atlas URI>
JWT_SECRET=<generated secure secret>
GEMINI_API_KEY=<Gemini API key>
CORS_ORIGIN=<frontend URL>
```

For production, avoid using:

```text
CORS_ORIGIN=*
```

when the frontend has a known domain.

Instead use:

```text
CORS_ORIGIN=https://your-frontend-domain.com
```

---

# ▲ Vercel Deployment

The `Client` directory contains a Vercel configuration.

The recommended architecture is:

```text
                  Internet
                     │
                     ▼
              ┌──────────────┐
              │    Vercel    │
              │   Frontend   │
              └──────┬───────┘
                     │
                     │ HTTPS API
                     ▼
              ┌──────────────┐
              │    Render    │
              │   Backend    │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │ MongoDB Atlas│
              └──────────────┘
```

The frontend should be configured with the deployed backend API URL.

---

# 🔍 Health Monitoring

The backend exposes a dedicated health endpoint:

```text
GET /api/health
```

It provides basic information about:

* API availability
* MongoDB connection
* Gemini API key configuration
* Server timestamp

This endpoint can be used by deployment platforms for health checks.

---

# 🧪 Development Workflow

A recommended development workflow is:

```text
1. Create feature branch
        ↓
2. Implement feature
        ↓
3. Validate frontend
        ↓
4. Validate backend
        ↓
5. Test API
        ↓
6. Test authentication
        ↓
7. Test real-time functionality
        ↓
8. Test production build
        ↓
9. Commit changes
        ↓
10. Push branch
        ↓
11. Review / Merge
```

Recommended branch naming:

```text
feature/product-search
feature/ai-concierge
feature/order-management
fix/authentication
fix/inventory
security/rate-limiting
```

---

# 📈 Scalability Considerations

The current architecture provides a strong foundation for scaling.

Potential scaling strategy:

```text
                    Load Balancer
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Backend 1      Backend 2      Backend 3
          │              │              │
          └──────────────┼──────────────┘
                         │
                    MongoDB Atlas
```

For larger deployments, additional infrastructure can be introduced for:

* Redis-based caching
* Distributed Socket.IO adapters
* Background job processing
* CDN delivery
* Image optimization
* Dedicated email queues
* Observability
* Horizontal backend scaling

---

# 🔒 Production Security Recommendations

Before using Aura in a real commercial environment, the following improvements are recommended:

### 1. Use Strong Secrets

Generate cryptographically secure values for:

```text
JWT_SECRET
PAYMENT_WEBHOOK_SECRET
```

Never use development fallback secrets.

### 2. Restrict CORS

Use the exact production frontend origin instead of:

```text
*
```

### 3. Use HTTPS

Production traffic should use TLS/HTTPS.

### 4. Production Payment Provider

Replace the payment simulation with a PCI-compliant payment provider.

### 5. Secure File Uploads

Production deployments should enforce:

* MIME validation
* File size limits
* Image processing
* Malware scanning where appropriate
* Secure cloud storage

### 6. Secure Cookies / Token Strategy

For production authentication, consider secure HTTP-only cookies or another robust token strategy depending on the deployment architecture.

### 7. Centralized Logging

Integrate a production observability stack for:

* Application logs
* Error tracking
* Performance monitoring
* Security events
* Audit events

---

# 🧭 Future Improvements

Potential future enhancements include:

* Stripe production integration
* Redis caching
* Advanced product recommendation engine
* AI-powered semantic product search
* AI-generated product descriptions
* Multi-language support
* Multi-currency support
* Advanced analytics dashboards
* Customer segmentation
* Order tracking integration
* Cloudinary or S3 image pipelines
* Background job queues
* Email queue processing
* Two-factor authentication
* Password reset workflow
* OAuth authentication
* Advanced RBAC
* Automated testing
* CI/CD pipelines
* Comprehensive API documentation with OpenAPI/Swagger
* Monitoring with Prometheus/Grafana
* Centralized error tracking
* Kubernetes deployment

---

# 📊 Architecture Summary

Aura & Co. Boutique can be summarized as:

```text
┌─────────────────────────────────────────────┐
│              AURA & CO. BOUTIQUE            │
├─────────────────────────────────────────────┤
│                                             │
│  React + Vite + TailwindCSS                 │
│              │                              │
│              ▼                              │
│       Redux Toolkit / RTK Query             │
│              │                              │
│              ▼                              │
│       Axios + Socket.IO                     │
│              │                              │
├──────────────┼──────────────────────────────┤
│              ▼                              │
│       Node.js + Express                     │
│              │                              │
│    ┌─────────┼──────────┐                   │
│    ▼         ▼          ▼                   │
│  Auth      Business     AI                  │
│  Layer     Services    Gemini               │
│    │         │          │                   │
│    └─────────┼──────────┘                   │
│              ▼                              │
│           Mongoose                          │
│              │                              │
│              ▼                              │
│           MongoDB                           │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 🏆 Project Highlights

| Area               | Implementation     |
| ------------------ | ------------------ |
| Frontend           | React 19 + Vite    |
| Styling            | Tailwind CSS       |
| State Management   | Redux Toolkit      |
| API State          | RTK Query          |
| Backend            | Node.js + Express  |
| Database           | MongoDB + Mongoose |
| Authentication     | JWT                |
| Password Security  | bcryptjs           |
| AI                 | Google Gemini      |
| Real-Time          | Socket.IO          |
| Validation         | express-validator  |
| API Protection     | express-rate-limit |
| Orders             | Implemented        |
| Wishlist           | Implemented        |
| Reviews            | Implemented        |
| Coupons            | Implemented        |
| Inventory          | Implemented        |
| Notifications      | Implemented        |
| Audit Logging      | Implemented        |
| Invoice Generation | Implemented        |
| Email Service      | Implemented        |
| Docker             | Supported          |
| Render             | Configured         |
| Vercel             | Configured         |

---

# 👨‍💻 Author

**Yassine Kaltoum**

Software & Network Engineering Expert
Software Engineering Master's Student

### Areas of Expertise

* Software Engineering
* Full-Stack Web Development
* Network Engineering
* Cybersecurity
* System Architecture
* UI/UX Design
* Web Design
* AI Integration

---

# 📜 License

This project is intended for educational, portfolio, demonstration, and development purposes.

If you intend to use the project commercially, review and define an appropriate software license and ensure that all third-party assets, APIs, libraries, product images, and services are used according to their respective licenses and terms.

---

<div align="center">

### ✨ Aura & Co. Boutique

**Discover. Personalize. Shop.**

Built with modern web technologies, AI, and a security-conscious full-stack architecture.

⭐ If you find this project useful, consider giving the repository a star.

</div>
