const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const pool = require('./models/db');  // MySQL connection pool

const purchaseRoutes = require('./routes/purchaseRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/auth');
const adminBooksRoutes = require('./routes/admin/books');
const adminGenresRoutes = require('./routes/admin/genres');
const adminUsersRoutes = require('./routes/admin/users');
const adminCommentsRoutes = require('./routes/admin/comments');
const adminPurchasesRoutes = require('./routes/admin/purchases');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/online_bookstore_db")
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Genres and Books routes
app.get('/api/genres', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT name FROM genres ORDER BY name');
    const genres = rows.map(row => row.name);
    res.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Server error fetching genres' });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM books ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error fetching books' });
  }
});

app.get('/api/books/genre/:genreName', async (req, res) => {
  const { genreName } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT b.* FROM books b
       JOIN book_genres bg ON b.id = bg.book_id
       JOIN genres g ON g.id = bg.genre_id
       WHERE g.name = ?`,
      [genreName]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books by genre:', error);
    res.status(500).json({ message: 'Server error fetching books by genre' });
  }
});

// API routes
app.use('/api/purchases', purchaseRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin/books', adminBooksRoutes);
app.use('/api/admin/genres', adminGenresRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/comments', adminCommentsRoutes);
app.use('/api/admin/purchases', adminPurchasesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
