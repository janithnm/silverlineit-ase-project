# Course Content Upload System — Silverline IT

A full-stack course content management platform that allows authenticated users to upload, manage, and download course materials (PDFs, videos, and images). Built with a **Spring Boot** backend and a **React + Vite** frontend.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Spring Boot 4.0.6 |
| Language | Java 21 |
| Database | MySQL 8+ |
| ORM | Spring Data JPA / Hibernate |
| Migrations | Flyway |
| Auth | JWT (Access + Refresh tokens) |
| Email | Spring Mail + Thymeleaf templates |
| Storage | Local filesystem (S3-ready) |
| Build | Maven |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| UI Library | MUI (Material UI) v9 |
| State | TanStack Query v5 |
| HTTP Client | Axios |
| Routing | React Router v7 |

---

## Prerequisites

Make sure the following are installed before continuing:

- **Java 21** — [Download](https://adoptium.net/)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **MySQL 8+** — [Download](https://dev.mysql.com/downloads/)
- A **Gmail account** with an [App Password](https://myaccount.google.com/apppasswords) generated (for email verification)

---

## 1. Database Setup

Create the MySQL database. The Flyway migrations will automatically create all tables on first run.

```sql
CREATE DATABASE course_content_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> **Note:** The schema is managed entirely by Flyway. Do **not** create tables manually.

---

## 2. Backend Setup

### 2a. Configure environment variables

Navigate to the `backend/` directory and create/edit the `.env` file:

```bash
cd backend
```

Edit `.env` with your values:

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/course_content_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# JWT — can be any long base64-encoded string
JWT_SECRET=cHJvc2NhbmdUU2VjcmV0S2V5Rm9yTG9jYWxEZXZlbG9wbWVudE9ubHlEb05vdFVzZUluUHJvZHVjdGlvbjIwMjU=

# Mail — use Gmail with an App Password (not your account password)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_FROM_ADDRESS=your.email@gmail.com
MAIL_FROM_NAME=Silverline IT

# File Storage
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=./uploads

# Frontend URL (used in verification email links)
FRONTEND_URL=http://localhost:5173

# Server
SERVER_PORT=8080
```

> **Gmail App Password:** Go to your Google Account → Security → 2-Step Verification → App Passwords. Generate a password for "Mail" and use it as `MAIL_PASSWORD`.

### 2b. Run the backend

```bash
./mvnw spring-boot:run
```

Or on Windows:

```cmd
mvnw.cmd spring-boot:run
```

The backend starts at **http://localhost:8080**. Flyway will automatically run all migrations on startup.

---

## 3. Frontend Setup

### 3a. Configure environment variables

Navigate to the `frontend/` directory:

```bash
cd frontend
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 3b. Install dependencies

```bash
npm install
```

### 3c. Run the development server

```bash
npm run dev
```

The frontend starts at **http://localhost:5173**.

---

## 4. Application Walkthrough

1. Open **http://localhost:5173** in your browser
2. **Register** a new account — a verification email will be sent
3. Click the link in the email to **verify your account**
4. **Log in** with your credentials
5. Use the **Upload** page to add course materials (PDF, MP4, JPG, JPEG, PNG — up to 100MB)
6. View your uploaded files in the **Content Library** (`/library`)
7. **Download** or **View** any file from the library
8. The **Dashboard** (`/dashboard`) shows your upload count and recent files

> Each user only sees their own uploaded content.

---

## 5. API Overview

All API endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login, returns JWT tokens |
| `POST` | `/auth/verify-email` | ❌ | Verify email with token |
| `POST` | `/auth/refresh` | ❌ | Refresh access token |
| `POST` | `/content/upload` | ✅ | Upload a file |
| `GET` | `/content` | ✅ | List user's content (paginated) |
| `GET` | `/content/{id}` | ✅ | Get content metadata by ID |
| `GET` | `/content/{id}/download` | ✅ | Download a file |
| `DELETE` | `/content/{id}` | ✅ | Soft-delete a file |

---

## 6. Project Structure

```
silverlineit-ase/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/silverlineit/coursecontentsystem/
│   │   ├── auth/               # Registration, login, JWT, email verification
│   │   ├── common/             # Security config, exception handling, storage
│   │   └── content/            # Upload, list, download, delete logic
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL migrations (V1–V5)
│   │   └── templates/email/    # Thymeleaf email templates
│   └── .env                    # Backend environment variables
│
└── frontend/                   # React + Vite application
    ├── src/
    │   ├── api/                # Axios instance + API call definitions
    │   ├── hooks/              # TanStack Query hooks
    │   ├── pages/              # Route-level page components
    │   ├── services/           # Business logic helpers
    │   ├── store/              # Auth session store (localStorage)
    │   └── types/              # TypeScript interfaces
    └── .env                    # Frontend environment variables
```

---

## 7. Common Issues

### `SSLException: Unsupported or unrecognized SSL message`
Ensure `MAIL_PORT` is set to `587` (STARTTLS), **not** `465` (SSL). Port 465 requires a different TLS configuration.

### `Flyway migration failed`
The database must exist before starting the backend. Run `CREATE DATABASE course_content_db;` in MySQL first.

### Frontend shows `Request failed with status code 4xx`
Check that the backend is running on port `8080` and `VITE_API_BASE_URL` in `frontend/.env` is correct.

### Files not uploading
Confirm the `./uploads` directory is writable, or set `LOCAL_UPLOAD_DIR` to an absolute path in `backend/.env`.
