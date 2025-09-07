# LiveChat - Backend

The Go backend for the LiveChat application. Handles WebSocket connections and
manages chat rooms in memory.

## What It Does

- WebSocket server for real-time chat communication
- Room-based messaging system (users join rooms by name)
- In-memory room management (no database needed)
- Thread-safe handling of multiple concurrent connections
- Health check endpoint for monitoring

## Tech Stack

- **Go 1.21** - High-performance backend language
- **Fiber** - Fast web framework
- **WebSockets** - Real-time bidirectional communication
- **Goroutines** - Concurrent connection handling
