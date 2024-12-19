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
    connectWebSocket(); // Connect to WebSocket

    // Add enter key listener only once
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});


let ws;

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'messages') {
            // Load all messages for new clients
            updateMessages(data.data);
        } else if (data.type === 'newMessage') {
            // Update messages with the new message
            updateMessages(data.data);
        }
    };

    ws.onclose = () => {
        setTimeout(connectWebSocket, 1000); // Attempt reconnect if disconnected
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
    
    console.log('Sending message:', message); // Debug log
    
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
            messageInput.value = ''; // Clear the input field
        })
        .catch(error => console.error('Error:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket(); // Connect to WebSocket only once
});
    
