# Notes App - Setup Instructions

## Project Structure
```
notes-app/
├── backend/
│   ├── models/
│   │   ├── User.js (User schema with password hashing)
│   │   └── Note.js (Note schema)
│   ├── routes/
│   │   ├── auth.js (Register, Login)
│   │   └── notes.js (CRUD operations)
│   ├── middleware/
│   │   └── auth.js (JWT verification)
│   ├── server.js (Express server)
│   ├── .env (Configuration)
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js (Main app)
    │   ├── Login.js (Login component)
    │   ├── Register.js (Register component)
    │   ├── Notes.js (Notes management)
    │   ├── Auth.css (Auth styling)
    │   ├── Notes.css (Notes styling)
    │   └── index.js (React entry point)
    └── package.json
```

## 🚀 QUICK START

### Step 1: Setup MongoDB
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update `/backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notesdb?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here_change_this
   PORT=5000
   ```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Start Backend
```bash
cd backend
npm start
# You should see: ✅ MongoDB Connected
# 🚀 Server running on http://localhost:5000
```

### Step 4: Start Frontend (in a new terminal)
```bash
cd frontend
npm start
# App will open at http://localhost:3000
```

## 📝 API ENDPOINTS (for testing with Postman)

### Authentication
- **Register**: `POST http://localhost:5000/api/auth/register`
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **Login**: `POST http://localhost:5000/api/auth/login`
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

### Notes (Require: `Authorization: Bearer <token>`)
- **Create Note**: `POST http://localhost:5000/api/notes`
  ```json
  {
    "title": "My Note",
    "content": "Note content here"
  }
  ```

- **Get All Notes**: `GET http://localhost:5000/api/notes`

- **Get Single Note**: `GET http://localhost:5000/api/notes/:id`

- **Update Note**: `PUT http://localhost:5000/api/notes/:id`
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```

- **Delete Note**: `DELETE http://localhost:5000/api/notes/:id`

## ✨ Features

✅ User Authentication (Register/Login)
✅ Secure Password Hashing (bcryptjs)
✅ JWT Token Based Auth
✅ Create Notes
✅ View All Notes
✅ Delete Notes
✅ Responsive UI
✅ Error Handling
✅ Protected Routes

## 🛠️ Environment Variables

**Backend (.env)**:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

## 🐛 Troubleshooting

1. **"MongoDB Connection Error"**
   - Check your MONGO_URI in .env
   - Make sure your IP is whitelisted in MongoDB Atlas

2. **"Cannot GET /api/notes"**
   - Make sure backend is running on port 5000
   - Check Authorization header has "Bearer <token>"

3. **Frontend not connecting to backend**
   - Make sure backend is running
   - Check CORS is enabled in server.js

## 📱 Next Steps

1. Test in Postman (API endpoints above)
2. Go to http://localhost:3000 to use the app
3. Sign up → Create notes → Enjoy! 🎉
