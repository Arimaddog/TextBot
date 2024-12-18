function fetchMessages() {
    fetch('/api/messages')
        .then(response => response.json())
        .then(messages => {
            const messageDisplay = document.getElementById('messageDisplay');
            // Reverse the array before mapping
            messageDisplay.innerHTML = messages
                .reverse()
                .map(msg => `<div class="message">${msg}</div>`)
                .join('');
        })
        .catch(error => console.error('Error:', error));
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
            fetchMessages();
        })
        .catch(error => console.error('Error:', error));
    }
}

// Initial fetch of messages
document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
    
    // Add enter key listener
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});