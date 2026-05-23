import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ChefHat, Flame, Timer, Star, Globe, UtensilsCrossed,
  BarChart3, Loader2, AlertCircle, Sparkles, BookOpen, Printer
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const NutrientCard = ({ label, value, color }) => (
  <div className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border border-transparent shadow-sm hover:shadow-md transition-all duration-300 ${color}`}>
    <p className="text-xl font-extrabold tracking-tight">{value || 'N/A'}</p>
    <p className="text-xs font-semibold uppercase tracking-wider opacity-85 mt-0.5">{label}</p>
  </div>
);

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError('');
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : '';
        
        console.log(`[RecipeDetails] Fetching recipe ID: ${id}`);
        const { data } = await axios.get(`${API_URL}/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[RecipeDetails] Recipe loaded successfully:', data.title);
        setRecipe(data);
      } catch (err) {
        console.error('[RecipeDetails] Error fetching recipe details:', err);
        setError(err.response?.data?.message || 'Failed to load recipe details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Retrieving your favorite recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <div className="p-4 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full mb-6">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
          {error || 'We could not find the recipe you were looking for, or you might not be authorized to view it.'}
        </p>
        <Link
          to="/saved"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Saved Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] transition-colors duration-300 print:bg-white print:py-0">
      
      {/* Back button & Action panel */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700/60 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700/60 transition"
          title="Print Recipe"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-800 print:shadow-none print:border-none"
      >
        {/* Recipe Header Banner */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 md:p-12 relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white -translate-x-12 translate-y-12" />
          </div>
          <div className="relative">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.cuisineType && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1">
                  🌍 {recipe.cuisineType}
                </span>
              )}
              {recipe.difficultyLevel && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> {recipe.difficultyLevel}
                </span>
              )}
              {recipe.tags?.map(tag => (
                <span key={tag} className="bg-white/15 backdrop-blur-sm text-white text-xs px-3.5 py-1.5 rounded-full font-semibold capitalize">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              {recipe.title}
            </h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-2xl font-bold">
                <Timer className="h-4.5 w-4.5" /> {recipe.cookingTime || 'N/A'}
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-2xl font-bold">
                <Flame className="h-4.5 w-4.5" /> {recipe.calories || 'N/A'}
              </div>
              {recipe.servings && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-2xl font-bold">
                  <UtensilsCrossed className="h-4.5 w-4.5" /> {recipe.servings}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Content Body */}
        <div className="p-8 md:p-12 space-y-10">

          {/* Nutrition Section */}
          {recipe.nutritionDetails && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                <BarChart3 className="h-4.5 w-4.5 text-orange-500" /> Nutrition Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NutrientCard
                  label="Protein"
                  value={recipe.nutritionDetails.protein}
                  color="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:border-blue-200 dark:hover:border-blue-900/40"
                />
                <NutrientCard
                  label="Carbohydrates"
                  value={recipe.nutritionDetails.carbs}
                  color="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 hover:border-amber-200 dark:hover:border-amber-900/40"
                />
                <NutrientCard
                  label="Fats"
                  value={recipe.nutritionDetails.fat}
                  color="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 hover:border-red-200 dark:hover:border-red-900/40"
                />
                <NutrientCard
                  label="Fiber"
                  value={recipe.nutritionDetails.fiber}
                  color="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 hover:border-green-200 dark:hover:border-green-900/40"
                />
              </div>
            </div>
          )}

          {/* Main Recipe Detail Splits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Ingredients Side */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                <UtensilsCrossed className="h-4.5 w-4.5 text-orange-500" /> Ingredients
              </h3>
              <div className="space-y-2">
                {recipe.ingredients?.map((ing, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl hover:bg-orange-50/20 dark:hover:bg-orange-950/10 transition border border-gray-100/50 dark:border-gray-700/30"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{ing}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instructions Side */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                <ChefHat className="h-4.5 w-4.5 text-orange-500" /> Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions?.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition border border-gray-100/50 dark:border-gray-700/30"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/25">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-0.5">{step}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default RecipeDetails;
