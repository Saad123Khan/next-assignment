Here is a **short and clean README** for your project:

---

# 🚀 Next.js Authentication System

This project uses **Next.js (App Router)** with **NextAuth.js** for secure authentication and role-based access.

---

## 🔑 Features

* Google Login
* GitHub Login
* Role-Based Access (Admin/User)
* Protected Routes
* JWT Sessions
* NextAuth Backend (Route Handlers)

---

## 📂 Structure

```
/app/api/auth/[...nextauth]/route.js   → NextAuth backend
/app/dashboard                         → User protected pages
/app/admin                             → Admin-only pages
/lib/auth.js                           → NextAuth config
middleware.js                          → Route protection
```

---

## 🔐 Auth Flow

1. User logs in via Google or GitHub
2. NextAuth returns user profile
3. User is saved/fetched from DB
4. Role is added to JWT & session
5. Admin/User pages are protected using middleware

---

## ⚙️ Setup

### Install:

```
npm install
```

### Environment Variables (`.env.local`):

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx

GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx
```

### Run:

npm run dev

