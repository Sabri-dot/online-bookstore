const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const folders = ['routes', 'controllers', 'models'];
const files = {
  'routes/auth.js': `const express = require('express');
const router = express.Router();

// Route për testim
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

module.exports = router;
`,
  'controllers/authController.js': `// Logjikë për funksionet e autorizimit (login, register, etc.)
exports.test = (req, res) => {
  res.json({ message: 'Auth Controller test works!' });
};
`,
  'models/db.js': `const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'onlinebookstore'
});

module.exports = pool.promise();
`
};

folders.forEach(folder => {
  const folderPath = path.join(baseDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Folder created: ${folder}`);
  }
});

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`File created: ${filePath}`);
  }
}

console.log('Struktura u krijua me sukses!');
