# InStaff — Temporary Jobs Platform

A full-stack Next.js 15 platform for temporary work: daily shifts, part-time gigs, and quick hiring.

## Tech Stack

- **Framework:** Next.js 15 App Router + TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access 15min + refresh 7d) via HttpOnly cookies
- **State:** Zustand (persisted) + TanStack Query
- **Styling:** Tailwind CSS 3 with custom design system
- **Forms:** React Hook Form + Zod validation
- **UI:** Custom component library (no external component lib needed)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local from the example
cp .env.example .env.local
# Fill in your values

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The middleware auto-redirects:
- `/` → `/auth/login` (unauthenticated) or `/dashboard` (authenticated)

## Environment Variables

```env
DB_URL_ONLINE=mongodb+srv://user:pass@cluster.mongodb.net/instaff
JWT_SECRET=your-32-char-secret-key-here
NEXT_PUBLIC_API=http://localhost:3000
API=http://localhost:3000
emailSender=your@gmail.com
emailSenderPassword=your-gmail-app-password
NODE_ENV=development
```

## Roles

| Role | Capabilities |
|------|-------------|
| `EMPLOYEE` | Browse jobs, apply, track applications, receive reviews |
| `COMPANY` | Post/edit/delete jobs, manage applicants, leave reviews |
| `ADMIN` | Full access to all resources |

## API Routes

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (sets cookies) |
| POST | `/api/auth/logout` | Clear cookies |
| POST | `/api/auth/refresh` | Rotate tokens |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/userUpdate` | Update profile |
| POST | `/api/auth/reset-password-request` | Send reset email |
| POST | `/api/auth/resetPassword` | Reset with token |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/getAllJobs` | Paginated list with filters |
| POST | `/api/jobs/createJob` | Create (COMPANY) |
| GET | `/api/jobs/jobDetails/[id]` | Single job |
| PATCH | `/api/jobs/editJob/[id]` | Update (COMPANY/ADMIN) |
| DELETE | `/api/jobs/deleteJob/[id]` | Remove (COMPANY/ADMIN) |
| POST | `/api/jobs/[id]/apply` | Apply (EMPLOYEE) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/employee/getApplications` | My applications |
| GET | `/api/applications/company/getApplications/[id]` | Job applicants |
| PATCH | `/api/applications/company/applicationStatus/[id]` | Accept/Reject |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/getReviews/[userId]` | User reviews |
| POST | `/api/reviews/createReviews` | Submit review (COMPANY) |
| DELETE | `/api/reviews/deleteReviews/[id]` | Delete (EMPLOYEE/ADMIN) |

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/auth/login` | Public | Sign in |
| `/auth/register` | Public | Create account |
| `/auth/reset-password-request` | Public | Forgot password |
| `/auth/resetPassword` | Token | Reset password |
| `/dashboard` | Auth | Role-based home |
| `/dashboard/jobs` | Auth | Browse/manage jobs |
| `/dashboard/jobs/create` | COMPANY | Post new job |
| `/dashboard/jobs/[id]` | Auth | Job detail + apply |
| `/dashboard/jobs/[id]/edit` | COMPANY/ADMIN | Edit job |
| `/dashboard/applications` | Auth | Applications |
| `/dashboard/profile` | Auth | Edit profile |
| `/dashboard/reviews` | Auth | My reviews |
| `/dashboard/settings` | Auth | Password + prefs |
| `/dashboard/users` | ADMIN | User management |

## Project Structure

```
instaff/
├── src/
│   ├── app/
│   │   ├── api/              # All backend route handlers
│   │   ├── auth/             # Auth pages (login, register, reset)
│   │   ├── dashboard/        # Protected dashboard pages
│   │   ├── globals.css       # Design system (utility classes)
│   │   └── layout.tsx        # Root layout + providers
│   ├── components/
│   │   ├── custom/auth/      # Auth form components
│   │   ├── jobs/             # JobCard, JobListRow
│   │   ├── layout/           # Sidebar, Topbar, DashboardLayout
│   │   ├── provider/         # QueryProvider, AuthGuard
│   │   └── ui/               # Avatar, Badge, Modal, Skeleton, etc.
│   ├── hooks/                # useJobs, useApplications, useReviews, etc.
│   ├── lib/
│   │   ├── db/               # MongoDB connection
│   │   ├── middleware/        # withAuth, withRole
│   │   ├── models/           # Mongoose schemas
│   │   ├── types/            # Global TypeScript types
│   │   └── utils/            # token, hashPassword, date, format, axios
│   ├── middleware.ts          # Route protection
│   ├── schemas/              # Zod validation schemas
│   └── store/                # Zustand auth store
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Design System

All utility classes are defined in `src/app/globals.css`:

```
Buttons:  .btn .btn-primary .btn-secondary .btn-ghost .btn-danger .btn-success
Sizes:    .btn-sm .btn-md .btn-lg
Inputs:   .input .label .form-group
Cards:    .card .card-sm
Badges:   .badge .badge-primary .badge-success .badge-warning .badge-danger
Layout:   .sidebar-link .stat-card .stat-icon .stat-value .stat-label
Helpers:  .gradient-primary .gradient-text .page-title .page-subtitle
Animate:  .animate-fade-in .animate-slide-up .animate-slide-in-left
```

## Deploy to Vercel

```bash
npm run build   # Check for errors first
vercel deploy   # Deploy
```

Set all environment variables in the Vercel project dashboard.
