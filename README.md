# Real-Time Chat Application

This is a full-stack WhatsApp-style chat application that supports 
- **real-time one-to-one and group messaging**
- **secure authenticatio** 
- **AI-powered message summarization**

---

## Features

- **User Authentication** (Login & Registration) using Java Servlets + MySQL
- **One-to-One Messaging** in real-time
- **Group Chat Support** with group creation and member-specific messaging
- **Real-Time Communication** using Socket.IO and Node.js
- **AI-Powered Summarization** of long chat conversations using Hugging Face Inference API
- **Messages stored in MongoDB**, while user data is stored in MySQL


---

## Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| Frontend     | HTML, CSS, JavaScript               |
| Backend 1    | Java Servlets, JSP, MySQL (Auth)    |
| Backend 2    | Node.js, Express, Socket.IO         |
| Database     | MySQL (Users), MongoDB (Messages)   |
| NLP Model    | philschmid/bart-large-cnn-samsum   |

---

## Project Structure

chatApp/
│
├── src/ # Java Servlets & JSP
├── backend/ # Node.js backend (Socket.IO, Express)
│ ├── sockets/
│ ├── Models/
│ ├── routes/
│ └── server.js
├── chatApp/ # JSP, JS, CSS files
├── node_modules/
├── target/ # Java build artifacts
├── .env # Environment variables (API keys, DB URIs)
├── .gitignore
├── package.json
└── pom.xml


---

## ⚙ Setup Instructions

### 1. Backend (Java + JSP)
- Import the project into an IDE like Eclipse or IntelliJ
- Set up Apache Tomcat server
- Configure MySQL connection in your servlet
- Run the server and access JSP frontend via `localhost:8080`

### 2. Realtime Server (Node.js + Socket.IO)

-cd backend
-npm install
-node server.js

---
## Environment Variables
Create a .env file inside backend/:

-MONGODB_URI=your_mongo_connection_string 
-HUGGINGFACE_API_TOKEN=your_huggingface_api_token

---
### How to Use
- Register or Login using the JSP-based form
- Select a user or group to chat with
- Send and receive messages in real-time
- Use the "Summarize Chat" button to get AI-generated conversation summaries (for chats over 50 words)

### Future Enhancements
- Media support (images, files)
- Message reactions
- Message edit/delete
- Online/offline indicators
- Push notifications
