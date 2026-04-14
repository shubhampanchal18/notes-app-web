const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Import models to ensure they're initialized
const User = require('./models/User');
const Note = require('./models/Note');

// Setup associations
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
}).catch(err => {
  console.log('❌ Database sync error:', err.message);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.get('/', (req, res) => {
  res.json({ message: 'Notes App Backend is Running ✅' });
});

module.exports = app;
