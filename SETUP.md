# StudyGig — Setup Guide

## Requirements
- PostgreSQL 16+
- Java 21+
- Node.js 20+
- Maven 3.9+

---

## 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE studygig;"

# Flyway will run migrations automatically when backend starts
# OR manually:
psql -U postgres -d studygig -f database/migrations/V1__initial_schema.sql
psql -U postgres -d studygig -f database/migrations/V2__seed_categories.sql
```

---

## 2. Backend (Spring Boot)

```bash
cd backend

# Build
mvn clean package -DskipTests

# Run
mvn spring-boot:run

# OR with custom DB:
DB_URL=jdbc:postgresql://localhost:5432/studygig \
DB_USER=postgres \
DB_PASS=yourpassword \
mvn spring-boot:run
```

Backend will start at: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

---

## 3. Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend will start at: http://localhost:5173

---

## 4. Create Admin User

After backend starts, run this SQL:

```sql
-- Get bcrypt hash for Admin@123:
-- Use any bcrypt tool or via Spring's BCryptPasswordEncoder

INSERT INTO users (email, password_hash, role, is_active, is_verified)
VALUES ('admin@studygig.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', TRUE, TRUE);

INSERT INTO profiles (user_id, display_name)
SELECT id, 'Admin' FROM users WHERE email = 'admin@studygig.com';
```

Admin password: `Admin@123`

---

## 5. Docker (all-in-one)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

---

## Features

| Feature | Description |
|---------|-------------|
| Auth | JWT + Refresh tokens (HttpOnly cookies) |
| Profiles | Avatar upload, bio, skills, hourly rate |
| Services | CRUD with image upload (up to 5 photos) |
| Orders | Full lifecycle: PENDING → IN_PROGRESS → COMPLETED |
| Payment | Simulated Stripe-like flow |
| Reviews | 1-5 stars + comments, auto-calculated ratings |
| Chat | Real-time WebSocket (STOMP/SockJS) |
| Complaints | Report users, services, orders |
| Admin | Dashboard, ban/unban users, manage complaints |
| i18n | English, Russian, Kazakh |
| Themes | Light / Dark mode |
