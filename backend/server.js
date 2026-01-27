import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'yackson',
  password: process.env.DB_PASSWORD || 'yackson123',
  database: process.env.DB_NAME || 'yacksons_world',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    setTimeout(testConnection, 5000); // Retry after 5 seconds
  }
}

testConnection();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== BLOG ENDPOINTS ====================

// Get all blog posts
app.get('/api/blogs', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, slug, content, pub_date, category, created_at, updated_at FROM blogs ORDER BY pub_date DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog post by slug
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, slug, content, pub_date, category, created_at, updated_at FROM blogs WHERE slug = ?',
      [req.params.slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create new blog post
app.post('/api/blogs', async (req, res) => {
  const { title, slug, content, category } = req.body;
  
  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Title, slug, and content are required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO blogs (title, slug, content, category, pub_date) VALUES (?, ?, ?, ?, NOW())',
      [title, slug, content, category || null]
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      slug,
      content,
      category,
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A blog with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update blog post
app.put('/api/blogs/:slug', async (req, res) => {
  const { title, content, category } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE blogs SET title = ?, content = ?, category = ?, updated_at = NOW() WHERE slug = ?',
      [title, content, category, req.params.slug]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog post
app.delete('/api/blogs/:slug', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM blogs WHERE slug = ?', [req.params.slug]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ==================== MESSAGE ENDPOINTS ====================

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, text, timestamp, sender, created_at FROM messages ORDER BY timestamp DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create new message
app.post('/api/messages', async (req, res) => {
  const { text, sender } = req.body;
  
  if (!text || !sender) {
    return res.status(400).json({ error: 'Text and sender are required' });
  }
  
  if (!['user', 'other'].includes(sender)) {
    return res.status(400).json({ error: 'Sender must be either "user" or "other"' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO messages (text, sender, timestamp) VALUES (?, ?, NOW())',
      [text, sender]
    );
    
    res.status(201).json({
      id: result.insertId,
      text,
      sender,
      timestamp: new Date(),
      message: 'Message created successfully'
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Delete all messages
app.delete('/api/messages', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages');
    res.json({ message: 'All messages deleted successfully' });
  } catch (error) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ error: 'Failed to delete messages' });
  }
});

// Delete single message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ==================== IMAGE ENDPOINTS ====================

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, filename, original_name, mime_type, size, url, alt_text, created_at FROM images ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Upload image
app.post('/api/images', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  const { originalname, filename, mimetype, size } = req.file;
  const url = `/uploads/${filename}`;
  const altText = req.body.alt_text || '';
  
  try {
    const [result] = await pool.query(
      'INSERT INTO images (filename, original_name, mime_type, size, url, alt_text) VALUES (?, ?, ?, ?, ?, ?)',
      [filename, originalname, mimetype, size, url, altText]
    );
    
    res.status(201).json({
      id: result.insertId,
      filename,
      original_name: originalname,
      mime_type: mimetype,
      size,
      url,
      alt_text: altText,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM images WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ==================== REVIEW ENDPOINTS ====================

// Get all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, rating, author, created_at, updated_at FROM reviews ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create new review
app.post('/api/reviews', async (req, res) => {
  const { title, content, rating, author } = req.body;
  
  if (!title || !content || !rating) {
    return res.status(400).json({ error: 'Title, content, and rating are required' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (title, content, rating, author) VALUES (?, ?, ?, ?)',
      [title, content, rating, author || 'Anonymous']
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      content,
      rating,
      author: author || 'Anonymous',
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Delete review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
