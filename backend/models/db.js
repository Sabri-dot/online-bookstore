const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Merr host nga .env
  user: process.env.DB_USER,       // Merr user nga .env
  password: process.env.DB_PASS,   // Merr password nga .env
  database: process.env.DB_NAME,   // Merr emrin e databazës nga .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
