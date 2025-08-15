package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/ws", handleConnections)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w, r)
		w.Write([]byte("Communication App Backend is running! 🚀"))
	})

	go handleMessages()

	log.Println("🚀 Communication App Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
