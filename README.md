# ⭐ Ratify

> A full-stack store rating platform where users can discover and rate stores.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Default Credentials](#default-credentials)
- [API Endpoints](#api-endpoints)
- [Form Validations](#form-validations)

---

## About

**Ratify** is a multi-role web application built as a Full Stack Intern Coding Challenge submission. Users can browse registered stores and submit star ratings (1–5). The platform supports three distinct roles — System Administrator, Normal User, and Store Owner — each with role-specific dashboards and functionalities, all protected by JWT-based authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT + bcryptjs |
| HTTP Client | Axios |

---

## Features

### 🔐 System Administrator
- Dashboard with total users, stores, and ratings count
- Add and manage users (admin, normal user, store owner)
- Add and manage stores with owner assignment
- Filter users and stores by name, email, address, role
- Sort all table listings (ascending/descending)
- View detailed user profiles (store rating shown for store owners)

### 👤 Normal User
- Register via signup page
- Browse all registered stores
- Search stores by name and address
- Submit star ratings (1–5) for any store
- Modify previously submitted ratings
- Update account password

### 🏪 Store Owner
- View store dashboard with average rating
- See list of users who rated their store with rating values and dates
- Update account password

---

## Project Structure

```
Ratify/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # signup, login, update password
│   │   ├── adminController.js     # dashboard, users & stores CRUD
│   │   ├── userController.js      # store listing, submit/update ratings
│   │   └── storeOwnerController.js# store owner dashboard
│   ├── middleware/
│   │   └── auth.js                # JWT verify + role guards
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   ├── admin.js               # /api/admin/*
│   │   ├── user.js                # /api/user/*
│   │   └── storeOwner.js          # /api/store-owner/*
│   ├── .env                       # environment variables (not in git)
│   └── index.js                   # Express app entry point
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js     # global auth state (Context API)
        ├── utils/
        │   └── api.js             # axios instance with interceptor
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── admin/
        │   │   ├── Dashboard.jsx
        │   │   ├── Users.jsx
        │   │   └── Stores.jsx
        │   ├── user/
        │   │   └── Stores.jsx
        │   └── storeOwner/
        │       └── Dashboard.jsx
        └── App.js                 # routes + protected route logic
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0)

### 1. Clone the Repository

```bash
git clone https://github.com/omkale07/Ratify.git
cd Ratify
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ratify_db
JWT_SECRET=ratify_super_secret_key
```

Start the backend server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Database Setup

Open MySQL and run the following:

```sql
CREATE DATABASE ratify_db;
USE ratify_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  address VARCHAR(400) NOT NULL,
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_store (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Default system admin
INSERT INTO users (name, email, password, address, role) VALUES (
  'System Administrator',
  'admin@ratify.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Ratify HQ Mumbai India',
  'admin'
);
```

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@ratify.com | password |

> Admin can create Store Owner accounts from the Users management page. Normal users can self-register via the Signup page.

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | None | Register normal user |
| POST | `/api/auth/login` | None | Login (all roles) |
| PUT | `/api/auth/update-password` | Token | Update password |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Get platform stats |
| GET | `/api/admin/users` | Admin | List users with filters & sort |
| POST | `/api/admin/users` | Admin | Add new user (any role) |
| GET | `/api/admin/users/:id` | Admin | Get user details |
| GET | `/api/admin/stores` | Admin | List stores with filters & sort |
| POST | `/api/admin/stores` | Admin | Add new store |

### User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/stores` | Token | Get stores with ratings |
| POST | `/api/user/ratings` | Token | Submit a rating |
| PUT | `/api/user/ratings` | Token | Update a rating |

### Store Owner
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/store-owner/dashboard` | Store Owner | Get store dashboard |

---

## Form Validations

| Field | Rule |
|---|---|
| Name | Minimum 20 characters, Maximum 60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters, must include at least one uppercase letter and one special character |
| Email | Standard email format |
| Rating | Integer between 1 and 5 |

---

## Screenshots

| Page | Description |
|---|---|
| Login | Single login for all roles with role-based redirect |
| Admin Dashboard | Stats cards — users, stores, ratings |
| Admin Users | Filterable, sortable table with add/view modals |
| Admin Stores | Filterable, sortable table with average ratings |
| User Stores | Store cards with star rating UI |
| Store Owner | Average rating + rater table |

---

Made by (https://github.com/omkale07)