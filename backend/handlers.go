package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	client := &Client{Conn: ws}
	clients[ws] = client
	log.Printf("New client connected: %s", ws.RemoteAddr())

	defer func() {
		log.Printf("Client disconnected: %s", ws.RemoteAddr())
		delete(clients, ws)
		
		// Remove from userSockets
		for username, conn := range userSockets {
			if conn == ws {
				delete(userSockets, username)
				log.Printf("User %s logged out", username)
				break
			}
		}
		
		ws.Close()
	}()

	for {
		var msg Message
		if err := ws.ReadJSON(&msg); err != nil {
			log.Printf("Read error: %v", err)
			break
		}

		if msg.Type == "register" {
			client.Username = msg.From
			userSockets[msg.From] = ws
			log.Printf("User registered: %s", msg.From)
			
			ws.WriteJSON(Message{
				Type:      "system",
				Content:   "🎉 Welcome " + msg.From + "! You're now connected.",
				Timestamp: time.Now().Format("15:04:05"),
			})
			continue
		}

		broadcast <- msg
	}
}

func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
