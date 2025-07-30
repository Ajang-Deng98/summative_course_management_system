const sequelize = require('./src/config/database');
const { seedDatabase } = require('./src/config/seed');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    console.log('Synchronizing database models...');
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    console.log('Database synchronized successfully.');
    
    console.log('Seeding database with sample data...');
    await seedDatabase();
    console.log('Database seeded successfully.');
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();