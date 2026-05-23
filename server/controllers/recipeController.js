const Recipe = require('../models/Recipe');
const { generateRecipe } = require('../services/aiService');

// @desc    Generate a recipe using AI
// @route   POST /api/recipes/generate
// @access  Private
const createGeneratedRecipe = async (req, res) => {
  try {
    console.log('[Backend Route] -> /api/recipes/generate hit');
    const { ingredients, cuisine, dietPreferences, cookingTime } = req.body;
    console.log('[Controller] Params:', { ingredients, cuisine, dietPreferences, cookingTime });

    if (!ingredients || (Array.isArray(ingredients) && ingredients.length === 0)) {
      console.warn('[Controller] Validation failed: Missing ingredients');
      return res.status(400).json({ message: 'At least one ingredient is required' });
    }

    console.log('[Controller] Calling Gemini AI Service...');
    const recipeData = await generateRecipe({ ingredients, cuisine, dietPreferences, cookingTime });
    console.log(`[Controller] Successfully generated recipe: ${recipeData.title}`);

    res.status(200).json(recipeData);
  } catch (error) {
    console.error('[Controller] Error in createGeneratedRecipe:', error);
    res.status(500).json({ message: error.message || 'AI service is temporarily unavailable.' });
  }
};

// @desc    Save recipe to favorites
// @route   POST /api/recipes/save
// @access  Private
const saveRecipe = async (req, res) => {
  try {
    const {
      title, ingredients, instructions, cookingTime,
      difficultyLevel, cuisineType, calories,
      nutritionDetails, servings, tags, image
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Recipe title is required' });
    }

    // Prevent duplicates: same user + same title
    const existing = await Recipe.findOne({ user: req.user._id, title });
    if (existing) {
      return res.status(200).json(existing); // return the already-saved one silently
    }

    const recipe = await Recipe.create({
      user: req.user._id,
      title,
      ingredients: ingredients || [],
      instructions: instructions || [],
      cookingTime,
      difficultyLevel,
      cuisineType,
      calories,
      nutritionDetails,
      servings,
      tags: tags || [],
      image,
    });

    console.log(`[Recipe] Saved: "${recipe.title}" for user ${req.user._id}`);
    res.status(201).json(recipe);
  } catch (error) {
    console.error('[Recipe] saveRecipe error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved recipes (list)
// @route   GET /api/recipes
// @access  Private
const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single saved recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
const getRecipeById = async (req, res) => {
  try {
    console.log(`[Recipe] GET by ID: ${req.params.id}`);
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Ensure the recipe belongs to the requesting user
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this recipe' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error('[Recipe] getRecipeById error:', error.message);
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid recipe ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a saved recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await recipe.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGeneratedRecipe,
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  deleteRecipe,
};
