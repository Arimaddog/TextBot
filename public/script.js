function fetchMessages() {
    fetch('/api/messages')
        .then(response => response.json())
        .then(messages => {
            const messageDisplay = document.getElementById('messageDisplay');
            messageDisplay.innerHTML = messages
                .map(msg => `<div class="message">${msg}</div>`)
                .join('');
        })
        .catch(error => console.error('Error:', error));
}

// Add this polling function
function startPolling() {
    // Fetch messages every 2 seconds
    setInterval(fetchMessages, 2000);
}

// Update the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
    startPolling(); // Start polling for updates
    
    // Add enter key listener
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

let ws;

function connectWebSocket() {
    // Use wss:// for production (https) and ws:// for local development
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'messages' || data.type === 'newMessage') {
            updateMessages(data.data);
        }
    };

    ws.onclose = () => {
        // Reconnect if connection is lost
        setTimeout(connectWebSocket, 1000);
    };
}

function updateMessages(messages) {
    const messageDisplay = document.getElementById('messageDisplay');
    messageDisplay.innerHTML = messages
        .map(msg => `<div class="message">${msg}</div>`)
        .join('');
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(() => {
            messageInput.value = '';
        })
        .catch(error => console.error('Error:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});