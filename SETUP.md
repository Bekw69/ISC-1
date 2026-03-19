# StudyGig — Setup Guide

## Requirements

- PostgreSQL 16+
- Node.js 20+

---

## 1. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE studygig;"
```

Then connect and run the schema:

```sql
\c studygig

CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  email    TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name     TEXT NOT NULL,
  role     TEXT NOT NULL DEFAULT 'client'
);

CREATE TABLE services (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  price       NUMERIC NOT NULL,
  category    TEXT NOT NULL DEFAULT 'Other',
  seller_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  service_id   INTEGER REFERENCES services(id) ON DELETE CASCADE,
  buyer_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  requirements TEXT DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Backend Setup

```bash
cd backend
cp .env.example .env   # then fill in your values
npm install
node server.js
```

Backend starts at: **http://localhost:4000**

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 4. Environment Variables

Create `backend/.env` based on `.env.example`:

```env
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studygig
DB_USER=postgres
DB_PASSWORD=your-password
PORT=4000
```

---

## 5. Create Admin User

```sql
-- Run in psql after creating a user via /register
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Features

| Feature | Description |
|---------|-------------|
| Auth | JWT via Bearer token, stored in localStorage, 7-day expiry |
| Services | Full CRUD — students post, edit and delete their services |
| Orders | Lifecycle: `pending` → `accepted` / `rejected` → `completed` |
| Role-based access | `student` posts services, `client` places orders, `admin` views all |
| Category filter | Web Development, Design, Writing, Marketing, Video, Other |
| Search | Full-text search across service title and description |
