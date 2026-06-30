<div align="center">

# 📅 Calendar App

**A fullstack calendar application with authentication, role-based access control, and an admin dashboard.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

[Live Demo](https://nextjs-de-calendar.vercel.app)

</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔐 | **Authentication** | Sign up, sign in, sign out with server-side sessions |
| 👥 | **Role-Based Access** | `user` and `admin` roles with protected routes |
| 🛡️ | **Admin Dashboard** | Manage users, update roles, delete accounts |
| 📅 | **Calendar View** | Interactive calendar with public holiday support |
| 🌙 | **Dark Mode** | System-aware theme with manual toggle |
| ⚡ | **End-to-End Type Safety** | tRPC + Zod — fully typed from database to UI |

---

## 🏗️ Fullstack Architecture

```
╔══════════════════════════════════════════════════════════╗
║                     CLIENT (Browser)                    ║
║                                                         ║
║  ┌─────────────┐  ┌──────────────────┐  ┌───────────┐  ║
║  │   React 19  │  │  TanStack Query  │  │tRPC Client│  ║
║  └─────────────┘  └──────────────────┘  └───────────┘  ║
║                                                         ║
║  Contexts:  AuthContext · ThemeContext · CalendarContext ║
╚══════════════════════╤══════════════════════════════════╝
                       │  HTTP (tRPC over fetch)
╔══════════════════════▼══════════════════════════════════╗
║                  SERVER (Next.js 16)                    ║
║                                                         ║
║  ┌────────────┐  ┌─────────────┐  ┌─────────────────┐  ║
║  │ App Router │  │  API Routes │  │   tRPC Router   │  ║
║  └────────────┘  └─────────────┘  └─────────────────┘  ║
║                                                         ║
║  iron-session (server-side sessions)                    ║
║  bcryptjs (password hashing)                            ║
╚══════════════════════╤══════════════════════════════════╝
                       │  Prisma ORM
╔══════════════════════▼══════════════════════════════════╗
║                  DATABASE (SQLite)                      ║
║                                                         ║
║         Users  ◄──────────────►  Sessions              ║
╚═════════════════════════════════════════════════════════╝
```

---

## 🔄 Request Flow

```
Browser                  Next.js Server              Database
   │                          │                          │
   │  tRPC mutation/query     │                          │
   │ ────────────────────────►│                          │
   │                          │  Validate session        │
   │                          │  (iron-session)          │
   │                          │                          │
   │                          │  Zod input validation    │
   │                          │                          │
   │                          │  Prisma query            │
   │                          │ ────────────────────────►│
   │                          │◄────────────────────────│
   │                          │                          │
   │◄────────────────────────│                          │
   │  Typed JSON response     │                          │
```

---

## 🗄️ Data Model

```
User
├── id          String   @id @default(cuid())
├── email       String   @unique
├── name        String
├── password    String   (bcrypt hash)
├── role        String   "user" | "admin"
├── createdAt   DateTime
└── sessions[]
        │
        ▼
    Session
    ├── id        String   @id
    ├── token     String   @unique
    ├── expiresAt DateTime
    └── userId    ──► User
```

---

## 🛠️ Tech Stack

<table>
  <tr>
    <th>Layer</th>
    <th>Technology</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>Framework</td>
    <td><img src="https://img.shields.io/badge/Next.js_16-black?logo=next.js" /> App Router</td>
    <td>SSR, routing, API handlers</td>
  </tr>
  <tr>
    <td>UI</td>
    <td><img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss&logoColor=white" /> shadcn/ui</td>
    <td>Components, styling</td>
  </tr>
  <tr>
    <td>API</td>
    <td><img src="https://img.shields.io/badge/tRPC_11-2596BE?logo=trpc&logoColor=white" /> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white" /></td>
    <td>Type-safe API, caching</td>
  </tr>
  <tr>
    <td>Auth</td>
    <td>iron-session · bcryptjs</td>
    <td>Sessions, password hashing</td>
  </tr>
  <tr>
    <td>ORM</td>
    <td><img src="https://img.shields.io/badge/Prisma_7-2D3748?logo=prisma&logoColor=white" /></td>
    <td>Database access layer</td>
  </tr>
  <tr>
    <td>Database</td>
    <td><img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white" /> via libsql</td>
    <td>Persistent storage</td>
  </tr>
  <tr>
    <td>Validation</td>
    <td><img src="https://img.shields.io/badge/Zod_4-3E67B1?logo=zod&logoColor=white" /></td>
    <td>Schema validation, input parsing</td>
  </tr>
  <tr>
    <td>Language</td>
    <td><img src="https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white" /></td>
    <td>Full type safety</td>
  </tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/calendar-app.git
cd calendar-app

# 2. Install dependencies
npm install

# 3. Set up the database
npm run db:push
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password` |
| User | `user@example.com` | `password` |

---

## 📁 Project Structure

```
calendar-app/
├── app/
│   ├── admin/              # 🛡️ Admin dashboard (role-protected)
│   ├── api/trpc/           # ⚡ tRPC HTTP handler
│   ├── auth/
│   │   ├── signin/         # 🔑 Sign in page
│   │   └── signup/         # 📝 Sign up page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/
│   ├── ui/                 # 🎨 shadcn/ui base components
│   ├── CalendarView.tsx    # 📅 Main calendar component
│   ├── HomeGate.tsx        # 🚪 Auth gate for home page
│   ├── Navbar.tsx          # 🔝 Top navigation
│   └── TRPCProvider.tsx    # tRPC + React Query provider
│
├── contexts/
│   ├── AuthContext.tsx     # 👤 User session state
│   ├── CalendarContext.tsx # 📅 Calendar state
│   └── ThemeContext.tsx    # 🌙 Dark/light mode
│
├── lib/
│   ├── trpc/
│   │   ├── router.ts       # 🔀 All tRPC procedures
│   │   └── client.ts       # tRPC client setup
│   ├── prisma.ts           # 🗄️ Prisma client singleton
│   ├── session.ts          # 🔐 iron-session helpers
│   └── holidays.ts         # 📅 Public holidays
│
└── prisma/
    ├── schema.prisma       # 📐 DB schema
    └── seed.ts             # 🌱 Seed script
```

---

## 📜 Database Scripts

```bash
npm run db:push      # Push schema changes to the database
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:seed      # Seed the database with initial data
npm run db:studio    # Open Prisma Studio (visual DB browser)
```

---

## 🔒 Auth Flow

```
Sign Up                          Sign In
   │                                │
   ▼                                ▼
Zod validation               Zod validation
   │                                │
   ▼                                ▼
bcrypt.hash(password)        bcrypt.compare(password, hash)
   │                                │
   ▼                                ▼
prisma.user.create()         prisma.session.create()
                                    │
                                    ▼
                             iron-session cookie
                                    │
                                    ▼
                             Protected routes unlocked
```

---

<div align="center">

Built with ❤️ using Next.js, tRPC, Prisma, and Tailwind CSS

</div>
