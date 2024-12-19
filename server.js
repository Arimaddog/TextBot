const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store messages in memory
let messages = [];

// WebSocket connection handling
wss.on('connection', (ws) => {
    // Send existing messages to new clients
    ws.send(JSON.stringify({ type: 'messages', data: messages }));
});

// Broadcast to all clients
function broadcast(data) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(data));
    });
}

// API endpoints
app.post('/api/messages', (req, res) => {
    const message = req.body.message;
    if (message) {
        messages.unshift(message);
        // Broadcast new message to all clients
        broadcast({ type: 'newMessage', data: messages });
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, error: 'Message is required' });
    }
});

// ... rest of your endpoints ...

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});