# 🛒 E‑commerce Backend API

[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-blue?logo=sequelize)](https://sequelize.org/)
[![Swagger](https://img.shields.io/badge/Swagger-UI-green?logo=swagger)](https://swagger.io/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen)](https://nodejs.org)
[![NestJS Version](https://img.shields.io/badge/nestjs-11.x-red)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue)](https://postgresql.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)




<!-- Набор бейджей для вашего README -->
<p align="left">
  <!-- CI/CD Статус сборки -->
  <a href="https://github.com/bizyukov/internet-magazin-back/actions"><img src="https://github.com/bizyukov/internet-magazin-back/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI Status"></a>
  <!-- Покрытие кода (после настройки Codecov) -->
  <a href="https://codecov.io/gh/bizyukov/internet-magazin-back" > <img src="https://codecov.io/gh/bizyukov/internet-magazin-back/branch/main/graph/badge.svg?token=YOUR_NEW_CODECOV_TOKEN" alt="Code Coverage" /> </a>
  <!-- Качество кода от SonarCloud -->
  <a href="https://sonarcloud.io/project/overview?id=bizyukov_internet-magazin-back"><img src="https://sonarcloud.io/api/project_badges/measure?project=bizyukov_internet-magazin-back&metric=alert_status" alt="Quality Gate Status"></a>
  <!-- Лицензия MIT -->
  <img src="https://img.shields.io/github/license/bizyukov/internet-magazin-back" alt="License">
</p>

A full-featured REST API for an e-commerce platform with authentication, shopping cart, orders, admin panel, and Swagger documentation.

## 🚀 Key Features

- **Authentication & Authorization** – JWT, roles (user, admin, manager, content)
- **Users** – registration, profile, password change, blocking
- **Products** – CRUD, filtering (search, category, manufacturer, price), popular/new products
- **Categories** – tree structure, positioning
- **Manufacturers** – CRUD, filtering by country
- **Shopping Cart** – add, update quantity, remove, clear
- **Orders** – create from cart, change status, cancel, reorder
- **Checkout** – saved addresses and payment methods
- **Swagger UI** – interactive documentation (available at `/swagger`)
- **DTO validation** (class-validator)
- **Sequelize ORM** with migrations and relationships (paranoid – soft delete)

## 🧱 Tech Stack

- [NestJS](https://nestjs.com/) (TypeScript)
- [Sequelize](https://sequelize.org/) + [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) (passport-jwt, passport-local)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Swagger](https://swagger.io/) (@nestjs/swagger)

## 📦 Installation & Setup

### Prerequisites

- Node.js (20+)
- PostgreSQL (16+)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the root (example):
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce
JWT_SECRET=mysecretkey
JWT_EXPIRES_IN=1h
PORT=3000

# 4. Start PostgreSQL and create the database (via psql or pgAdmin)

# 5. Run the application (development mode)
npm run start:dev

# 6. Open Swagger documentation
http://localhost:3000/swagger
```
## 🧪 Testing
```bash
# Unit tests
npm test

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```
## 📁 Project Structure (main modules)
```bash
src/
├── auth/              # JWT, local strategies, guards
├── user/              # Users (model, service, controller)
├── products/          # Products (CRUD, filters, popular/new)
├── categories/        # Categories (tree, positioning)
├── manufacturers/     # Manufacturers
├── cart/              # Cart and cart items
├── orders/            # Orders and order items
├── checkout/          # Addresses, payment methods
├── common/            # Guards, decorators, enums, filters
├── config/            # Configuration (database, jwt)
└── main.ts            # Entry point (CORS, Swagger)
```
## 🔐 Roles & Access

| Role | Access |
| :--- | :--- |
| **user** | View products, manage own cart, create/view orders |
| **admin** | Everything, including blocking users and changing roles |
| **manager** | Manage products, categories, manufacturers, and orders |
| **content** | (Optional) Manage site content and descriptions |

## 📝 API Documentation
After starting the app, go to http://localhost:3000/swagger.
All JWT-protected endpoints require the following header:
```bash
Authorization: Bearer <your_token>
```
## 🗄️ Data Models (key relationships)
User → Order, Cart

Product → Category, Manufacturer, OrderItem, CartItem

Category → self-reference (parentId → children)

Order → OrderItem (one-to-many)

Cart → CartItem (one-to-many)

Address / PaymentMethod → User (via Checkout)

## 🤝 Contributing
This project was created to demonstrate backend development expertise.
If you wish to help – open an issue or pull request (follow the coding style, write tests).

## 📄 Лицензия
**UNLICENSED** – This code is intended solely for portfolio and educational purposes. Do not use it in commercial projects without the author's permission.

## 👤 Author & EB‑1A Context
**GitHub:** @bizyukov
This repository is part of a curated portfolio documenting 15+ years of software development, supporting an EB‑1A extraordinary ability visa petition under the original contributions criterion.

## ✉️ Контакты
Author: @bizyukov – [ссылка на LinkedIn / Telegram]

⭐ If this project was helpful, give it a star! It helps motivate me to keep improving.