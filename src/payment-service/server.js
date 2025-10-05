const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

async function testDbConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log("DB Time:", rows[0].now);
    await connection.end();
    return rows[0].now;
  } catch (err) {
    console.error("DB Error:", err.message);
    throw err;
  }
}

app.get('/', async (req, res) => {
  try {
    const dbTime = await testDbConnection();
    res.send(`Payment Service is running. DB Time: ${dbTime}`);
  } catch (err) {
    res.status(500).send('Database connection failed: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));

