import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();
const messages = [];
const MAX_MESSAGES = 100;

console.log('WebSocket server started on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Send existing messages to new client
  ws.send(JSON.stringify({
    type: 'history',
    messages: messages
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'message') {
        // Store message
        messages.push(message.data);
        
        // Keep only last MAX_MESSAGES
        if (messages.length > MAX_MESSAGES) {
          messages.shift();
        }

        // Broadcast to all clients
        const broadcast = JSON.stringify({
          type: 'new_message',
          message: message.data
        });

        clients.forEach(client => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(broadcast);
          }
        });
      } else if (message.type === 'flush') {
        // Clear all messages
        messages.length = 0;
        console.log('All messages cleared');

        // Broadcast flush to all clients
        const flushBroadcast = JSON.stringify({ type: 'flush' });

        clients.forEach(client => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(flushBroadcast);
          }
        });
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});
