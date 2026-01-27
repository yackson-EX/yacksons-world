import type { APIRoute } from 'astro';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3001';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text, sender } = await request.json();
    
    if (!text || !sender) {
      return new Response(JSON.stringify({ error: 'Text and sender are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (sender !== 'user' && sender !== 'other') {
      return new Response(JSON.stringify({ error: 'Sender must be "user" or "other"' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Forward to backend API
    const response = await fetch(`${BACKEND_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, sender })
    });
    
    if (!response.ok) {
      throw new Error('Backend request failed');
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true,
      id: result.id,
      timestamp: result.timestamp 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to create message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
