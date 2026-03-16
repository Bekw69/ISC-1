# StudyGig — Student Freelance Marketplace (ISC-1 MVP)

A simple marketplace where student freelancers list their services and clients send hire requests.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Node.js + Express                 |
| Database | SQLite via `better-sqlite3`       |
| Auth     | JWT (`jsonwebtoken`) + `bcryptjs` |
| Frontend | Plain HTML + CSS + JS (no frameworks) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js
```

Open **http://localhost:3000** in your browser.

The database (`marketplace.db`) is created automatically on first run, along with 3 seed freelancer accounts.

---

## Demo Accounts (pre-seeded)

| Name         | Email               | Password    | Category         |
|--------------|---------------------|-------------|------------------|
| Alex Johnson | alex@example.com    | password123 | Web Development  |
| Maria Garcia | maria@example.com   | password123 | Graphic Design   |
| Sam Chen     | sam@example.com     | password123 | Content Writing  |

---

## Project Structure

```
student-freelance-marketplace/
├── server.js           # Express app — all API routes
├── database.js         # SQLite schema creation + seed data
├── marketplace.db      # SQLite database file (auto-generated)
├── package.json
├── README.md
└── public/
    ├── index.html      # Browse all freelancer listings
    ├── listing.html    # Single freelancer profile + "Hire Me" form
    ├── register.html   # Freelancer registration form
    ├── login.html      # Freelancer login form
    ├── dashboard.html  # Freelancer's incoming hire requests
    └── style.css       # Shared styles for all pages
```

---

## API Reference

| Method | Route                       | Auth Required | Description                        |
|--------|-----------------------------|---------------|------------------------------------|
| POST   | `/api/auth/register`        | No            | Register a new freelancer          |
| POST   | `/api/auth/login`           | No            | Login, returns JWT token           |
| GET    | `/api/listings`             | No            | List all freelancer profiles       |
| GET    | `/api/listings/:id`         | No            | Get a single freelancer profile    |
| POST   | `/api/orders`               | No            | Client submits a hire request      |
| GET    | `/api/orders/:freelancer_id`| JWT Bearer    | Get all orders for a freelancer    |

### Auth header format
```
Authorization: Bearer <your_jwt_token>
```

---

## User Flow

1. **Freelancers** register at `/register.html` — their profile immediately appears in the marketplace.
2. **Clients** browse at `/index.html`, click a card to view a full profile.
3. **Clients** fill out the "Hire Me" form — the request is saved to the `orders` table.
4. **Freelancers** log in and visit `/dashboard.html` to see all incoming hire requests.

---

## Database Schema

```sql
-- Freelancer accounts
CREATE TABLE freelancers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    UNIQUE NOT NULL,
  password_hash TEXT    NOT NULL,
  category      TEXT    NOT NULL,
  bio           TEXT    DEFAULT '',
  hourly_rate   REAL    NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Client hire requests
CREATE TABLE orders (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  freelancer_id INTEGER NOT NULL REFERENCES freelancers(id),
  client_name   TEXT    NOT NULL,
  client_email  TEXT    NOT NULL,
  message       TEXT    DEFAULT '',
  status        TEXT    DEFAULT 'pending',  -- pending | accepted | rejected
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

| Variable     | Default                              | Description              |
|--------------|--------------------------------------|--------------------------|
| `PORT`       | `3000`                               | Port the server listens on |
| `JWT_SECRET` | `studygig-secret-key-change-me`      | Secret for signing JWTs  |

> **Production note:** Always set a strong `JWT_SECRET` environment variable before deploying.
