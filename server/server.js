const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables strictly from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/shopping', require('./routes/shoppingRoutes'));

// ── Diagnostic Route: GET /api/debug-gemini ──────────────────────────────────
// Tests Gemini API directly. Call this from browser or Postman to verify AI works.
app.get('/api/debug-gemini', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('[Debug Route] Testing Gemini API with hardcoded prompt...');
    const result = await model.generateContent('Generate a one-sentence recipe for pasta carbonara.');
    const text = result.response.text();
    console.log('[Debug Route] Gemini responded:', text);
    res.json({ status: 'SUCCESS', model: 'gemini-2.5-flash', geminiResponse: text });
  } catch (err) {
    console.error('[Debug Route] Gemini test FAILED:', err.message);
    res.status(500).json({ status: 'FAILED', error: err.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Smart Recipe Generator API is running...');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
