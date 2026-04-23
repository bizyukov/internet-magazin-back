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

Полнофункциональное REST API для интернет-магазина с аутентификацией, корзиной, заказами, администрированием и документированным Swagger.

## 🚀 Основные возможности

- **Аутентификация и авторизация** – JWT, роли (user, admin, manager, content)
- **Пользователи** – регистрация, профиль, смена пароля, блокировка
- **Товары** – CRUD, фильтрация (поиск, категория, производитель, цена), популярные/новые товары
- **Категории** – древовидная структура, позиционирование
- **Производители** – CRUD, фильтрация по стране
- **Корзина** – добавление, обновление количества, удаление, очистка
- **Заказы** – создание из корзины, изменение статуса, отмена, повтор заказа
- **Checkout** – сохранённые адреса и способы оплаты
- **Swagger UI** – интерактивная документация (доступна по `/swagger`)
- **Валидация DTO** (class-validator)
- **Sequelize ORM** с миграциями и связями (paranoid – мягкое удаление)

## 🧱 Технологии

- [NestJS](https://nestjs.com/) (TypeScript)
- [Sequelize](https://sequelize.org/) + [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) (passport-jwt, passport-local)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Swagger](https://swagger.io/) (@nestjs/swagger)

## 📦 Установка и запуск

### Требования

- Node.js (20+)
- PostgreSQL (16+)

### Шаги

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

# 2. Установите зависимости
npm install

# 3. Создайте файл .env в корне (пример):
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce
JWT_SECRET=mysecretkey
JWT_EXPIRES_IN=1h
PORT=3000

# 4. Запустите PostgreSQL и создайте базу данных (через psql или pgAdmin)

# 5. Запустите приложение (режим разработки)
npm run start:dev

# 6. Откройте документацию Swagger
http://localhost:3000/swagger
```
## 🧪 Тестирование
```bash
# Unit тесты
npm test

# Покрытие
npm run test:cov

# E2E тесты
npm run test:e2e
```
## 📁 Структура проекта (основные модули)
```bash
src/
├── auth/              # JWT, local стратегии, guards
├── user/              # Пользователи (модель, сервис, контроллер)
├── products/          # Товары (CRUD, фильтры, популярное/новое)
├── categories/        # Категории (дерево, позиционирование)
├── manufacturers/     # Производители
├── cart/              # Корзина и элементы корзины
├── orders/            # Заказы и позиции заказов
├── checkout/          # Адреса, платежные методы
├── common/            # Guards, decorators, enums, filters
├── config/            # Конфигурация (database, jwt)
└── main.ts            # Входная точка (CORS, Swagger)
```
## 🔐 Роли и доступ
Роль	Доступ
user	просмотр товаров, управление своей корзиной, создание/просмотр заказов
admin	всё, включая блокировку пользователей, изменение ролей
manager	управление товарами, категориями, производителями, заказами
content	(опционально) управление контентом

## 📝 API документация
После запуска перейдите на http://localhost:3000/swagger.
Все эндпоинты, защищённые JWT, требуют передачи заголовка:
```bash
Authorization: Bearer <ваш_токен>
```
## 🗄️ Модели данных (основные связи)
User → Order, Cart

Product → Category, Manufacturer, OrderItem, CartItem

Category → самореференция (parentId → children)

Order → OrderItem (один ко многим)

Cart → CartItem (один ко многим)

Address / PaymentMethod → User (через Checkout)

## 🤝 Вклад и контрибьюция
Проект создан для демонстрации экспертизы в разработке бэкенда.
Если вы хотите помочь – открывайте issue или pull request (следуйте принятому стилю кода, пишите тесты).

## 📄 Лицензия
UNLICENSED – этот код предназначен только для портфолио и образовательных целей. Не используйте в коммерческих проектах без разрешения автора.

👤 Author & EB‑1A Context
GitHub: @bizyukov
This repository is part of a curated portfolio documenting 15+ years of software development, supporting an EB‑1A extraordinary ability visa petition under the original contributions criterion.

## ✉️ Контакты
Автор: @bizyukov – [ссылка на LinkedIn / Telegram]

⭐ Если этот проект был полезен, поставьте звезду! Это помогает мотивировать меня на дальнейшее развитие.