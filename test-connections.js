const mysql = require('mysql2/promise');
const redis = require('redis');
require('dotenv').config();

async function testConnections() {
  console.log('Testing database connections...\n');

  // Test MySQL connection
  try {
    console.log('Testing MySQL connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    });
    
    await connection.execute('SELECT 1');
    console.log('✅ MySQL connection successful');
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('✅ Database created/verified');
    
    await connection.end();
  } catch (error) {
    console.log('❌ MySQL connection failed:', error.message);
  }

  // Test Redis connection
  try {
    console.log('\nTesting Redis connection...');
    const redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });
    
    await redisClient.connect();
    await redisClient.ping();
    console.log('✅ Redis connection successful');
    
    await redisClient.disconnect();
  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
  }

  console.log('\nConnection test complete!');
}

testConnections();