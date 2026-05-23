const { generateChatResponse } = require('../services/aiService');

// @desc    Ask chatbot a question
// @route   POST /api/chat
// @access  Private
const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await generateChatResponse(message);
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { askChatbot };
