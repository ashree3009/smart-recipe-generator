const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  ingredients: [String],
  instructions: [String],
  cookingTime: String,
  difficultyLevel: String,
  cuisineType: String,
  calories: String,
  nutritionDetails: {
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
  },
  servings: String,
  tags: [String],
  image: String,
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
