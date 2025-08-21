Real-Time Communication App
A modern, real-time communication web application featuring group and direct messaging, video and voice calls, built with React frontend, WebRTC, and a Go backend WebSocket server.

Features
User registration with username

Broadcast, direct, and group messaging in real-time via WebSocket

Join, create, and manage chat groups

Group and private video and voice calls powered by WebRTC

Dark mode support with Tailwind CSS

Responsive UI with smooth scroll and animations

Error and connection status handling

Tech Stack
Frontend: React, Tailwind CSS, React Context API, Lucide React Icons

Backend: Go (Golang) with WebSocket server

Real-time: WebRTC for audio/video streaming

Communication: WebSocket protocol for signaling and messaging

Setup & Installation
Prerequisites
Node.js (v16+ recommended)

Go (for backend server)

Yarn or npm

Docker and Docker Compose (optional, for containerized deployment)

Frontend
bash
cd frontend
npm install
npm run dev
Update the WebSocket server URL in .env or configuration file (VITE_WS_URL).

Backend
bash
cd backend
go run main.go
Configure server ports and WebSocket endpoint as needed.

Docker Setup
You can run both frontend and backend using Docker for easy deployment.

Create docker-compose.yml:
text
version: "3.8"

services:
backend:
build: ./backend
ports: - "8080:8080"
restart: unless-stopped

frontend:
build: ./frontend
ports: - "3000:3000"
environment: - VITE_WS_URL=ws://localhost:8080/ws
restart: unless-stopped
Commands:
bash
docker-compose up --build
Open http://localhost:3000 in your browser.

Stop containers with:

bash
docker-compose down
Usage
Open the frontend app in your browser.

Register with a unique username.

Join or create groups to chat.

Send broadcast or direct messages to other users.

Start group or private video/voice calls.

Use dark mode toggle to switch themes.

Project Structure
/frontend - React source code

/backend - Go WebSocket signaling and messaging server

Code Highlights
React Context and hooks for real-time state management

WebSocket message handlers with group and private message support

WebRTC-based peer connection management for calls

TailwindCSS-based responsive UI

Troubleshooting
Make sure backend WebSocket URL matches frontend config

Network firewalls may block WebRTC ports

Scroll issues can be controlled with chat container refs and scroll logic

Dark mode relies on toggling CSS classes on document.documentElement

License
This project is private and all rights are reserved. Unauthorized use, copying, or distribution is prohibited.

Contact
Questions or contributions? Please open an issue or pull request on GitHub.
