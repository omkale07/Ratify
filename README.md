# Ratify 🏪⭐

A full-stack store rating platform where users can discover and rate stores. Built as a coding challenge submission.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Auth:** JWT (JSON Web Tokens)

## Features

### System Administrator
- Dashboard with total users, stores, and ratings
- Add and manage users (admin, normal user, store owner)
- Add and manage stores
- Filter and sort all listings
- View detailed user profiles

### Normal User
- Register and login
- Browse all stores
- Search stores by name and address
- Submit and update ratings (1-5 stars)
- Update password

### Store Owner
- View store dashboard
- See average store rating
- View list of users who rated their store
- Update password

## Project Structure

ratify/

├── backend/

│   ├── config/         # Database connection

│   ├── controllers/    # Business logic

│   ├── middleware/     # JWT auth middleware

│   ├── routes/         # API routes

│   └── index.js        # Entry point

└── frontend/

└── src/

├── context/    # Auth context

├── pages/      # All pages

│   ├── admin/

│   ├── user/

│   └── storeOwner/

└── utils/      # API utility

## Getting Started

### Prerequisites
- Node.js
- MySQL

### 1. Clone the repository
```bash
git clone https://github.com/omkale07/-ratify.git
cd ratify
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ratify_db
JWT_SECRET=ratify_super_secret_key
```

### 3. Database Setup
Open MySQL and run:
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

-- Default admin user (password: Admin@123)
INSERT INTO users (name, email, password, address, role) VALUES (
  'System Administrator',
  'admin@ratify.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Ratify HQ Mumbai India',
  'admin'
);
```

### 4. Start Backend
```bash
npm run dev
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 6. Access the App
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@ratify.com | password |

## Form Validations
- **Name:** 20-60 characters
- **Address:** Max 400 characters
- **Password:** 8-16 characters, must include uppercase and special character
- **Email:** Standard email format

## API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/signup` — Register
- `PUT /api/auth/update-password` — Update password

### Admin
- `GET /api/admin/dashboard` — Get stats
- `GET /api/admin/users` — List users
- `POST /api/admin/users` — Add user
- `GET /api/admin/users/:id` — User details
- `GET /api/admin/stores` — List stores
- `POST /api/admin/stores` — Add store

### User
- `GET /api/user/stores` — List stores with ratings
- `POST /api/user/ratings` — Submit rating
- `PUT /api/user/ratings` — Update rating

### Store Owner
- `GET /api/store-owner/dashboard` — Store dashboard
