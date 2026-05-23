# Smart Recipe Generator

A complete full-stack AI-powered web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Generate personalized recipes from ingredients you have, chat with an AI culinary assistant, and manage your favorite recipes.

---

# Live Demo

## Frontend

```text id="5ppxqb"
https://smart-recipe-generator-s.vercel.app
```

## Backend API

```text id="ax2hsu"
https://smart-recipe-generator-y30j.onrender.com
```

---

# Features

* **User Authentication:** Secure JWT-based register, login, and protected routes.
* **AI Recipe Generator:** Uses Google Gemini AI to generate customized recipes based on your ingredients and dietary preferences (Vegan, High Protein, etc.). Includes full nutritional information, difficulty, and cooking time.
* **AI Chat Assistant:** Ask any culinary question to your personal AI chef.
* **Saved Recipes:** Save your favorite generated recipes to your profile.
* **Shopping List Management:** Manage ingredients, shopping needs, and auto-generated grocery items from recipes.
* **Custom API Key Support:** Users can securely manage and use their own Gemini/OpenAI API keys.
* **Modern UI/UX:** Responsive, premium design with Dark/Light mode, glassmorphism, and Framer Motion animations. Built with Tailwind CSS v4.

---

# Tech Stack

## Frontend

* React 19
* Tailwind CSS v4
* Framer Motion
* React Router
* Axios
* Lucide React (Icons)

## Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Google Generative AI SDK

---

# Setup Instructions

## 1. Prerequisites

* Node.js (v18+)
* MongoDB connection string
* Google Gemini API Key

---

# 2. Backend Setup

Navigate to the server folder:

```bash id="4pqxya"
cd server
```

Install dependencies:

```bash id="hftw5n"
npm install
```

Create a `.env` file in the server folder with the following keys:

```env id="f2m8iu"
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the development server:

```bash id="9u9y1r"
npm run dev
```

---

# 3. Frontend Setup

Navigate to the client folder:

```bash id="6v6g9s"
cd client
```

Install dependencies:

```bash id="n3lfqa"
npm install
```

Create a `.env` file in the client folder:

```env id="8q2x5z"
VITE_API_URL=http://localhost:4000
```

Start the Vite development server:

```bash id="6gcuxi"
npm run dev
```

---

# 4. Access the Application

Frontend:

```text id="gklsmr"
http://localhost:5173
```

Backend API:

```text id="53x6k8"
http://localhost:4000
```

---

# Environment Variables

## Backend `.env`

```env id="35wjlwm"
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

## Frontend `.env`

```env id="jofl2k"
VITE_API_URL=http://localhost:4000
```

---

# Project Highlights

* AI-powered personalized recipe generation
* Secure JWT authentication system
* Dynamic shopping list management
* Gemini AI integration
* Responsive modern UI
* Protected API routes
* MongoDB persistent storage
* User-specific saved recipes
* Per-user API key configuration support

---

# Author

**Shree Singal**
