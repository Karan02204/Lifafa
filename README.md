# 📧 Email Job Scheduler

A production-inspired email scheduling platform that enables users to authenticate with Google, compose rich-text emails, upload recipient lists via CSV, and schedule email campaigns for future delivery.

Built with **React 19**, **Express 5**, **TypeScript**, **BullMQ**, **Redis**, and **MySQL** — providing reliable delayed email scheduling with persistent job storage, configurable concurrency, rate limiting, and delivery delays.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/BullMQ-E63946?style=for-the-badge" alt="BullMQ" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Features

### Authentication

- 🔐 Google OAuth 2.0 Login
- 🎫 JWT-based session management
- 🛡️ Protected routes with middleware guards
- 👤 User profile with Google avatar
- 🚪 Secure logout support

### Email Scheduling

- ✍️ Compose rich-text emails with a full-featured editor (bold, italic, underline, lists, alignment)
- 📎 Upload recipient lists through CSV files (parsed with PapaParse)
- ⏰ Schedule emails for future delivery with a date-time picker
- ⏱️ Configurable minimum delay between individual emails
- 📊 Configurable hourly sending limit per user
- 👥 Multiple sender account support
- 📈 Per-recipient email status tracking (`PENDING` → `PROCESSING` → `SENT` / `FAILED`)

### Dashboard

- 📋 **Scheduled Emails** — view all pending campaigns
- ✅ **Sent Emails** — view completed and partially successful campaigns
- 🔍 **Email Details** — drill into any campaign to see per-recipient delivery status
- ⏳ Loading spinner states
- 📭 Empty states when no data exists
- 📐 Responsive sidebar-based layout

### Backend

- 🔄 BullMQ delayed jobs with millisecond-precision scheduling
- 💾 Redis-backed persistent queue — jobs survive server restarts
- ⚙️ Configurable worker concurrency via environment variable
- 🚦 Two-tier rate limiting: per-email delay + hourly cap (both stored in Redis)
- ✅ Idempotent email processing — only `PENDING` jobs are executed
- 🔁 Automatic rescheduling when rate limits are hit
- 📧 SMTP email delivery via Nodemailer (Ethereal Email for testing)
- 🔒 Request validation with Zod schemas
- 🪖 Security headers via Helmet
- 📝 HTTP request logging via Morgan

---

# Tech Stack

## Frontend

| Technology | Purpose |
|:--|:--|
| [React 19](https://react.dev/) | UI library |
| [Vite](https://vite.dev/) | Build tool & dev server |
| TypeScript | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [TanStack React Query](https://tanstack.com/query) | Server state management & data fetching |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling & validation |
| [Tiptap](https://tiptap.dev/) | Rich-text email editor |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible UI component primitives |
| [Axios](https://axios-http.com/) | HTTP client |
| [PapaParse](https://www.papaparse.com/) | CSV parsing |
| [Sonner](https://sonner.emilkowal.dev/) | Toast notifications |
| Phosphor Icons + Lucide React | Iconography |

## Backend

| Technology | Purpose |
|:--|:--|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express 5](https://expressjs.com/) | HTTP framework |
| TypeScript | Type safety |
| [Prisma ORM](https://www.prisma.io/) | Database ORM (with MariaDB adapter) |
| MySQL 8.4 | Relational database |
| [Redis 7](https://redis.io/) | Job queue backing store & rate limiter state |
| [BullMQ](https://docs.bullmq.io/) | Delayed job queue & worker framework |
| [Passport.js](https://www.passportjs.org/) | Google OAuth 2.0 strategy |
| [JWT](https://jwt.io/) | Stateless authentication tokens |
| [Nodemailer](https://nodemailer.com/) | SMTP email delivery |
| [Zod](https://zod.dev/) | Request validation |
| [Helmet](https://helmetjs.github.io/) | Security headers |
| [Morgan](https://github.com/expressjs/morgan) | HTTP logging |

## Infrastructure

| Technology | Purpose |
|:--|:--|
| Docker Compose | Orchestrate MySQL & Redis containers |
| MySQL 8.4 (container) | Persistent data store |
| Redis 7 Alpine (container) | Queue storage & rate limiter state |

---

# Architecture Overview

The application follows a client-server architecture where the frontend handles user interaction, while the backend manages authentication, scheduling, persistence, and email delivery. The BullMQ worker runs as a **separate process** alongside the Express server.

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│              (Vite · React Query · React Router)                │
└──────────────────────────┬──────────────────────────────────────┘
                           │  REST API (Axios)
                           │  + JWT Bearer Token
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                       Express Backend                          │
│       (Passport · Zod · Prisma · BullMQ · Nodemailer)          │
│                                                                │
│   ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│   │   MySQL DB   │  │  BullMQ Queue    │  │      Redis       │ │
│   │  (Prisma)    │  │  (Delayed Jobs)  │  │  (Jobs + Rate    │ │
│   │              │  │                  │  │    Limiter)      │ │
│   └──────┬───────┘  └────────┬─────────┘  └────────┬─────────┘ │
└──────────┼───────────────────┼─────────────────────┼───────────┘
           │                   │                     │
           └───────────┬───────┴─────────────────────┘
                       ▼
            ┌─────────────────────┐
            │    BullMQ Worker    │
            │  (Separate Process) │
            └──────────┬──────────┘
                       │  SMTP
                       ▼
            ┌─────────────────────┐
            │   Ethereal Email    │
            │   (Test Mailbox)    │
            └─────────────────────┘
```

### Frontend

The frontend is built with **React 19** and **TypeScript**, bundled with **Vite**, and styled using **Tailwind CSS v4**.

It provides:

- Google OAuth login flow
- Sidebar-based dashboard with scheduled / sent email tabs
- Rich-text email composer powered by **Tiptap** (bold, italic, underline, lists, text alignment)
- CSV recipient upload with client-side parsing via **PapaParse**
- Date-time scheduling with **react-datepicker**
- Per-campaign email details page with recipient-level status
- Real-time data fetching using **TanStack React Query**
- Toast notifications via **Sonner**

### Backend

The backend is built using **Express 5** and **TypeScript**.

Its responsibilities include:

- User authentication via Google OAuth 2.0 + JWT token issuance
- Email campaign CRUD operations (create, read, update, delete)
- BullMQ job scheduling with computed delays
- Worker-based email delivery through SMTP
- Per-recipient status tracking with granular error reporting
- Two-tier rate limiting (minimum inter-email delay + hourly cap)
- Automatic rescheduling when rate limits are exceeded
- Input validation with Zod schemas

### Database

MySQL is used as the primary persistent data store, accessed through **Prisma ORM**.

It stores:

- **Users** — Google-authenticated user profiles
- **Senders** — SMTP sender accounts (email + credentials) linked to users
- **Emails** — Campaign metadata (subject, body, scheduled time, status, BullMQ job ID)
- **EmailRecipients** — Individual recipient records with delivery status, attempt count, and error messages

### Queue

BullMQ backed by Redis is responsible for scheduling email jobs.

Each scheduled email campaign is added to the queue with a calculated delay (`scheduledAt - Date.now()`), ensuring reliable execution without relying on cron jobs. Jobs are keyed by email ID for traceability.

### Worker

A dedicated BullMQ worker runs as a **separate Node.js process** (`npm run worker`).

Each worker:

- Retrieves the campaign and its recipients from MySQL
- Validates the email is still in `PENDING` status (idempotency guard)
- Acquires a rate-limit permit from Redis before sending
- Reschedules the job automatically if the rate limit is exceeded
- Sends emails to all recipients through SMTP sequentially
- Updates each recipient's delivery status individually (`SENT` or `FAILED`)
- Sets the campaign's final status to `COMPLETED`, `PARTIAL_SUCCESS`, or `FAILED`

### SMTP

Emails are sent using **Nodemailer** with configurable SMTP settings. The default development setup uses **Ethereal Email**, allowing safe testing without sending real emails. Each sender account stores its own SMTP credentials, enabling multi-sender support.

---

# Project Structure

```
email-job-scheduler/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Database migration history
│   │   └── schema.prisma        # Data models (User, Email, EmailRecipient, Sender)
│   ├── src/
│   │   ├── config/              # Environment vars, Redis, Prisma, Passport setup
│   │   ├── controllers/         # Route handlers (auth, email, sender, user, health)
│   │   ├── middlewares/         # Auth guards, error handling
│   │   ├── queues/              # BullMQ queue definition & scheduling logic
│   │   ├── routes/              # Express route definitions
│   │   ├── services/            # Business logic (email, mail, rate-limiter, sender)
│   │   ├── validators/          # Zod request schemas
│   │   ├── workers/             # BullMQ worker processors
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── generated/           # Prisma-generated client
│   │   ├── app.ts               # Express app setup & middleware
│   │   ├── server.ts            # Server entry point
│   │   └── worker.ts            # Worker entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios API client functions
│   │   ├── assets/              # Static assets
│   │   ├── components/
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── compose/         # Email composer (form, editor, recipients, scheduler)
│   │   │   ├── dashboard/       # Dashboard (sidebar, email list, status badges)
│   │   │   ├── email/           # Email detail components
│   │   │   ├── layout/          # Layout wrappers
│   │   │   └── ui/              # shadcn/ui primitives
│   │   ├── hooks/               # Custom React hooks (useEmails, useSenders, etc.)
│   │   ├── layouts/             # Page layout components
│   │   ├── lib/                 # Utility libraries (cn helper, etc.)
│   │   ├── pages/               # Page components (Login, Dashboard, EmailDetails)
│   │   ├── providers/           # Context providers (AuthProvider)
│   │   ├── routes/              # Route guards (ProtectedRoute)
│   │   ├── services/            # Service layer
│   │   ├── types/               # TypeScript type definitions
│   │   ├── validators/          # Client-side Zod schemas
│   │   ├── App.tsx              # Root component with routing
│   │   └── main.tsx             # Application entry point
│   └── package.json
│
├── docker-compose.yml           # MySQL 8.4 & Redis 7 Alpine containers
└── README.md
```

---

# Prerequisites

Before running the project, ensure the following are installed:

| Requirement | Version |
|:--|:--|
| **Node.js** | v18 or later |
| **npm** | Included with Node.js |
| **Docker Desktop** | Latest |
| **Git** | Latest |

The project uses Docker Compose to run **MySQL 8.4** and **Redis 7 Alpine** locally.

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/email-job-scheduler.git
cd email-job-scheduler
```

---

## 2. Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Generate the Prisma client.

```bash
npx prisma generate
```

Apply database migrations.

```bash
npx prisma migrate dev
```

---

## 3. Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
npm install
```

---

## 4. Start MySQL & Redis

From the project root, start the required services using Docker Compose.

```bash
docker compose up -d
```

Verify that both containers are running.

```bash
docker ps
```

You should see containers for:

| Container | Image | Port |
|:--|:--|:--|
| `email_scheduler_mysql` | `mysql:8.4` | `3306` |
| `email_scheduler_redis` | `redis:7-alpine` | `6379` |

---

# Environment Variables

## Backend

Create a `.env` file inside the `backend/` directory with the following variables:

```env
# ── Server ──────────────────────────────────
PORT=3000
FRONTEND_URL=http://localhost:5173

# ── Database ────────────────────────────────
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=email_scheduler

# ── Redis ───────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379

# ── Authentication ──────────────────────────
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ── SMTP (Ethereal Email) ──────────────────
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_FROM=your_ethereal_email

# ── Worker Configuration ───────────────────
WORKER_CONCURRENCY=3
MAX_EMAILS_PER_HOUR=100
MIN_DELAY_BETWEEN_EMAILS=1000
```

> **Note:** Replace placeholder values with your own credentials. See [Setting up Ethereal Email](#setting-up-ethereal-email) for SMTP credentials.

---

## Frontend

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

# Setting up Ethereal Email

The project uses **Ethereal Email** for testing SMTP delivery — no real emails are sent.

1. Visit [https://ethereal.email](https://ethereal.email/)
2. Click **"Create Ethereal Account"** to generate a temporary mailbox
3. Copy the generated SMTP credentials (host, port, username, password)
4. Add them to the backend `.env` file:

```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
```

5. When adding a **Sender** in the app, use the Ethereal email and password as the sender credentials.
6. run npx prisma studio inside the backend folder and add a new row with the sender details

All scheduled emails will be delivered to Ethereal's virtual mailbox instead of real inboxes, allowing safe testing without sending actual emails. You can view delivered emails at [https://ethereal.email/messages](https://ethereal.email/messages).

---

# Running the Application

You need **three terminal sessions** running simultaneously.

## Start Docker Services

```bash
docker compose up -d
```

---

## Start the Backend

```bash
cd backend
npm run dev
```

---

## Start the BullMQ Worker

Open a **second terminal**.

```bash
cd backend
npm run worker
```

---

## Start the Frontend

Open a **third terminal**.

```bash
cd frontend
npm run dev
```

---

Once all three processes are running, the application will be available at:

| Service | URL |
|:--|:--|
| **Frontend** | [http://localhost:5173](http://localhost:5173) |
| **Backend API** | [http://localhost:3000](http://localhost:3000) |

---

# How Scheduling Works

The scheduler is built using **BullMQ** with **Redis** as the job store.

When a user schedules an email campaign, the following sequence occurs:

```
User composes email & picks schedule time
            │
            ▼
   Frontend sends POST /api/emails
            │
            ▼
   Backend validates with Zod schema
            │
            ▼
   Campaign + Recipients saved to MySQL (atomic transaction)
            │
            ▼
   BullMQ delayed job created: delay = scheduledAt − Date.now()
            │
            ▼
   Job metadata stored in Redis
            │
            ▼
   ⏳ Waits until scheduled time...
            │
            ▼
   Worker picks up the job automatically
            │
            ▼
   Rate-limit check (delay + hourly cap) via Redis
            │
    ┌───────┴──────────┐
    │                  │
 ✅ Allowed         ❌ Rate limited
    │                  │
 Send emails        Reschedule job
 sequentially       with retryAfter delay
    │
    ▼
 Update per-recipient status in MySQL
    │
    ▼
 Set campaign final status: COMPLETED / PARTIAL_SUCCESS / FAILED
```

---

# Persistence After Restart

Scheduled emails remain reliable even if the backend server is stopped or restarted.

This is achieved through BullMQ's persistent Redis-backed queue:

| Component | Behavior on Restart |
|:--|:--|
| **MySQL** | Campaign metadata persists (Docker volume) |
| **Redis** | Scheduled jobs persist in memory |
| **Express server** | Restart does not affect queued jobs |
| **BullMQ worker** | Reconnects to Redis and resumes processing pending jobs |

This ensures that future email campaigns are delivered even after unexpected application restarts, as long as the Redis container remains running.

---

# Worker Concurrency

BullMQ workers support configurable concurrency, allowing multiple email jobs to be processed simultaneously.

The concurrency value is set through the `WORKER_CONCURRENCY` environment variable:

```env
WORKER_CONCURRENCY=3
```

| Value | Behavior |
|:--|:--|
| `1` | Jobs processed one at a time (sequential) |
| `3` | Up to 3 jobs processed in parallel (default) |
| `10+` | Higher throughput, suitable for production workloads |

Increasing this value allows multiple campaign jobs to be processed in parallel, improving throughput while maintaining reliable queue processing.

---

# Delay Between Emails

For campaigns containing multiple recipients, the worker introduces a configurable delay between sending consecutive emails.

This prevents sending a large volume of emails in rapid succession and provides finer control over delivery behavior.

```env
MIN_DELAY_BETWEEN_EMAILS=1000    # milliseconds
```

The delay is enforced at the Redis level using a per-user `SET ... NX PX` lock. If a subsequent email is attempted before the lock expires, the job is automatically rescheduled with the remaining TTL as the retry delay.

---

# Hourly Rate Limiting

The scheduler supports configurable hourly rate limiting to prevent excessive email throughput.

```env
MAX_EMAILS_PER_HOUR=100
```

Before sending each email, the worker tracks the number of emails sent during the current one-hour window using a Redis counter keyed by user ID and hour:

| Scenario | Behavior |
|:--|:--|
| Under the limit | Email is sent immediately |
| Limit reached | Job is rescheduled to resume after the current hour window resets |
| Redis counter expiry | Automatically resets at the start of each new hour |

No recipient information is lost during rate-limit pauses — the job is simply rescheduled with a calculated `retryAfter` delay.

---

# Authentication Flow

Authentication is implemented using **Google OAuth 2.0** and **JWT**.

```
┌──────────┐          ┌──────────────┐         ┌──────────┐
│  Browser │          │   Backend    │         │  Google  │
└────┬─────┘          └──────┬───────┘         └────┬─────┘
     │  1. Click "Sign in    │                      │
     │     with Google"      │                      │
     │──────────────────────>│                      │
     │                       │  2. Redirect to      │
     │                       │     Google OAuth     │
     │                       │─────────────────────>│
     │                       │                      │
     │                       │  3. User grants      │
     │                       │     consent          │
     │                       │<─────────────────────│
     │                       │                      │
     │  4. Passport verifies │                      │
     │     & upserts user    │                      │
     │                       │                      │
     │  5. JWT token issued  │                      │
     │<──────────────────────│                      │
     │                       │                      │
     │  6. Subsequent API    │                      │
     │     requests include  │                      │
     │     Authorization:    │                      │
     │     Bearer <token>    │                      │
     │──────────────────────>│                      │
     │                       │                      │
     │  7. Middleware        │                      │
     │     validates JWT     │                      │
     │<──────────────────────│                      │
```

1. The user clicks **"Sign in with Google"** on the login page
2. The browser is redirected to Google's OAuth consent screen
3. After the user grants consent, Google redirects back to the backend callback URL
4. Passport.js verifies the Google profile and upserts the user in MySQL
5. A JWT is generated and returned to the frontend via redirect
6. The frontend stores the token and includes it as a `Bearer` token in subsequent API requests
7. Protected backend routes validate the JWT through auth middleware before processing requests

---

# Features Implemented

## Backend

- ✅ Google OAuth Authentication (Passport.js)
- ✅ JWT Authentication (stateless tokens)
- ✅ BullMQ Scheduler (delayed jobs with computed delays)
- ✅ Redis-backed Queue (persistent job storage)
- ✅ Persistent Scheduling (survives server restarts)
- ✅ MySQL Database (Prisma ORM with migrations)
- ✅ Worker Concurrency (configurable via env)
- ✅ Hourly Rate Limiting (Redis-based sliding window)
- ✅ Delay Between Emails (Redis-based per-user lock)
- ✅ SMTP Email Delivery (Nodemailer + Ethereal)
- ✅ Email Status Tracking (per-recipient granularity)
- ✅ Input Validation (Zod schemas)
- ✅ Security Headers (Helmet)
- ✅ Error Handling Middleware
- ✅ CRUD Operations (create, read, update, delete campaigns)
- ✅ Automatic Job Rescheduling on rate limit

## Frontend

- ✅ Google Login (OAuth redirect flow)
- ✅ Dashboard (sidebar navigation with counts)
- ✅ Compose Email (modal-based composer)
- ✅ Rich Text Editor (Tiptap with toolbar)
- ✅ CSV Upload (PapaParse parsing)
- ✅ Manual Recipient Entry
- ✅ Sender Selection (dropdown)
- ✅ Date-Time Scheduling (react-datepicker)
- ✅ Scheduled Emails Tab
- ✅ Sent Emails Tab
- ✅ Email Details Page (per-recipient status)
- ✅ Status Badges (color-coded)
- ✅ Loading States (spinners)
- ✅ Empty States
- ✅ Toast Notifications (Sonner)
- ✅ Protected Routes (auth guard)
- ✅ Responsive UI

---

# Trade-offs & Assumptions

## Assumptions

- **Google OAuth** is used as the sole authentication mechanism. Users must sign in with a valid Google account to access the application.
- **Ethereal Email** is used for SMTP testing. Emails are delivered to virtual Ethereal inboxes rather than real recipients.
- **Redis must be running** before starting the BullMQ worker. The worker will fail to connect otherwise.
- **The BullMQ worker runs as a separate process** alongside the Express server — it is not embedded within the API server.
- **Sender credentials are stored per-user** in MySQL. Each sender's email and password are used directly for SMTP authentication.

## Trade-offs

| Decision | Rationale |
|:--|:--|
| **Ethereal Email** instead of a production provider | Safer for development; switching to SendGrid, SES, or Gmail SMTP requires only config changes |
| **API polling** instead of WebSockets | Simpler implementation; TanStack React Query handles caching and refetching efficiently |
| **Sequential email sending** per campaign | Ensures rate-limit compliance and predictable delivery order; parallelism is achieved via worker concurrency across campaigns |
| **Basic CSV validation** | Assumes the uploaded file contains an `email` column; advanced validation can be added for production |
| **BullMQ default retry** | Failed email retries are managed by BullMQ's built-in mechanism; advanced strategies (exponential backoff, dead-letter queues) can be added for production |

---

# Demo

A short demonstration video showcasing the application is included with the submission.

The demo covers:

- 🔐 Google OAuth login
- ✉️ Creating a scheduled email campaign
- 📎 Uploading recipients using a CSV file
- 📋 Viewing Scheduled and Sent email dashboards
- 🔍 Email Details page with per-recipient status
- 🔄 Restarting the backend while preserving scheduled jobs
- ⚙️ Demonstration of configurable concurrency, delay between emails, and hourly rate limiting

---

# License

This project was developed as part of a technical assessment and is intended for educational and evaluation purposes.
