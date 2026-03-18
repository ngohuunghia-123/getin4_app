# get-in4 (Vue 3 + Express + Prisma + Postgres)

Monorepo gồm:
- `frontend/`: Vue 3 + Vite + TypeScript + TailwindCSS
- `backend/`: Node.js (Express) + TypeScript + Prisma + PostgreSQL

## 1) Prerequisites
- Node.js 18+ (khuyến nghị 20+)
- PostgreSQL 14+

## 2) Setup database
Tạo database:

```sql
CREATE DATABASE get_in4;
```

## 3) Setup backend

```bash
cd get_in4_app\backend
copy .env.example .env
```

Sửa `DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET` trong `backend/.env`.

Chạy migrate + seed:

```bash
npm run prisma:migrate
npx prisma db seed
```

Run backend:

```bash
npm run dev
```

Backend mặc định chạy `http://localhost:4000`.

## 4) Setup frontend

```bash
cd ..\frontend
copy .env.example .env
npm run dev
```

Frontend mặc định chạy `http://localhost:5173`.

## 5) Run cả 2 cùng lúc (root)

```bash
cd ..\
npm run dev
```

## 6) API quick test
- Public:
  - `GET /questions`
  - `POST /answers`
- Admin:
  - `POST /admin/login`
  - `GET /admin/questions`
  - `POST /admin/questions`
  - `PUT /admin/questions/:id`
  - `DELETE /admin/questions/:id`
  - `GET /admin/answers`

