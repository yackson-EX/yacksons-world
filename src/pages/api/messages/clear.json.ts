import type { APIRoute } from 'astro';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3001';

export const POST: APIRoute = async () => {
  try {
    // Forward to backend API
    const response = await fetch(`${BACKEND_URL}/api/messages`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Backend request failed');
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: result.message
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to clear messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
