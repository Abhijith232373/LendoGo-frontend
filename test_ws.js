const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/api/admin/ws');

ws.on('open', () => {
    console.log('Connected to admin/ws');
    
    // Now trigger an update via API
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/config/admin',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: Admin login required? Yes! 
        // We will just listen here and manually curl.
      }
    };
});

ws.on('message', (data) => {
    console.log('Received:', data.toString());
});

ws.on('error', console.error);
