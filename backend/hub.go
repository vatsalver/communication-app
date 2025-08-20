package main

import (
	"log"
	"time"
)

func handleMessages() {
	for {
		msg := <-broadcast
		msg.Timestamp = time.Now().Format("15:04:05")

		switch msg.Type {
		case "broadcast":
			log.Printf("Broadcasting message from %s", msg.From)
			for client := range clients {
				if err := client.WriteJSON(msg); err != nil {
					log.Printf("Error broadcasting to client: %v", err)
					client.Close()
					delete(clients, client)
				}
			}

		case "dm":
			if targetConn, ok := userSockets[msg.To]; ok {
				if err := targetConn.WriteJSON(msg); err != nil {
					log.Printf("Error sending DM: %v", err)
				}
			}

		case "create_group":
			if _, exists := groups[msg.Group]; !exists {
				groups[msg.Group] = []string{msg.From}
				log.Printf("Created group %s with creator %s", msg.Group, msg.From)
			}
			if creator, ok := userSockets[msg.From]; ok {
				creator.WriteJSON(Message{
					Type:      "system",
					Content:   "✅ Group '" + msg.Group + "' created successfully",
					Timestamp: time.Now().Format("15:04:05"),
				})
			}

		case "join_group":
			if members, exists := groups[msg.Group]; exists {
				for _, member := range members {
					if member == msg.From {
						return
					}
				}
				groups[msg.Group] = append(groups[msg.Group], msg.From)
				if user, ok := userSockets[msg.From]; ok {
					user.WriteJSON(Message{
						Type:      "system",
						Content:   "✅ Successfully joined group '" + msg.Group + "'",
						Timestamp: time.Now().Format("15:04:05"),
					})
				}
			}

		case "group":
			if members, ok := groups[msg.Group]; ok {
				log.Printf("Sending group message to %d members in %s", len(members), msg.Group)
				for _, memberID := range members {
					if conn, connected := userSockets[memberID]; connected {
						if err := conn.WriteJSON(msg); err != nil {
							log.Printf("Error sending group message: %v", err)
						}
					}
				}
			}

		case "start_video", "video_offer", "video_answer", "ice_candidate":
			if msg.To != "" {
				if target, ok := userSockets[msg.To]; ok {
					target.WriteJSON(msg)
				}
			} else if msg.Group != "" {
				if members, ok := groups[msg.Group]; ok {
					for _, memberID := range members {
						if memberID != msg.From {
							if conn, connected := userSockets[memberID]; connected {
								conn.WriteJSON(msg)
							}
						}
					}
				}
			}
		case "start_voice":
			if msg.To != "" {
				if target, ok := userSockets[msg.To]; ok {
					target.WriteJSON(msg)
				}
			} else if msg.Group != "" {
				if members, ok := groups[msg.Group]; ok {
					for _, memberID := range members {
						if memberID != msg.From {
							if conn, connected := userSockets[memberID]; connected {
								conn.WriteJSON(msg)
							}
						}
					}
				}
			}
		}
	}
}
