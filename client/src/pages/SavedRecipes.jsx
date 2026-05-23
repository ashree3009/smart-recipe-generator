import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, Loader2, HeartCrack } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
      const { data } = await axios.get(`${API_URL}/api/recipes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
    setLoading(false);
  };

  const deleteRecipe = async (id) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
      await axios.delete(`${API_URL}/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(recipes.filter(r => r._id !== id));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Saved Recipes</h1>

      {recipes.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center p-12 rounded-2xl text-center">
          <HeartCrack className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No saved recipes yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Generate some recipes and save your favorites to see them here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={recipe._id}
              className="glass rounded-2xl overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                    {recipe.title}
                  </h3>
                  <button
                    onClick={() => deleteRecipe(recipe._id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-primary rounded-md">
                    ⏱ {recipe.cookingTime}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                    📊 {recipe.difficultyLevel}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md">
                    🔥 {recipe.calories}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Key Ingredients:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 list-disc pl-4">
                    {recipe.ingredients.slice(0, 3).map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                    {recipe.ingredients.length > 3 && <li>...and more</li>}
                  </ul>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                <Link
                  to={`/recipe/${recipe._id}`}
                  className="block text-primary hover:text-primary-hover font-medium text-sm w-full text-center"
                >
                  View Full Recipe
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
