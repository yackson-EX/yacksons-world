import type { APIRoute } from 'astro';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3001';

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/messages`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from backend');
    }
    
    const messages = await response.json();
    
    // Format messages with time
    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      text: msg.text,
      timestamp: msg.timestamp,
      sender: msg.sender,
      time: new Date(msg.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
    
    return new Response(JSON.stringify(formattedMessages), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
