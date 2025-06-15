const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Lidhja me MongoDB për comments dhe logs
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/online_bookstore_db")
  .then(() => console.log("✅ MongoDB u lidh me sukses!"))
  .catch((err) => console.error("❌ Lidhja me MongoDB dështoi:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');     // users (MySQL)
const commentRoutes = require('./routes/commentRoutes'); // comments (MongoDB)
const logRoutes = require('./routes/logRoutes');         // logs (MongoDB)
const bookRoutes = require('./routes/bookRoutes');       // librat (MySQL)
const purchaseRoutes = require('./routes/purchaseRoutes'); // porositë (MySQL)

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/purchases', purchaseRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
