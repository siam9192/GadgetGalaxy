# 🛒 GadgetGalaxy - E-commerce Shop

A modern and responsive e-commerce platform for selling tech gadgets. GadgetGalaxy enables users to browse products, manage carts, place secure orders, and track purchases with ease.

---

## 📌 Overview

GadgetGalaxy provides the following core functionalities:

- Browse and filter products by categories and brands
- View detailed product information, specifications, and images
- Manage shopping cart and place orders
- Secure checkout using Stripe or SSLCommerze
- User authentication, profile management, and order history
- Admin panel for managing products and orders

---

## 💡 Features

- 🔐 **Secure Authentication & Authorization**  
  Email/password (with otp verification) login and Google OAuth support

- 📦 **Product Catalog with Variants**  
  Filter by category/brand with variant options and detailed specs

- 🛒 **Cart & Order Management**  
  Real-time cart updates, quantity adjustments, and order tracking

- 💳 **Secure Payment Integration**  
  Integrated with Stripe and SSLCommerze for reliable checkout

- 📜 **Order History **  
  Users can track orders
-🗨️ **Product Review**  
  Customers can submit product review after order successfully delivered 
- 📱 **Responsive Design**  
  Fully mobile-friendly and optimized for tablets and desktops

---

## 🛠️ Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Frontend   | Next Js ,Redux,axios,TailwindCSS , CSS3 |
| Backend    | Express.js,Prisma ORM       |
| Database   | PostgreSQL            |
| Authentication | JWT, Google OAuth |
| Payment    | SSLCommerze |


---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v16+)
- PostgreSQL
- SSLCommerze API credentials

---

### Project Installation 

```bash
git clone https://github.com/your-username/donation-campaign-website.git
npm install
```
### How to run backend ?

``bash 
cd backend
npm install
``
- Create a .env file inside the backend/ folder (not the project root unless specified).
- Copy the variables from .env.local (if provided) and paste them into your .env file.
- Set appropriate values for each environment variable 

### 🔧 Start the Backend Server

``bash 
npm run dev
``
Once the command runs successfully, backend server should be up and running (typically on http://localhost:5000 or whichever port is set in .env).


### How to run client

``bash 
cd backend
npm install
``

### 🔧 Start the client Server

``bash 
npm run dev
``

Once the command runs successfully, client server should be up and running (typically on http://localhost:5173 or whichever  port  is free).
