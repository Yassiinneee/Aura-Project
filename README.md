# ✨ Aura & Co. Boutique

<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
<img src="https://img.shields.io/badge/MongoDB-9.7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Mongoose-9.7-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose">
<img src="https://img.shields.io/badge/Redux%20Toolkit-2.12-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit">
<img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO">
<img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">
<img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
<img src="https://img.shields.io/badge/bcrypt-Password%20Hashing-003B57?style=for-the-badge" alt="bcrypt">
<img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">

<br>

<img src="https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render">
<img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas">

<br><br>

**A modern full-stack AI-powered e-commerce platform for a premium boutique shopping experience.**

**Discover · Personalize · Shop · Connect**

</div>

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Project Objectives](#-project-objectives)
* [Core Features](#-core-features)
* [Application Architecture](#-application-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Frontend Architecture](#-frontend-architecture)
* [Backend Architecture](#-backend-architecture)
* [Authentication & Authorization](#-authentication--authorization)
* [AI Shopping Concierge](#-ai-shopping-concierge)
* [Real-Time Communication](#-real-time-communication)
* [E-Commerce Functionality](#-e-commerce-functionality)
* [Inventory Management](#-inventory-management)
* [Order Management](#-order-management)
* [Wishlist](#-wishlist)
* [Reviews & Moderation](#-reviews--moderation)
* [Coupons](#-coupons)
* [Notifications](#-notifications)
* [Email & Invoices](#-email--invoices)
* [Administration & Analytics](#-administration--analytics)
* [Security](#-security)
* [Database Architecture](#-database-architecture)
* [API Architecture](#-api-architecture)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Running Locally](#-running-locally)
* [Docker](#-docker)
* [Deployment](#-deployment)
* [Vercel Deployment](#-vercel-deployment)
* [Render Deployment](#-render-deployment)
* [MongoDB Atlas](#-mongodb-atlas)
* [Production Configuration](#-production-configuration)
* [Development Workflow](#-development-workflow)
* [Future Improvements](#-future-improvements)
* [Project Highlights](#-project-highlights)
* [Author](#-author)
* [License](#-license)

---

# 🌟 Overview

**Aura & Co. Boutique** is a full-stack e-commerce platform designed to deliver a premium, modern and interactive shopping experience.

The application combines a responsive React frontend with a Node.js/Express backend, MongoDB persistence, JWT authentication, Socket.IO real-time communication, and Google Gemini artificial intelligence.

The platform provides both **customer-facing shopping functionality** and a dedicated **administrative management layer**.

### Platform Vision

Aura is built around three major principles:

* 🛍️ **Premium E-Commerce Experience**
* 🤖 **AI-Assisted Product Discovery**
* 🔐 **Security-Conscious Full-Stack Architecture**

The platform is designed to provide a complete shopping lifecycle:

```text
Discover
   ↓
Search & Filter
   ↓
Product Details
   ↓
AI Recommendations
   ↓
Wishlist / Cart
   ↓
Checkout
   ↓
Order
   ↓
Real-Time Notifications
   ↓
Order Tracking
```

---

# 🌐 Live Demo

The Aura Boutique e-commerce platform is deployed and publicly accessible through Vercel.

**Production Website:**

👉 https://aura-projectt-nine.vercel.app/


---

# 🎯 Project Objectives

The main objectives of Aura & Co. Boutique are:

1. Build a complete modern e-commerce application.
2. Develop a responsive and interactive user interface.
3. Implement secure user authentication.
4. Implement role-based authorization.
5. Provide product search and filtering.
6. Provide shopping cart and wishlist functionality.
7. Implement product reviews and moderation.
8. Implement inventory and stock management.
9. Implement coupon management.
10. Implement order and checkout workflows.
11. Integrate Google Gemini as an AI shopping assistant.
12. Implement real-time notifications using Socket.IO.
13. Generate order invoices.
14. Implement administrative analytics.
15. Maintain audit logs for sensitive operations.
16. Protect APIs using validation and rate limiting.
17. Support Docker-based development and deployment.
18. Support Vercel frontend deployment.
19. Support Render backend deployment.
20. Use MongoDB/MongoDB Atlas as the persistence layer.

---

# 🚀 Core Features

## 👤 Customer Features

* User registration
* User login
* JWT authentication
* Product browsing
* Product search
* Category filtering
* Price filtering
* Rating filtering
* Stock filtering
* Product sorting
* Product details
* Product variants
* Shopping cart
* Wishlist
* Product reviews
* Checkout
* Order creation
* Order history
* Invoice access
* Notifications
* Order status updates
* AI shopping assistant

---

## 🤖 AI Features

* Gemini-powered shopping assistant
* Natural-language product discovery
* Product recommendations
* Customer questions
* AI-assisted shopping experience
* Backend-protected Gemini API key
* Dedicated AI rate limiting

---

## 👨‍💼 Administrative Features

* Product management
* Category management
* User management
* Role management
* Order management
* Inventory management
* Stock adjustments
* Stock movement history
* Coupon management
* Review moderation
* Analytics
* Audit logging
* Notification management
* Email administration
* Upload management

---

# 🏗️ Application Architecture

Aura follows a modular full-stack architecture.

```text
                         ┌─────────────────────┐
                         │      Customer       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │      + Vite         │
                         └──────────┬──────────┘
                                    │
                     REST API / WebSocket
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      Node.js        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │  MongoDB    │      │ Gemini API  │      │ Socket.IO   │
       │  Database   │      │     AI      │      │ Real-Time   │
       └─────────────┘      └─────────────┘      └─────────────┘
```

---

# 🧰 Technology Stack

## Frontend

| Technology       | Version / Role |
| ---------------- | -------------- |
| React            | 19             |
| Vite             | 6              |
| JavaScript       | ES Modules     |
| Tailwind CSS     | 4              |
| Redux Toolkit    | 2.12           |
| React Redux      | 9.3            |
| Axios            | 1.19           |
| Socket.IO Client | 4.8            |
| Motion           | 12             |
| Lucide React     | UI icons       |

---

## Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | JavaScript runtime         |
| Express.js         | REST API                   |
| MongoDB            | Database                   |
| Mongoose           | MongoDB ODM                |
| JWT                | Authentication             |
| bcryptjs           | Password hashing           |
| Socket.IO          | Real-time communication    |
| express-rate-limit | Rate limiting              |
| express-validator  | Request validation         |
| CORS               | Cross-origin communication |
| dotenv             | Environment configuration  |
| Google GenAI       | Gemini integration         |

---

## DevOps & Deployment

| Technology     | Purpose                     |
| -------------- | --------------------------- |
| Docker         | Containerization            |
| Docker Compose | Multi-container development |
| Vercel         | Frontend deployment         |
| Render         | Backend deployment          |
| MongoDB Atlas  | Cloud database              |

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
│   │   ├── index.js
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
│   │   ├── validators.js
│   │   └── index.js
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
│   │   ├── Wishlist.js
│   │   └── index.js
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
│   │   ├── index.js
│   │   ├── paymentService.js
│   │   └── pdfService.js
│   │
│   └── websockets/
│       ├── index.js
│       └── socketHandler.js
│
├── server.js
├── package.json
├── package-lock.json
├── bun.lock
├── docker-compose.yml
├── render.yaml
├── vercel.json
├── vite.config.js
├── metadata.json
├── .dockerignore
└── .gitignore
```

---

# 🎨 Frontend Architecture

The frontend is built with **React 19 and Vite**.

The application follows a component-based architecture.

### Main Components

| Component            | Responsibility          |
| -------------------- | ----------------------- |
| `Navbar`             | Navigation              |
| `HeroBanner`         | Storefront hero section |
| `ProductCard`        | Product preview         |
| `ProductModal`       | Product details         |
| `CartDrawer`         | Shopping cart           |
| `CheckoutModal`      | Checkout                |
| `OrdersModal`        | Order history           |
| `WishlistModal`      | Wishlist                |
| `ReviewModal`        | Product reviews         |
| `AuthModal`          | Authentication          |
| `AiAssistant`        | Gemini AI assistant     |
| `AdminModal`         | Admin interface         |
| `NotificationCenter` | Notifications           |
| `OrderSuccessModal`  | Order confirmation      |
| `Footer`             | Application footer      |

---

# 🔄 State Management

Aura uses **Redux Toolkit** for application state management.

The main Redux files are:

```text
Client/store/store.js
Client/store/apiSlice.js
```

The architecture separates:

* Global application state
* API state
* Cached server data
* UI state

### Data Flow

```text
React Component
      │
      ▼
Redux / RTK Query
      │
      ▼
Axios / API Layer
      │
      ▼
Express REST API
      │
      ▼
MongoDB
```

---

# 🔧 Backend Architecture

The backend follows a modular structure:

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

### Controllers

Controllers contain request-handling logic.

Examples:

```text
authController.js
productController.js
orderController.js
inventoryController.js
aiController.js
analyticsController.js
```

### Services

Business logic that requires reusable processing is separated into services.

Examples:

```text
auditService.js
emailService.js
paymentService.js
pdfService.js
```

### Models

Mongoose models represent the application's data domains.

---

# 🔐 Authentication & Authorization

Authentication uses **JSON Web Tokens (JWT)**.

### Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Authentication Controller
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
Authorization
 │
 ▼
JWT Middleware
 │
 ▼
Protected Route
```

Passwords are hashed using `bcryptjs`.

---

## 👥 Authorization Roles

The application supports role-based access control.

### Customer

Can:

* Browse products
* Manage cart
* Manage wishlist
* Create orders
* Submit reviews
* Receive notifications

### Administrator

Can additionally:

* Manage products
* Manage users
* Manage orders
* Manage inventory
* Manage coupons
* Moderate reviews
* Access analytics
* Access audit logs

---

# 🤖 AI Shopping Concierge

Aura integrates **Google Gemini** through the backend.

The AI assistant is exposed through the frontend as:

```text
AiAssistant.jsx
```

The backend integration is implemented through:

```text
server/controllers/aiController.js
server/routes/aiRoutes.js
```

### AI Request Flow

```text
Customer
   │
   ▼
AiAssistant
   │
   ▼
Backend /api/ai
   │
   ▼
AI Controller
   │
   ▼
Google Gemini
   │
   ▼
AI Response
   │
   ▼
Customer
```

### Security Principle

The Gemini API key should remain on the server.

```text
❌ React → Gemini API directly

✅ React → Backend → Gemini API
```

This prevents exposing the API secret in the client bundle.

---

# ⚡ Real-Time Communication

Aura uses **Socket.IO** to support real-time functionality.

Socket-related files:

```text
server/websockets/index.js
server/websockets/socketHandler.js
Client/utils/socket.js
```

Real-time communication can be used for:

* Notifications
* Order updates
* Administrative events
* Inventory events
* User-specific events

### Real-Time Architecture

```text
                 Socket.IO
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     User Room   Order Room   Admin Room
        │            │            │
        ▼            ▼            ▼
 Notifications  Order Events   Alerts
```

---

# 🛍️ E-Commerce Functionality

## Product Catalog

Customers can:

* Browse products
* Search products
* Filter by category
* Filter by price
* Filter by rating
* Filter by availability
* Sort products
* View detailed product information

---

## 🔎 Product Filtering

The storefront supports multiple product discovery criteria:

```text
Category
Search
Price
Rating
Stock
Sorting
```

This allows customers to quickly narrow the catalog to relevant products.

---

# 🛒 Shopping Cart

The shopping cart provides:

* Product addition
* Quantity modification
* Product removal
* Variant handling
* Cart totals
* User-specific persistence

The main interface is:

```text
CartDrawer.jsx
```

---

# ❤️ Wishlist

Users can save products for later.

Features include:

* Add product
* Remove product
* View saved products
* User-specific wishlist persistence

Backend components:

```text
wishlistController.js
wishlistRoutes.js
Wishlist.js
```

---

# ⭐ Reviews & Moderation

The platform provides a product review system.

Customers can:

* Submit reviews
* Provide ratings
* View product reviews

Administrators can:

* Moderate reviews
* Manage inappropriate content

Review operations are protected with validation and rate limiting.

---

# 📦 Inventory Management

Aura includes dedicated inventory functionality.

The inventory system supports:

* Stock tracking
* Stock adjustments
* Low-stock monitoring
* Stock movement records
* Inventory summaries

Relevant backend components:

```text
inventoryController.js
inventoryRoutes.js
StockMovement.js
```

### Inventory Flow

```text
Product
   │
   ▼
Inventory
   │
   ├── Stock Increase
   ├── Stock Decrease
   └── Stock Adjustment
          │
          ▼
    Stock Movement
```

---

# 📋 Order Management

The platform provides a complete order lifecycle.

```text
Cart
 │
 ▼
Checkout
 │
 ▼
Delivery Selection
 │
 ▼
Payment Processing
 │
 ▼
Order Creation
 │
 ▼
Confirmation
 │
 ▼
Order Tracking
```

Customers can access:

* Current orders
* Previous orders
* Order details
* Order status
* Invoice information

Administrators can manage order statuses.

---

# 💳 Payment Service

The backend contains a dedicated payment service:

```text
server/services/paymentService.js
server/controllers/paymentController.js
server/routes/paymentRoutes.js
```

The project architecture separates payment processing from order business logic.

> **Production note:** Any simulated or development payment workflow should be replaced with a PCI-compliant provider before commercial deployment.

---

# 🎟️ Coupons

Aura includes coupon management.

Administrators can:

* Create coupons
* Validate coupons
* Delete coupons
* Manage discount rules

Relevant components:

```text
couponController.js
couponRoutes.js
Coupon.js
```

---

# 🔔 Notifications

The application includes a notification system.

Customers can:

* Receive notifications
* View notifications
* Mark notifications as read
* Clear notifications

Relevant components:

```text
Notification.js
notificationController.js
notificationRoutes.js
NotificationCenter.jsx
```

Socket.IO can be used to deliver real-time events.

---

# 📧 Email & Invoices

The backend includes an email service and PDF/invoice service.

### Email

```text
server/services/emailService.js
server/controllers/emailController.js
server/routes/emailRoutes.js
```

The architecture supports transactional email workflows such as:

* Order confirmation
* Order updates
* Administrative email operations

### Invoice

```text
server/services/pdfService.js
```

Invoices can contain:

* Customer details
* Order identifier
* Products
* Quantities
* Prices
* Delivery information
* Order totals

---

# 📊 Administration & Analytics

Aura includes an administrative management layer.

### Administration Areas

```text
Users
Products
Categories
Orders
Inventory
Coupons
Reviews
Notifications
Emails
Analytics
Audit Logs
```

### Analytics

Analytics functionality is implemented through:

```text
analyticsController.js
```

It can be used to provide business-level insights such as:

* Orders
* Revenue
* Product activity
* Inventory information
* Customer activity

---

# 🧾 Audit Logging

Sensitive administrative actions can be recorded through the audit system.

Relevant files:

```text
server/models/AuditLog.js
server/services/auditService.js
server/controllers/auditController.js
server/routes/auditRoutes.js
```

Audit information can include:

* Actor
* Action
* Target resource
* Target identifier
* Details
* Timestamp
* IP information
* Correlation information

This provides better accountability and troubleshooting capabilities.

---

# 🛡️ Security

Security is integrated across the application.

## Password Hashing

Passwords are hashed with:

```text
bcryptjs
```

Plain-text passwords should never be stored.

---

## JWT Authentication

Protected resources require a valid JWT.

```text
Authorization: Bearer <token>
```

---

## Input Validation

The application uses:

```text
express-validator
```

to validate incoming requests.

Validation helps protect against malformed or unexpected input.

---

## Rate Limiting

The backend uses:

```text
express-rate-limit
```

to limit excessive requests.

Dedicated limits can be applied to sensitive areas such as:

* Authentication
* AI requests
* Orders
* Reviews
* Uploads
* General API traffic

---

## CORS

Cross-Origin Resource Sharing is configured to allow communication between the frontend and backend.

For production, the allowed origin should be restricted to the actual frontend domain.

Example:

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## Environment Secrets

Sensitive values should never be committed to Git.

Examples:

```text
MONGO_URI
JWT_SECRET
GEMINI_API_KEY
PAYMENT_WEBHOOK_SECRET
```

Use environment variables or your hosting provider's secret-management system.

---

# 🗄️ Database Architecture

Aura uses **MongoDB with Mongoose**.

### Main Data Models

```text
User
Product
Category
Order
Wishlist
Notification
Coupon
StockMovement
AuditLog
EmailRecord
```

### Relationship Overview

```text
User
 │
 ├── Orders
 ├── Wishlist
 └── Notifications

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
 └── StockMovement

Administration
 │
 ├── AuditLog
 └── EmailRecord
```

---

# 🔌 API Architecture

The backend API is organized under:

```text
/api
```

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

---

## Categories

```http
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

---

## Orders

```http
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
GET    /api/orders/:id/invoice
```

---

## Wishlist

```http
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

---

## Notifications

```http
GET /api/notifications
PUT /api/notifications/:id/read
POST /api/notifications/clear-all
```

---

## Inventory

```http
GET  /api/inventory/summary
GET  /api/inventory/low-stock
GET  /api/inventory/stock-movements
POST /api/inventory/adjust
```

---

## Coupons

```http
GET    /api/coupons
POST   /api/coupons
POST   /api/coupons/validate
DELETE /api/coupons/:id
```

---

## AI

```http
POST /api/ai
```

The AI endpoint communicates with Google Gemini from the backend.

---

## Health Check

```http
GET /api/health
```

This endpoint is also configured as the Render health-check endpoint.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development

PORT=3000

MONGO_URI=mongodb://localhost:27017/aura_boutique

JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CORS_ORIGIN=http://localhost:5173
```

### Production Example

```env
NODE_ENV=production

PORT=3000

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

JWT_SECRET=your_production_secret

GEMINI_API_KEY=your_production_gemini_key

CORS_ORIGIN=https://your-frontend.vercel.app
```

---

# 📥 Installation

## Prerequisites

Install the following:

* Node.js 18+
* npm
* Git
* MongoDB or MongoDB Atlas

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

```bash
npm install
```

For the client separately:

```bash
cd Client
npm install
cd ..
```

---

## 3. Configure Environment Variables

Create:

```text
.env
```

and configure:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

---

# ▶️ Running Locally

## Development Server

Run:

```bash
npm run dev
```

The project starts the Node.js server through:

```text
server.js
```

The application is available at:

```text
http://localhost:3000
```

---

## Frontend Development Mode

You can also run the Vite client directly:

```bash
cd Client
npm run dev
```

Vite normally provides:

```text
http://localhost:5173
```

---

# 🏗️ Build

Create a production frontend build:

```bash
npm run build
```

The Vite build generates the production frontend assets.

---

# 🐳 Docker

Aura includes Docker Compose configuration.

Start the complete environment with:

```bash
docker compose up --build
```

The Docker architecture contains:

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

The application is exposed on:

```text
http://localhost:3000
```

MongoDB is exposed on:

```text
mongodb://localhost:27017
```

Persistent database storage uses the:

```text
mongo_data
```

Docker volume.

---

# 🚀 Deployment

Aura is designed for a separated cloud architecture:

```text
                     INTERNET
                        │
                        ▼
               ┌────────────────┐
               │     Vercel     │
               │    Frontend    │
               └───────┬────────┘
                       │
                       │ HTTPS
                       ▼
               ┌────────────────┐
               │     Render     │
               │    Backend     │
               │ Node + Express │
               └───────┬────────┘
                       │
                       │ MongoDB URI
                       ▼
               ┌────────────────┐
               │ MongoDB Atlas  │
               │    Database    │
               └────────────────┘
```

### Deployment Responsibilities

| Platform      | Responsibility                        |
| ------------- | ------------------------------------- |
| Vercel        | React/Vite frontend                   |
| Render        | Node.js/Express backend               |
| MongoDB Atlas | Cloud database                        |
| Docker        | Containerized local/server deployment |

---

# ▲ Vercel Deployment

The frontend can be deployed using **Vercel**.

The project contains:

```text
Client/vercel.json
```

and a root-level Vercel configuration.

### Recommended Vercel Settings

```text
Framework: Vite
Root Directory: Client
Build Command: npm run build
Output Directory: dist
```

### Deployment

From Vercel:

1. Import the GitHub repository.
2. Set the project root to `Client`.
3. Configure the build command.
4. Configure the output directory.
5. Deploy.

---

## Vercel Environment Variables

Configure the backend API URL if the frontend requires a runtime API configuration.

Example:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

The exact variable name should match the frontend configuration used by the application.

---

# 🟢 Render Deployment

The backend is configured for Render through:

```text
render.yaml
```

The configuration defines:

```yaml
services:
  - type: web
    name: aura-boutique-backend
    env: node
```

The configured build command is:

```text
npm install
```

The configured start command is:

```text
node server.js
```

The health check is:

```text
/api/health
```

---

## Render Environment Variables

Configure the following in Render:

```text
NODE_ENV=production
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<secure generated secret>
GEMINI_API_KEY=<Gemini API key>
CORS_ORIGIN=<Vercel frontend URL>
```

### Recommended Production CORS

Instead of:

```text
CORS_ORIGIN=*
```

use the actual frontend domain:

```text
CORS_ORIGIN=https://your-project.vercel.app
```

This is recommended for production security.

---

# 🍃 MongoDB Atlas

For production deployment, MongoDB Atlas can be used as the database provider.

### Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Configure network access.
4. Copy the MongoDB connection string.
5. Set it as `MONGO_URI` in Render.
6. Deploy the backend.
7. Verify:

```text
GET /api/health
```

### Example URI

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/aura_boutique
```

Never commit the connection string to Git.

---

# 🔐 Production Configuration

Before deploying the application publicly, verify:

### Security

* Use a strong `JWT_SECRET`.
* Use HTTPS.
* Restrict CORS.
* Keep Gemini credentials server-side.
* Keep MongoDB credentials private.
* Use production environment variables.
* Enable appropriate rate limits.
* Validate all user input.
* Do not commit `.env` files.

### Database

* Use MongoDB Atlas.
* Configure appropriate network access.
* Create a dedicated database user.
* Use strong database credentials.
* Monitor database usage.

### Payments

Replace any development payment simulation with a real PCI-compliant payment provider.

### File Uploads

Production uploads should enforce:

* File size limits
* MIME-type validation
* Secure storage
* Image processing
* Appropriate access control

---

# 🩺 Health Monitoring

The backend exposes:

```http
GET /api/health
```

This endpoint can be used by Render or external monitoring systems.

Example:

```json
{
  "status": "ok",
  "mongoConnected": true,
  "hasGeminiKey": true,
  "timestamp": "2026-09-02T00:00:00.000Z"
}
```

---

# 🔄 Development Workflow

Recommended workflow:

```text
Create Feature
     ↓
Create Branch
     ↓
Develop
     ↓
Validate
     ↓
Test Frontend
     ↓
Test Backend
     ↓
Test Authentication
     ↓
Test API
     ↓
Test Socket.IO
     ↓
Build Production Version
     ↓
Commit
     ↓
Push
     ↓
Deploy
```

### Recommended Branch Names

```text
feature/product-search
feature/ai-assistant
feature/order-management
feature/inventory
feature/notifications
feature/analytics
fix/authentication
fix/checkout
security/api-protection
```

---

# 🧪 Testing Strategy

A production-ready evolution of the project should include automated testing at multiple levels.

### Unit Testing

Test:

* Services
* Utility functions
* Validation logic
* Authentication helpers

### API Testing

Test:

* Authentication
* Product CRUD
* Orders
* Wishlist
* Coupons
* Inventory
* Notifications
* AI endpoint

### Security Testing

Test:

* Invalid JWT
* Expired JWT
* Unauthorized roles
* Invalid input
* Rate limits
* CORS
* Malicious payloads

### End-to-End Testing

Recommended customer workflow:

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Search
   ↓
Product Details
   ↓
Add to Cart
   ↓
Checkout
   ↓
Create Order
   ↓
View Order
   ↓
Receive Notification
```

---

# 📈 Scalability

The architecture can be extended to support horizontal scaling.

```text
                    Load Balancer
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         Backend 1   Backend 2   Backend 3
             │           │           │
             └───────────┼───────────┘
                         │
                         ▼
                   MongoDB Atlas
```

Potential scalability improvements include:

* Redis caching
* Distributed Socket.IO adapter
* Background workers
* Queue-based email processing
* CDN image delivery
* Database indexing
* Horizontal backend scaling
* Dedicated monitoring infrastructure

---

# 🔮 Future Improvements

Potential future enhancements include:

* Stripe integration
* PayPal production integration
* Redis caching
* Advanced AI product recommendations
* Semantic product search
* AI-generated product descriptions
* Customer personalization
* Multi-language support
* Multi-currency support
* Advanced analytics dashboards
* Two-factor authentication
* OAuth authentication
* Password recovery
* Advanced RBAC
* Automated testing
* GitHub Actions CI/CD
* Swagger/OpenAPI documentation
* Prometheus monitoring
* Grafana dashboards
* Centralized error tracking
* Kubernetes deployment
* Cloudinary/S3 image management
* Background job queues

---

# 📊 Project Highlights

| Category            | Implementation         |
| ------------------- | ---------------------- |
| Frontend            | React 19               |
| Build Tool          | Vite 6                 |
| Language            | JavaScript             |
| Styling             | Tailwind CSS 4         |
| State Management    | Redux Toolkit          |
| API State           | RTK Query architecture |
| HTTP Client         | Axios                  |
| Backend             | Node.js + Express      |
| Database            | MongoDB                |
| ODM                 | Mongoose               |
| Authentication      | JWT                    |
| Password Security   | bcryptjs               |
| AI                  | Google Gemini          |
| Real-Time           | Socket.IO              |
| Validation          | express-validator      |
| Rate Limiting       | express-rate-limit     |
| E-Commerce          | Full shopping workflow |
| Wishlist            | Implemented            |
| Reviews             | Implemented            |
| Inventory           | Implemented            |
| Orders              | Implemented            |
| Coupons             | Implemented            |
| Notifications       | Implemented            |
| Invoices            | Implemented            |
| Email Service       | Implemented            |
| Audit Logs          | Implemented            |
| Analytics           | Implemented            |
| Docker              | Supported              |
| Frontend Deployment | Vercel                 |
| Backend Deployment  | Render                 |
| Cloud Database      | MongoDB Atlas          |

---

# 🧩 Architecture Summary

```text
┌──────────────────────────────────────────────────────────┐
│                    AURA & CO. BOUTIQUE                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                     FRONTEND                             │
│                                                          │
│        React 19 + Vite + Tailwind CSS                    │
│                         │                                │
│              Redux Toolkit / RTK Query                   │
│                         │                                │
│                 Axios + Socket.IO                        │
│                         │                                │
├─────────────────────────┼────────────────────────────────┤
│                         ▼                                │
│                     BACKEND                              │
│                                                          │
│               Node.js + Express.js                       │
│                         │                                │
│        ┌────────────────┼────────────────┐               │
│        ▼                ▼                ▼               │
│      Auth          E-Commerce           AI               │
│        │                │                │               │
│        │                │          Google Gemini         │
│        │                │                                │
│        └────────────────┼────────────────┘               │
│                         ▼                                │
│                     Mongoose                             │
│                         │                                │
├─────────────────────────┼────────────────────────────────┤
│                         ▼                                │
│                  MongoDB / Atlas                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# ☁️ Deployment Architecture Summary

```text
                     GitHub
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
       Vercel                       Render
          │                           │
     React/Vite                Node/Express
     Frontend                    Backend
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
                 MongoDB Atlas
                     Database
```

---

# 👨‍💻 Author

## Yassine Kaltoum

**Software & Network Engineering Expert**

Software Engineering Master's Student

### Expertise

* Full-Stack Web Development
* Software Engineering
* Network Engineering
* Cybersecurity
* System Architecture
* UI/UX Design
* Web Design
* Artificial Intelligence Integration

---

# 🎓 Project Purpose

Aura & Co. Boutique demonstrates the integration of modern web development technologies into a complete full-stack application.

The project combines:

```text
Modern UI/UX
+
Full-Stack Development
+
Database Engineering
+
Authentication
+
Cybersecurity
+
Artificial Intelligence
+
Real-Time Communication
+
Cloud Deployment
+
Containerization
```

It therefore serves as a practical demonstration of modern software engineering principles across the frontend, backend, database, security, AI and DevOps layers.

---

# 📜 License

This project is intended for educational, portfolio, demonstration and development purposes.

Before commercial use, ensure that:

* Third-party dependencies comply with their licenses.
* Product images are properly licensed.
* AI services comply with their terms.
* Payment integrations comply with applicable regulations.
* Appropriate commercial licensing is applied to the project.

---

# ⭐ Acknowledgements

This project was developed using a modern ecosystem of open-source and cloud technologies, including:

* React
* Vite
* Node.js
* Express.js
* MongoDB
* Mongoose
* Redux Toolkit
* Socket.IO
* Tailwind CSS
* Google Gemini
* Docker
* Vercel
* Render

---

<div align="center">

# ✨ Aura & Co. Boutique

### Discover. Personalize. Shop.

**A modern AI-powered full-stack e-commerce experience.**

<br>

<img src="https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Made with JavaScript">

<img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">

<img src="https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">

<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render">

<img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas">

<br><br>

⭐ **If you find this project useful, consider giving the repository a star.**

</div>
