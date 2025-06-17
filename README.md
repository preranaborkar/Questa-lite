# Questa Lite - Quiz Platform

A simple fullstack quiz application where authenticated users can create quizzes and share them publicly.

## 🚀 Live Demo

**Live URL:** [https://questa-lite.onrender.com](https://questa-lite.onrender.com)

## ✨ Features

- **Authentication**: Email-based signup/login with JWT tokens
- **Quiz Creation**: Create quizzes with single-choice and text questions (authenticated users only)
- **Public Sharing**: Share quizzes via public URLs for anyone to participate
- **Response Management**: View quiz submissions with timestamps and answers (authenticated users only)
- **CSV Export**: Download quiz responses as CSV files for easy analysis

## 🛠️ Tech Stack

- Next.js 15 (App Router) + TypeScript
- MongoDB + Prisma
- Tailwind CSS + ShadCN UI
- Deployed on Render

## 🚦 Quick Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/preranaborkar/Questa-lite.git
   cd questa-lite
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your MongoDB URL and auth secrets in `.env.local` and .env

   ```
   Ensure you have a MongoDB database ready and replace the `DATABASE_URL` with your connection string.
   If you don't have a MongoDB instance, you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to create one.
   You can also use a local MongoDB instance if you prefer.
   Make sure to set the `NEXTAUTH_SECRET` and `NEXTAUTH_URL` as well.
   If you are using a local MongoDB instance, set `NEXTAUTH_URL` to `http://localhost:3000`.


3. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🧪 Sample Login Credentials

**Test Account:**
- Email: `test@example.com`
- Password: `password123`

## 📋 Testing Flow

1. Login with sample credentials
2. Create a quiz in Dashboard
3. Copy the public quiz URL
4. Open URL in incognito window to test public access
5. Submit responses and view them in Dashboard

## 🔧 Environment Variables

Required variables for `.env.local`:

```env
DATABASE_URL="your-mongodb-connection-string"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## 👨‍💻 Developer

**Your Name**
- GitHub: [@preranaborkar](https://github.com/preranaborkar)
- LinkedIn: [preranaborkar27/](https://www.linkedin.com/in/preranaborkar27/)