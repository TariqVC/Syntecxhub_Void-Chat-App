# 🌌 Void Chat

A real-time chat application built with the MERN stack and Socket.io. Features a space-themed translucent UI, JWT authentication, persistent chat history, and live online user tracking.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **Real-time messaging** — instant message delivery via Socket.io with no page refresh
- **Chat rooms** — create and join public channels, multiple rooms supported
- **Authentication** — secure register/login with JWT stored in httpOnly cookies
- **Chat history** — all messages persisted to MongoDB and loaded on room join
- **Online presence** — live count of connected users, updates on connect/disconnect
- **Typing indicators** — see when others are composing a message
- **Grouped messages** — consecutive messages from the same user are grouped (Discord-style)
- **Space UI** — translucent glass panels, animated starfield, nebula glows, smooth animations

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| Socket.io | Real-time bidirectional communication |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | httpOnly cookie support |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Zustand | Lightweight global state management |
| Socket.io Client | Real-time client connection |
| Axios | HTTP requests |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |

---

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── jwt.js          # Token generation & cookie config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── room.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js  # JWT route protection
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── message.model.js
│   │   │   └── room.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── room.routes.js
│   │   └── socket/
│   │       └── socket.js       # Socket.io server & event handlers
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── chat/
    │   │   │   ├── ChatWindow.jsx
    │   │   │   ├── MessageBubble.jsx
    │   │   │   └── Sidebar.jsx
    │   │   └── ui/
    │   │       └── StarField.jsx
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── lib/
    │   │   └── axios.js
    │   ├── pages/
    │   │   ├── ChatPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── store/
    │   │   ├── useAuthStore.js
    │   │   └── useChatStore.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local) or a MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/chat-app.git
cd chat-app
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start the backend dev server:

```bash
npm run dev
```

You should see:
```
Server running on port 5001
MongoDB connected: localhost
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔌 Socket.io Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `joinRoom` | `roomId` | Join a chat room and receive history |
| `leaveRoom` | `roomId` | Leave a chat room |
| `sendMessage` | `{ roomId, text }` | Send a message to a room |
| `typing` | `{ roomId, username }` | Notify others you are typing |
| `stopTyping` | `{ roomId }` | Clear typing indicator |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `onlineUsers` | `userId[]` | Updated list of online user IDs |
| `roomHistory` | `message[]` | Last 50 messages on room join |
| `newMessage` | `message` | A newly sent message |
| `userTyping` | `{ username }` | Someone started typing |
| `userStopTyping` | — | Typing indicator cleared |

---

## 🌐 REST API

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT cookie |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| GET | `/api/auth/me` | Yes | Get current user |

### Rooms

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/rooms` | Yes | Get all rooms |
| POST | `/api/rooms` | Yes | Create a new room |
| GET | `/api/rooms/:roomId/messages` | Yes | Get messages for a room |

---

## ☁️ Deployment

This app is configured to deploy as a single service on **Render** with **MongoDB Atlas**.

### Environment variables for production

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/chatapp
JWT_SECRET=your_production_secret
NODE_ENV=production
CLIENT_URL=https://your-app.onrender.com
PORT=5001
```

### Render settings

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm run build` |
| Start command | `npm start` |

The build command installs dependencies and builds the React frontend into `frontend/dist`, which Express then serves statically in production.

> **Note:** On Render's free tier, the service spins down after 15 minutes of inactivity. The first request after that may take ~30 seconds to wake up.

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT stored in **httpOnly cookies** — inaccessible to JavaScript, preventing XSS
- Cookie set to **sameSite: strict** in development and **sameSite: none / secure** in production
- All socket connections authenticated via the JWT cookie on handshake
- All API routes (except register/login) protected by auth middleware

---

## 📸 Screenshots

<img width="1913" height="933" alt="image" src="https://github.com/user-attachments/assets/41905099-8213-4bc7-99a7-199c38848d4a" />
<img width="1914" height="940" alt="image" src="https://github.com/user-attachments/assets/436927c6-4d58-4294-9f0f-c41bd183f098" />
<img width="1916" height="936" alt="image" src="https://github.com/user-attachments/assets/fa2ea00f-97c9-46d5-9d69-3307e84af6e6" />
<img width="1911" height="939" alt="image" src="https://github.com/user-attachments/assets/94309714-24e2-40c1-a99d-a59bc0eecf5f" />


---

## 📄 License

MIT License — feel free to use this project for learning or as a portfolio piece.

---

## 🙏 Acknowledgements

- [Socket.io docs](https://socket.io/docs/v4/) — excellent real-time communication reference
- [Zustand](https://github.com/pmndrs/zustand) — surprisingly simple global state
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling that actually scales
- Inspired by [burakorkmez/fullstack-chat-app](https://github.com/burakorkmez/fullstack-chat-app)
