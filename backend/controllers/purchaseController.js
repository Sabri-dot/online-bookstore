const pool = require('../models/db');

exports.addPurchase = async (req, res) => {
  const userId = req.user.id;
  const { book_id } = req.body;

  if (!book_id) {
    return res.status(400).json({ message: "Mungon book_id" });
  }

  try {
    // Kontrollo nëse libri është blerë më parë
    const [existing] = await pool.execute(
      'SELECT * FROM purchases WHERE user_id = ? AND book_id = ?',
      [userId, book_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Libri është blerë më parë" });
    }

    // Shto blerjen në tabelë me datën aktuale
    await pool.execute(
      'INSERT INTO purchases (user_id, book_id, purchase_date) VALUES (?, ?, NOW())',
      [userId, book_id]
    );

    res.status(201).json({ message: "Blerja u krye me sukses!" });
  } catch (error) {
    console.error("Gabim gjatë blerjes:", error);
    res.status(500).json({ message: "Gabim gjatë blerjes" });
  }
};

exports.getUserPurchasedBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.execute(
      `SELECT b.id, b.title, b.author, b.price, b.description, b.image_url 
       FROM books b 
       INNER JOIN purchases p ON b.id = p.book_id 
       WHERE p.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Gabim gjatë marrjes së librave të blerë:", error);
    res.status(500).json({ message: "Gabim gjatë marrjes së librave të blerë" });
  }
};
