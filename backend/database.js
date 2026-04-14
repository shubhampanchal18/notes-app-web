const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite Database Connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'notesapp.db'),
  logging: false // Set to console.log to see SQL queries
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Connected');
  } catch (err) {
    console.log('❌ SQLite Connection Error:', err.message);
  }
};

testConnection();

module.exports = sequelize;
