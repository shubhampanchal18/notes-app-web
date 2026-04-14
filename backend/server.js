const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import models to ensure they're initialized
const User = require('./models/User');
const Note = require('./models/Note');

// Setup associations
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });

// Sync database (creates tables or update schema when needed)
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
}).catch(err => {
  console.log('❌ Database sync error:', err.message);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Notes App Backend is Running ✅' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
