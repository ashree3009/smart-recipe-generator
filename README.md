# Smart Recipe Generator

A complete full-stack AI-powered web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).
Generate personalized recipes from ingredients you have, chat with an AI culinary assistant, and manage your favorite recipes.

## Features
- **User Authentication:** Secure JWT-based register, login, and protected routes.
- **AI Recipe Generator:** Uses Google Gemini AI to generate customized recipes based on your ingredients and dietary preferences (Vegan, High Protein, etc.). Includes full nutritional information, difficulty, and cooking time.
- **AI Chat Assistant:** Ask any culinary question to your personal AI chef.
- **Saved Recipes:** Save your favorite generated recipes to your profile.
- **Modern UI/UX:** Responsive, premium design with Dark/Light mode, glassmorphism, and Framer Motion animations. Built with Tailwind CSS v4.

## Tech Stack
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, React Router, Axios, Lucide React (Icons).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Google Generative AI SDK.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Google Gemini API Key

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` folder with the following keys:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the development server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

### 4. Access the Application
- The frontend will run on `http://localhost:5173`
- The backend API will run on `http://localhost:4000`

## Author
Shree Singal.
