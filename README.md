# LiveChat

A simple real-time chat application built with Go and React. Users can join chat
rooms and communicate with others in real-time without needing a database.

## What It Does

- **Real-time messaging**: Send and receive messages instantly using WebSockets
- **Room-based chat**: Create or join chat rooms by entering a room code
- **No database required**: Everything runs in memory (messages are lost when
  server restarts)
- **Simple and fast**: Minimal setup with modern web technologies

## Project Structure

```
LiveChat/
├── client/          # React frontend (TypeScript + Vite)
├── server/          # Go backend (Fiber + WebSockets)
└── README.md        # This file
```

## Quick Start

### Prerequisites

- Go 1.20 or later
- Node.js 18 or later
- npm or yarn

### Running the Application

1. **Start the Go server:**

   ```bash
   cd server
   go run .
   ```

   Server will start on `http://localhost:8080`

2. **Start the React client:**

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Client will be available at `http://localhost:3000`

3. **Open your browser** and go to `http://localhost:3000`

4. **Join a chat room:**
   - Enter your username
   - Enter a room code (any text you want)
   - Click "Join Room"
   - Start chatting!

## How It Works

### Backend (Go)

- Uses the Fiber web framework for fast HTTP handling
- WebSocket connections for real-time communication

### Frontend (React)

- Modern React with TypeScript
- Tailwind CSS for styling
- WebSocket client for real-time messaging

## Development

## Technologies Used

- **Backend**: Go, Fiber, WebSockets
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Real-time**: WebSockets for instant messaging
- **Styling**: Tailwind CSS with dark mode support
