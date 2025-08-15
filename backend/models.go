package main

import "github.com/gorilla/websocket"

var clients = make(map[*websocket.Conn]*Client)
var userSockets = make(map[string]*websocket.Conn)
var groups = make(map[string][]string)
var broadcast = make(chan Message, 256)

type Client struct {
	ID       string
	Username string
	Conn     *websocket.Conn
}

type Message struct {
	Type      string `json:"type"`
	From      string `json:"from"`
	To        string `json:"to,omitempty"`
	Group     string `json:"group,omitempty"`
	Content   string `json:"content,omitempty"`
	SDP       string `json:"sdp,omitempty"`
	Candidate string `json:"candidate,omitempty"`
	Timestamp string `json:"timestamp,omitempty"`
}
