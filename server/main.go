package main

import (
	"log"
	"os"
	"sync"

	"github.com/gofiber/fiber/v2"
	websocket "github.com/gofiber/websocket/v2"
)

type Message struct {
	User string `json:"user"`
	Text string `json:"text"`
}

type Pong struct {
	Message string `json:"message"`
}

type room struct {
	conns map[*websocket.Conn]struct{}
	mu    sync.Mutex
}

func (r *room) broadcast(msg []byte) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for c := range r.conns {
		if err := c.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Printf("write: %v", err)
		}
	}
}

func (r *room) add(c *websocket.Conn) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.conns[c] = struct{}{}
}

func (r *room) remove(c *websocket.Conn) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.conns, c)
}

var rooms = struct {
	m  map[string]*room
	mu sync.Mutex
}{m: map[string]*room{}}

func getRoom(name string) *room {
	rooms.mu.Lock()
	defer rooms.mu.Unlock()
	if r, ok := rooms.m[name]; ok {
		return r
	}
	r := &room{conns: make(map[*websocket.Conn]struct{})}
	rooms.m[name] = r
	return r
}

func main() {
	app := fiber.New()

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "pong"})
	})

	app.Get("/ws/:room", websocket.New(func(c *websocket.Conn) {
		roomName := c.Params("room")
		r := getRoom(roomName)
		r.add(c)
		defer func() {
			r.remove(c)
			c.Close()
		}()

		for {
			mt, msg, err := c.ReadMessage()
			if err != nil {
				break
			}
			if mt == websocket.TextMessage {
				r.broadcast(msg)
			}
		}
	}))

	addr := os.Getenv("PORT")
	if addr == "" {
		addr = "8080"
	}
	log.Printf("listening on :%s", addr)
	app.Listen("localhost:" + addr)
}
