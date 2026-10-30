# 🔐 Registration & Login Service (E-Commerce)

A production-style authentication system for an e-commerce application, built with a **Spring Boot 3** REST API and a **React 19 (Vite + Tailwind CSS)** frontend.

Users can register, log in, log out, recover forgotten passwords via OTP, reset their password, and change their password. Sessions are tracked server-side (stored JWT) so logout and password-reset invalidate existing tokens, and protected endpoints reject logged-out users.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **User Registration** | Full name, email, mobile, password + confirm. Validates all inputs, enforces unique email & mobile, hashes with BCrypt. |
| **User Login** | By **email or mobile** + password. Issues a signed JWT access token and creates a server-side session. |
| **Logout** | Deletes the active server session so the JWT can no longer be used. |
| **Forgot Password** | Accepts email **or** mobile, generates a 6-digit OTP (10 min validity), emailed via Spring Mail + Gmail SMTP. |
| **Verify OTP** | Validates OTP (checks expiry, incorrect attempts) before allowing a reset. |
| **Reset Password** | Validates the new password, re-hashes it, and invalidates **all** existing sessions. |
| **Change Password** | Logged-in users verify the current password, set a new one; other sessions are revoked. |
| **Security** | BCrypt password hashing, JWT (HS384) auth, session persistence, input validation (Bean Validation + frontend), CORS, stateless API, unified exception handling. |

---

## 🧰 Tech Stack

**Backend** — Java 21 · Spring Boot 3.5.x · Spring Security · Spring Data JPA / Hibernate · JWT (jjwt) · Bean Validation · BCrypt · Spring Mail · Lombok · Maven

**Database** — MySQL 8+ (schema in `backend/src/main/resources/db/schema.sql`)

**Frontend** — React 19 · Vite 8 · JavaScript/JSX · Tailwind CSS 4 · Axios · React Router 7 · Context API · React Hook Form · React Hot Toast

---

## 📁 Project Structure

```
LoginApp/
├── backend/                         # Spring Boot REST API
│   ├── src/main/java/com/ecommerce/auth/
│   │   ├── config/                  # Security config, CORS, BCrypt, AuthenticationManager
│   │   ├── controller/              # AuthController, UserController
│   │   ├── dto/
│   │   │   ├── request/             # Register/Login/Forgot/Verify/Reset/Change requests
│   │   │   └── response/            # ApiResponse, AuthResponse, UserResponse
│   │   ├── entity/                  # User, Session, Otp
│   │   ├── exception/               # ApiException + global handler
│   │   ├── repository/              # Spring Data JPA repositories
│   │   ├── security/                # JwtService, JwtAuthenticationFilter
│   │   └── service/                 # Auth, Session, Otp, Mail services + cleanup task
│   ├── src/main/resources/
│   │   ├── application.yml          # Default (MySQL) configuration
│   │   ├── application-local.yml    # H2 in-memory profile for zero-setup dev
│   │   └── db/schema.sql            # MySQL schema (also auto-created by JPA/Hibernate)
│   └── pom.xml
├── frontend/                        # React SPA (Vite)
│   ├── src/
│   │   ├── api/                     # Axios client + auth endpoint wrappers
│   │   ├── components/              # AuthLayout, ProtectedRoute, PasswordInput
│   │   ├── context/                 # AuthContext (session state)
│   │   ├── pages/                   # Login, Register, Forgot/Verify/Reset, Change Password, Dashboard
│   │   └── utils/validation.js      # Shared form validation rules
│   └── vite.config.js
└── README.md
```

---

## 🗄️ Database Schema (MySQL)

Tables: **users**, **sessions**, **otps**

```sql
-- users
id          BIGINT AUTO_INCREMENT PRIMARY KEY,
full_name   VARCHAR(100) NOT NULL,
email       VARCHAR(150) NOT NULL UNIQUE,
mobile      VARCHAR(10)  NOT NULL UNIQUE,
password    VARCHAR(100) NOT NULL,        -- BCrypt hash
created_at  DATETIME NOT NULL,
updated_at  DATETIME NOT NULL

-- sessions  (each login creates a row; logout/password-reset delete rows)
id          BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
token       VARCHAR(512) NOT NULL UNIQUE,
login_time  DATETIME NOT NULL,
expiry_time DATETIME NOT NULL

-- otps
id          BIGINT AUTO_INCREMENT PRIMARY KEY,
identifier  VARCHAR(150) NOT NULL,
code        VARCHAR(6)   NOT NULL,
expiry_time DATETIME     NOT NULL,
verified    BOOLEAN NOT NULL DEFAULT FALSE,
created_at  DATETIME NOT NULL
```

Run `backend/src/main/resources/db/schema.sql` in MySQL Workbench, **or** simply let JPA create the tables automatically (`spring.jpa.hibernate.ddl-auto=update`, the default).

---

## 🚀 Getting Started

### 1. Backend (Spring Boot)

Prerequisites: **JDK 21** and **MySQL** running on `localhost:3306`.

> Use `./mvnw.cmd` (Windows) / `./mvnw` (macOS/Linux) — the Maven wrapper is included, so a global Maven install is **not** required.

```bash
cd backend

# Option A — local development without a database (in-memory H2, OTP shown in response)
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local        # http://localhost:8081

# Option B — MySQL (default profile)
set MYSQL_PASSWORD=your-mysql-password          # or edit application.yml
.\mvnw.cmd spring-boot:run                      # http://localhost:8081
```

Optionally build & run the jar:

```bash
.\mvnw.cmd clean package -DskipTests
java -jar target/auth-service-1.0.0.jar --spring.profiles.active=local
```

The app runs on **port 8081** (8080 is often occupied; easily changed in `application.yml`).

### 2. Enable OTP emails (Gmail SMTP)

Edit `application.yml` or set environment variables:

```dotenv
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password     # Google account -> App passwords
JWT_SECRET=<base64 secret, >= 32 bytes>
```

📧 To test OTP **without** email, run the `local` profile — the OTP is returned in the response so you can complete the full reset flow.

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Frontend calls the API at `http://localhost:8081/api` by default. Override with a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8081/api
```

---

## 🔗 REST API

Base URL: `http://localhost:8081/api` · JSON responses use `{ success, message, data }`; validation errors also include a `fieldErrors` map keyed by request field.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | Register a new user (fullName, email, mobile, password, confirmPassword) |
| POST | `/auth/login` | — | Login with `identifier` (email **or** mobile) + `password` → `{ token, expiresAt, user }` |
| POST | `/auth/logout` | 🔒 | Revoke the current session (uses the `Authorization` header) |
| POST | `/auth/forgot-password` | — | Send OTP to registered email (`identifier`: email or mobile) |
| POST | `/auth/verify-otp` | — | Verify `otp` for a given `identifier` |
| POST | `/auth/reset-password` | — | Set a new password (`identifier`, `otp`, `newPassword`) |
| PUT | `/auth/change-password` | 🔒 | Verify current password and set a new one |
| GET | `/user/me` | 🔒 | Current authenticated user |
| GET | `/user/dashboard` | 🔒 | Protected demo endpoint |

Protected endpoints expect: `Authorization: Bearer <token>`

### Sample — Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "Passw0rd@123",
  "confirmPassword": "Passw0rd@123"
}
```

Response `200`:
```json
{ "success": true, "message": "Registration successful. Please log in.", "data": { "id": 1, "fullName": "John Doe", "email": "john@example.com", "mobile": "9876543210", "createdAt": "2026-01-01T10:00:00" } }
```

### Validation rules (mirrored on backend and frontend)

- **Full name**: required, 3–100 chars
- **Email**: required, valid format, unique
- **Mobile**: required, exactly 10 digits, unique
- **Password**: min 8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 special char
- **Confirm password**: must match password

### Error handling

| Code | Meaning |
| --- | --- |
| 400 | Validation failed / wrong input (e.g., OTP wrong, passwords don't match) |
| 401 | Bad credentials or expired/revoked session |
| 409 | Email or mobile already registered |
| 404 | Account not found |
| 500 | Unexpected server error |

Security detail: login never reveals whether the email or the password was wrong — it always returns `Invalid email/mobile or password`.

---

## 🔐 Security Practices Implemented

- Passwords stored **only** as **BCrypt** hashes — never plain text.
- JWT tokens signed with a 384-bit HMAC key; contain `jti` for uniqueness.
- Every valid token must reference a **live server-side session**; logout/reset/change-password delete the session rows.
- Stateless Spring Security setup (no HTTP sessions, no CSRF, JWT filter injected before the auth filter).
- Bean Validation on every request body; a global `@RestControllerAdvice` maps exceptions to clean JSON.
- CORS restricted to the Vite dev origins (`localhost:5173/5174`, `127.0.0.1:5173`).
- OTPs expire after 10 minutes, are single-use, and are bound to an account identifier.

---

## 🧪 Quick API smoke test (Postman / curl)

```bash
# 1. Register
curl -X POST http://localhost:8081/api/auth/register -H "Content-Type: application/json" \
  -d "{\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"mobile\":\"9876543210\",\"password\":\"Passw0rd@123\",\"confirmPassword\":\"Passw0rd@123\"}"

# 2. Login
curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" \
  -d "{\"identifier\":\"john@example.com\",\"password\":\"Passw0rd@123\"}"

# 3. Call a protected endpoint
curl http://localhost:8081/api/user/me -H "Authorization: Bearer <token>"

# 4. Logout
curl -X POST http://localhost:8081/api/auth/logout -H "Authorization: Bearer <token>"

# 5. Forgot / verify / reset
curl -X POST http://localhost:8081/api/auth/forgot-password -H "Content-Type: application/json" -d "{\"identifier\":\"john@example.com\"}"
# (local profile) OTP is echoed in the response -> then:
curl -X POST http://localhost:8081/api/auth/verify-otp -H "Content-Type: application/json" -d "{\"identifier\":\"john@example.com\",\"otp\":\"123456\"}"
curl -X POST http://localhost:8081/api/auth/reset-password -H "Content-Type: application/json" -d "{\"identifier\":\"john@example.com\",\"otp\":\"123456\",\"newPassword\":\"NewPass@456\"}"
```