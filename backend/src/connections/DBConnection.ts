import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function initializeDatabase() {
  try {
    const databaseConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Database connected');
    return databaseConnection;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

const databaseConnectionPromise = initializeDatabase();

export { databaseConnectionPromise };
