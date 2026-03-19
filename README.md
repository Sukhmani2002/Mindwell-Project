# 🌿 MindWell – Mental Health Support System

A full-stack MERN application focused on mental well-being, stress relief, emotional safety, and user privacy.

## 🏗️ Tech Stack

**Frontend:** React.js, Tailwind CSS, React Router v6, Axios, Chart.js  
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcrypt  
**AI:** OpenAI GPT / Google Gemini (configurable)

---

## 📁 Project Structure

```
mindwell/
├── server/              ← Express.js backend
│   ├── config/db.js
│   ├── controllers/     ← authController, moodController, chatController, profileController
│   ├── middleware/      ← auth.js, errorHandler.js
│   ├── models/          ← User.js, Mood.js, Chat.js
│   ├── routes/          ← auth.js, mood.js, chat.js, profile.js
│   ├── index.js
│   └── .env.example
└── client/              ← React frontend
    └── src/
        ├── components/  ← Navbar, PrivateRoute
        ├── context/     ← AuthContext
        ├── pages/       ← Signup, Login, Dashboard, MoodTracker, ChatSupport, Meditation, Music, Games, Profile
        ├── services/    ← api.js
        ├── App.js
        └── index.css
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

---

## ⚙️ Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindwell
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Choose one AI provider:
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# OR use Gemini:
# AI_PROVIDER=gemini
# GEMINI_API_KEY=AIza...

NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **Note:** The chatbot works without an API key using built-in fallback responses. Add a key for full AI functionality.

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login + get JWT |
| POST | `/api/mood` | ✅ | Log mood entry |
| GET | `/api/mood/history` | ✅ | Get mood history + stats |
| DELETE | `/api/mood/:id` | ✅ | Delete mood entry |
| POST | `/api/chat` | ✅ | Send AI message |
| GET | `/api/chat/history` | ✅ | Get chat sessions |
| DELETE | `/api/chat/:id` | ✅ | Delete chat session |
| GET | `/api/profile` | ✅ | Get user profile |
| PUT | `/api/profile` | ✅ | Update profile |
| PUT | `/api/profile/password` | ✅ | Change password |
| DELETE | `/api/profile` | ✅ | Deactivate account |

---

## ✨ Features

| Module | Features |
|--------|----------|
| 🔐 Auth | JWT, bcrypt hashing, protected routes |
| 💫 Mood Tracker | 6 moods, intensity slider, notes, Chart.js analytics |
| 💬 AI Chat | Empathetic AI, chat history, crisis resources |
| 🧘 Meditation | 4-7-8, Box, Deep breathing with animated timer |
| 🎵 Music | Web Audio API soundscapes (rain, ocean, forest, etc.) |
| 🎮 Games | Bubble Pop, Memory Match, Color Breathing, Zen Garden |
| 👤 Profile | Edit profile, change password, privacy settings |

---

## 🛡️ Security

- JWT authentication with 7-day expiry
- bcrypt password hashing (12 salt rounds)
- Input validation with express-validator
- Protected routes via middleware
- Private data scoped to user ID

---

## ⚠️ Important Notice

MindWell is a supportive wellness tool — **not a replacement for professional mental health care**. If you or someone you know is in crisis, please contact:
- **988 Suicide & Crisis Lifeline:** Call or text **988**
- **Crisis Text Line:** Text HOME to **741741**
