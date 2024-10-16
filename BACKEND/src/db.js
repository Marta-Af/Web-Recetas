const mysql = require('mysql2/promise');
require('dotenv').config();

// Conectar a la base de datos
const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_SCHEMA || 'bd_recipes',
  });

  console.log(`Conexión establecida con la base de datos (identificador=${connection.threadId})`);
  return connection;
};

module.exports = { getConnection };
