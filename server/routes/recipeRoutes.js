const express = require('express');
const {
  createGeneratedRecipe,
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, createGeneratedRecipe);
router.post('/save', protect, saveRecipe);
router.get('/', protect, getSavedRecipes);
router.get('/:id', protect, getRecipeById);      // ← NEW: single recipe by ID
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
