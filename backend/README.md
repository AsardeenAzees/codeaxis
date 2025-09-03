# Backend (CodeAxis)

## Requirements
- Node.js 20.x LTS
- MongoDB Atlas connection string

## Setup (Windows 11 + VS Code)
1. Copy `.env.example` to `.env` and fill values
2. Install deps: `npm ci` (or `npm i`)
3. Seed data: `npm run seed`
4. Start dev server: `npm run dev`

## Environment variables
- `PORT` (default 5000)
- `MONGODB_URI`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `APP_URL` (frontend URL for reset links)
- `ORIGIN` (comma-separated CORS origins)
- Optional: `CLOUDINARY_URL` or `CLOUDINARY_*`; `EMAIL_*`

## Scripts
- `npm run dev`: start nodemon
- `npm run seed`: seed admin, settings, demo client/project

## Notes
- Mongoose options are modernized (no deprecated flags)
- Duplicate indexes removed
- NIC hashed (`nicHash`); forgot-password compares against hash
