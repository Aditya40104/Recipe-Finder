# 🍳 Recipe Finder App

A full-stack recipe finder application where users can:  
- 🔎 Search recipes using **TheMealDB API**  
- 🔐 Sign up / log in securely (JWT Auth with bcrypt)  
- ⭐ Save recipes to their favorites list  
- 🗑️ Remove recipes from favorites  

---

## 🚀 Tech Stack
### Frontend
- **React + Vite** → UI framework  
- **Tailwind CSS** → Styling  
- **Deployed on GitHub Pages**  

### Backend
- **Node.js + Express** → REST API  
- **bcrypt** → Secure password hashing  
- **jsonwebtoken (JWT)** → Authentication  
- **cors** → Cross-origin requests support  
- **Deployed on Render**  

### Database
- **PostgreSQL** (Render / ElephantSQL / Supabase)  
  - `users` table → stores user accounts  
  - `favorites` table → stores user’s favorite recipes  

### External API
- **TheMealDB API** → https://www.themealdb.com/api.php  

---

## 📂 Project Structure
recipe-finder/
│
├── frontend/ # React + Vite + Tailwind (GitHub Pages)
│ ├── src/
│ │ ├── App.jsx
│ │ ├── components/
│ │ │ ├── Auth.jsx
│ │ │ ├── RecipeSearch.jsx
│ │ │ └── Favorites.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── package.json
│ └── vite.config.js
│
├── backend/ # Node.js + Express + PostgreSQL (Render)
│ ├── server.js
│ ├── routes/
│ │ ├── auth.js
│ │ └── favorites.js
│ ├── db.js
│ ├── middleware/auth.js
│ └── package.json
│
└── README.md

yaml
Copy code

---

## ⚡ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/recipe-finder.git
cd recipe-finder
2. Backend Setup (Node + Express + PostgreSQL)
bash
Copy code
cd backend
npm install
Environment Variables (.env file in backend folder):

ini
Copy code
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=postgres://username:password@host:port/dbname
Run backend locally

bash
Copy code
npm start
API runs at http://localhost:5000

Auth routes: /auth/signup, /auth/login

Favorites routes: /favorites

Deploy backend on Render (recommended).

3. Database Setup (Postgres)
Run this SQL script:

sql
Copy code
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  meal_id VARCHAR(50) NOT NULL,
  meal_name VARCHAR(255) NOT NULL,
  meal_thumb TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, meal_id)
);
4. Frontend Setup (React + Vite + Tailwind)
bash
Copy code
cd frontend
npm install
Run frontend locally

bash
Copy code
npm run dev
Environment Variables (.env file in frontend folder):

ini
Copy code
VITE_API_BASE_URL=https://your-backend.onrender.com
5. Deployment
Frontend: GitHub Pages

Use gh-pages package or GitHub Actions workflow

Backend: Render (free plan works)

Database: Render PostgreSQL / ElephantSQL / Supabase

🔐 Authentication Flow
User signs up → password hashed with bcrypt → stored in DB.

User logs in → JWT generated → sent to frontend.

Frontend stores JWT → sends with requests to backend.

Protected routes (/favorites) require valid JWT.

📌 API Endpoints
Auth
POST /auth/signup → register a new user

POST /auth/login → authenticate user and return JWT

Favorites (JWT required)
GET /favorites → get all favorites for logged-in user

POST /favorites → add a new favorite

DELETE /favorites/:meal_id → remove from favorites

🛠️ Future Improvements
Add search filters (cuisine, category, etc.)

Add pagination or infinite scroll

Add “View Recipe Details” page with ingredients + steps

Add OAuth (Google, GitHub login)
