const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store messages in memory
let messages = [];

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get messages
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

// Post new message
// ... existing code ...

app.post('/api/messages', (req, res) => {
    const message = req.body.message;
    if (message) {
        // Use unshift instead of push to add messages to the beginning
        messages.unshift(message);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, error: 'Message is required' });
    }
});

// ... rest of the code ...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});