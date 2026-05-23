import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Loader2, Save, Check, ShoppingCart, X, Plus,
  ChefHat, Clock, Leaf, Search, Flame, Globe, Star,
  UtensilsCrossed, Timer, BarChart3, Zap, AlertCircle,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── Data ────────────────────────────────────────────────────────────────────

const CUISINES = [
  { id: 'Any',           label: 'Any',            emoji: '🌍' },
  { id: 'Indian',        label: 'Indian',          emoji: '🇮🇳' },
  { id: 'Italian',       label: 'Italian',         emoji: '🇮🇹' },
  { id: 'Chinese',       label: 'Chinese',         emoji: '🇨🇳' },
  { id: 'Mexican',       label: 'Mexican',         emoji: '🇲🇽' },
  { id: 'Thai',          label: 'Thai',            emoji: '🇹🇭' },
  { id: 'American',      label: 'American',        emoji: '🇺🇸' },
  { id: 'Mediterranean', label: 'Mediterranean',   emoji: '🫒' },
  { id: 'Korean',        label: 'Korean',          emoji: '🇰🇷' },
  { id: 'Japanese',      label: 'Japanese',        emoji: '🇯🇵' },
];

const COOKING_TIMES = [
  { id: 'Any',           label: 'Any Time',   icon: '∞' },
  { id: 'under 15 minutes', label: '< 15 min', icon: '⚡' },
  { id: 'under 30 minutes', label: '< 30 min', icon: '🏃' },
  { id: 'under 1 hour',  label: '< 1 hour',   icon: '🕐' },
];

const DIET_PREFS = [
  { id: 'Vegetarian',  label: 'Vegetarian',  emoji: '🥗' },
  { id: 'Vegan',       label: 'Vegan',       emoji: '🌱' },
  { id: 'High Protein',label: 'High Protein',emoji: '💪' },
  { id: 'Keto',        label: 'Keto',        emoji: '🥑' },
  { id: 'Low Carb',    label: 'Low Carb',    emoji: '📉' },
  { id: 'Gluten Free', label: 'Gluten Free', emoji: '🌾' },
  { id: 'Dairy Free',  label: 'Dairy Free',  emoji: '🚫🥛' },
  { id: 'Non-Veg',     label: 'Non-Veg',     emoji: '🍗' },
];

// Large ingredient suggestion dataset
const INGREDIENT_SUGGESTIONS = [
  // Vegetables
  'Tomato','Onion','Garlic','Potato','Spinach','Broccoli','Carrot','Capsicum',
  'Cauliflower','Cabbage','Cucumber','Zucchini','Eggplant','Mushroom','Peas',
  'Corn','Beetroot','Radish','Celery','Leek','Asparagus','Artichoke',
  'Sweet Potato','Pumpkin','Butternut Squash','Bell Pepper','Kale','Lettuce',
  // Fruits
  'Lemon','Lime','Orange','Apple','Banana','Mango','Pineapple','Avocado',
  'Tomato Cherry','Strawberry','Blueberry','Raspberry','Grapes','Watermelon',
  // Protein / Meat
  'Chicken Breast','Chicken Thighs','Ground Chicken','Beef','Ground Beef',
  'Lamb','Pork','Bacon','Salmon','Tuna','Shrimp','Crab','Tofu','Tempeh',
  'Eggs','Paneer','Chickpeas','Lentils','Black Beans','Kidney Beans',
  // Dairy
  'Milk','Butter','Cheese','Mozzarella','Parmesan','Cheddar','Feta',
  'Cream Cheese','Greek Yogurt','Heavy Cream','Sour Cream','Ricotta',
  // Grains
  'Rice','Basmati Rice','Brown Rice','Pasta','Spaghetti','Penne',
  'Bread','Flour','Whole Wheat Flour','Oats','Quinoa','Couscous',
  'Noodles','Ramen Noodles','Tortilla','Pita Bread','Cornmeal',
  // Spices & Herbs
  'Salt','Pepper','Cumin','Turmeric','Paprika','Chili Powder','Coriander',
  'Garam Masala','Oregano','Basil','Thyme','Rosemary','Bay Leaf','Cardamom',
  'Cinnamon','Cloves','Nutmeg','Saffron','Star Anise','Ginger','Chilli',
  // Sauces & Condiments
  'Olive Oil','Soy Sauce','Fish Sauce','Tomato Sauce','Coconut Milk',
  'Vinegar','Honey','Maple Syrup','Mustard','Ketchup','Mayonnaise',
  'Hot Sauce','Sriracha','Pesto','Hummus','Tahini','Worcestershire Sauce',
  // Nuts & Seeds
  'Almonds','Cashews','Walnuts','Peanuts','Sesame Seeds','Sunflower Seeds',
  'Pumpkin Seeds','Chia Seeds','Flax Seeds',
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function getToken() {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u).token : '';
  } catch { return ''; }
}
function authHeaders() { return { Authorization: `Bearer ${getToken()}` }; }

// ─── Sub-components ───────────────────────────────────────────────────────────

// Skeleton loader for recipe result
const RecipeSkeleton = () => (
  <div className="glass rounded-3xl p-6 md:p-10 animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4" />
    <div className="flex gap-3">
      {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-24" />)}
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
        </div>
      </div>
    </div>
    <div className="space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
    </div>
  </div>
);

// Ingredient tag input with autocomplete
const IngredientInput = ({ ingredients, setIngredients }) => {
  const [inputVal, setInputVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef(null);
  const suggestRef = useRef(null);
  const debounceRef = useRef(null);

  const getSuggestions = useCallback((val) => {
    if (!val.trim() || val.length < 1) { setSuggestions([]); return; }
    const q = val.toLowerCase();
    const filtered = INGREDIENT_SUGGESTIONS.filter(s =>
      s.toLowerCase().includes(q) && !ingredients.includes(s)
    ).slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [ingredients]);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputVal(val);
    setHighlightIdx(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => getSuggestions(val), 150);
  };

  const addIngredient = (val) => {
    const trimmed = val.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients(prev => [...prev, trimmed]);
    }
    setInputVal('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightIdx(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (highlightIdx >= 0) addIngredient(suggestions[highlightIdx]); else if (inputVal.trim()) addIngredient(inputVal); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, -1)); }
    if (e.key === 'Escape') { setShowSuggestions(false); setHighlightIdx(-1); }
    if (e.key === ',' || e.key === 'Tab') { e.preventDefault(); if (inputVal.trim()) addIngredient(inputVal); }
    if (e.key === 'Backspace' && !inputVal && ingredients.length > 0) {
      setIngredients(prev => prev.slice(0, -1));
    }
  };

  const removeIngredient = (ing) => setIngredients(prev => prev.filter(i => i !== ing));

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!suggestRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div>
      {/* Tags */}
      <div className={`flex flex-wrap gap-2 p-3 min-h-[52px] rounded-2xl border-2 transition-colors bg-white dark:bg-gray-800 ${
        ingredients.length > 0 ? 'border-orange-300 dark:border-orange-700' : 'border-gray-200 dark:border-gray-600'
      } focus-within:border-orange-400 dark:focus-within:border-orange-500`}>
        {ingredients.map(ing => (
          <motion.span
            key={ing}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-xl text-sm font-medium shadow-sm shadow-orange-500/20"
          >
            {ing}
            <button type="button" onClick={() => removeIngredient(ing)} className="hover:bg-white/20 rounded-full p-0.5 transition">
              <X className="h-3 w-3" />
            </button>
          </motion.span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => inputVal && getSuggestions(inputVal)}
          placeholder={ingredients.length === 0 ? 'Type ingredient, then press Enter or comma...' : 'Add more...'}
          className="flex-1 min-w-[160px] outline-none text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-400"
        />
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestRef}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl shadow-black/10 overflow-hidden"
          >
            {suggestions.map((s, i) => (
              <button
                key={s} type="button"
                onMouseDown={() => addIngredient(s)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  i === highlightIdx
                    ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-400">+</span> {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-gray-400 mt-2">
        Press <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-xs">Enter</kbd> or <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-xs">,</kbd> to add. Backspace to remove last.
      </p>
    </div>
  );
};

// Section wrapper card
const SectionCard = ({ icon: Icon, title, children, accent = 'orange' }) => (
  <div className="glass rounded-2xl p-5">
    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 uppercase tracking-wider">
      <Icon className={`h-4 w-4 text-${accent}-500`} />
      {title}
    </h3>
    {children}
  </div>
);

// Nutrition pill
const NutrientCard = ({ label, value, color }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${color}`}>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs opacity-70 font-medium">{label}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState('Any');
  const [cookingTime, setCookingTime] = useState('Any');
  const [dietPrefs, setDietPrefs] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');

  const toggleDiet = (id) => setDietPrefs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  // Rotating loading messages
  const LOADING_MSGS = [
    '🧑‍🍳 Our AI chef is analysing your ingredients...',
    '🔥 Heating up the virtual kitchen...',
    '✨ Crafting the perfect recipe for you...',
    '🌿 Balancing flavours and nutrition...',
    '📝 Writing step-by-step instructions...',
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (ingredients.length === 0) { setError('Please add at least one ingredient.'); return; }

    setLoading(true);
    setError('');
    setRecipe(null);
    setSaved(false);
    setAddedToCart(false);
    let msgIdx = 0;
    setLoadingMsg(LOADING_MSGS[0]);
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[msgIdx]);
    }, 2200);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/recipes/generate`,
        { ingredients, cuisine: cuisine !== 'Any' ? cuisine : undefined, dietPreferences: dietPrefs, cookingTime: cookingTime !== 'Any' ? cookingTime : undefined },
        { headers: authHeaders() }
      );
      setRecipe(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recipe. Please try again.');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/recipes/save`, recipe, { headers: authHeaders() });
      setSaved(true);
    } catch (err) {
      setError('Failed to save recipe.');
    }
    setSaving(false);
  };

  const handleAddToShoppingList = async () => {
    if (!recipe?.ingredients) return;
    setAddingToCart(true);
    try {
      const items = recipe.ingredients.map(ing => ({ name: ing, quantity: '1', unit: 'pcs', category: 'Others' }));
      await axios.post(`${API_URL}/api/shopping/bulk`, { items }, { headers: authHeaders() });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      setError('Failed to add ingredients to shopping list.');
    }
    setAddingToCart(false);
  };

  const hasFilters = cuisine !== 'Any' || cookingTime !== 'Any' || dietPrefs.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-orange-500/30 mb-4"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Recipe Generator
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3"
          >
            What's in your{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">kitchen?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto"
          >
            Tell our AI chef your ingredients, preferences, and constraints — get a gourmet recipe in seconds.
          </motion.p>
        </div>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT PANEL — Controls */}
          <div className="lg:col-span-2 space-y-4">

            {/* Ingredients */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <SectionCard icon={UtensilsCrossed} title="Your Ingredients" accent="orange">
                <div className="relative">
                  <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                </div>

                {/* Quick-add popular ingredients */}
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Quick add popular:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Chicken', 'Tomato', 'Onion', 'Garlic', 'Eggs', 'Pasta', 'Rice', 'Paneer'].map(s => (
                      <button key={s} type="button"
                        onClick={() => !ingredients.includes(s) && setIngredients(p => [...p, s])}
                        disabled={ingredients.includes(s)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition ${
                          ingredients.includes(s)
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 border-orange-200 dark:border-orange-800 cursor-default'
                            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-300 hover:text-orange-500 bg-white dark:bg-gray-800'
                        }`}
                      >
                        {ingredients.includes(s) ? <Check className="inline h-3 w-3 mr-0.5" /> : <Plus className="inline h-3 w-3 mr-0.5" />}{s}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </motion.div>

            {/* Cuisine */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <SectionCard icon={Globe} title="Cuisine Style" accent="blue">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CUISINES.map(c => (
                    <button key={c.id} type="button" onClick={() => setCuisine(c.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        cuisine === c.id
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/10'
                          : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                      }`}
                    >
                      <span className="text-base">{c.emoji}</span> {c.label}
                    </button>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

            {/* Cooking Time */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <SectionCard icon={Clock} title="Cooking Time" accent="purple">
                <div className="grid grid-cols-2 gap-2">
                  {COOKING_TIMES.map(t => (
                    <button key={t.id} type="button" onClick={() => setCookingTime(t.id)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold border-2 transition-all ${
                        cookingTime === t.id
                          ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md shadow-purple-500/10'
                          : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
                      }`}
                    >
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

            {/* Diet Preferences */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <SectionCard icon={Leaf} title="Diet Preference" accent="green">
                <div className="flex flex-wrap gap-2">
                  {DIET_PREFS.map(d => (
                    <button key={d.id} type="button" onClick={() => toggleDiet(d.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        dietPrefs.includes(d.id)
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm shadow-green-500/20'
                          : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-green-200 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                      }`}
                    >
                      {d.emoji} {d.label}
                    </button>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

            {/* Active Filters Summary */}
            {hasFilters && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="px-4 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/50 text-xs text-orange-700 dark:text-orange-300"
              >
                <Zap className="inline h-3.5 w-3.5 mr-1" />
                <strong>Active filters:</strong>{' '}
                {[cuisine !== 'Any' && cuisine, cookingTime !== 'Any' && cookingTime, ...dietPrefs].filter(Boolean).join(' · ')}
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800/50 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
                <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
              </div>
            )}

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={loading || ingredients.length === 0}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-xl shadow-orange-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate My Recipe
                </>
              )}
            </motion.button>
          </div>

          {/* RIGHT PANEL — Result */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">

              {/* Loading State */}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col items-center justify-center text-center py-10 mb-6">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-pulse">
                        <ChefHat className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -right-1 -top-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                        <Sparkles className="h-3 w-3 text-yellow-900" />
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-sm max-w-xs transition-all duration-500">
                      {loadingMsg}
                    </p>
                  </div>
                  <RecipeSkeleton />
                </motion.div>
              )}

              {/* Recipe Result */}
              {!loading && recipe && (
                <motion.div
                  key="recipe"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="glass rounded-3xl overflow-hidden"
                >
                  {/* Recipe Header */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-7 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white translate-x-16 -translate-y-16" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white -translate-x-8 translate-y-8" />
                    </div>
                    <div className="relative">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {recipe.cuisineType && (
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            🌍 {recipe.cuisineType}
                          </span>
                        )}
                        {recipe.difficultyLevel && (
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3" /> {recipe.difficultyLevel}
                          </span>
                        )}
                        {recipe.tags?.map(tag => (
                          <span key={tag} className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium capitalize">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
                        {recipe.title}
                      </h1>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-xl font-medium">
                          <Timer className="h-4 w-4" /> {recipe.cookingTime}
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-xl font-medium">
                          <Flame className="h-4 w-4" /> {recipe.calories}
                        </div>
                        {recipe.servings && (
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-xl font-medium">
                            <UtensilsCrossed className="h-4 w-4" /> {recipe.servings}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-7 py-4 flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleAddToShoppingList}
                      disabled={addingToCart || addedToCart}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm transition-all ${
                        addedToCart
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800/50'
                      }`}
                    >
                      {addingToCart ? <Loader2 className="h-4 w-4 animate-spin" /> : addedToCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                      {addingToCart ? 'Adding...' : addedToCart ? 'Added to List!' : 'Add to Shopping List'}
                    </button>
                    <button
                      onClick={handleSaveRecipe}
                      disabled={saving || saved}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm transition-all ${
                        saved
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Recipe'}
                    </button>
                    <button
                      onClick={() => { setRecipe(null); setSaved(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition ml-auto"
                    >
                      <X className="h-4 w-4" /> New Recipe
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-7 space-y-8">

                    {/* Nutrition */}
                    {recipe.nutritionDetails && (
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          <BarChart3 className="h-4 w-4" /> Nutrition Per Serving
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          <NutrientCard label="Protein" value={recipe.nutritionDetails.protein} color="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" />
                          <NutrientCard label="Carbs"   value={recipe.nutritionDetails.carbs}   color="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" />
                          <NutrientCard label="Fat"     value={recipe.nutritionDetails.fat}     color="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" />
                          <NutrientCard label="Fiber"   value={recipe.nutritionDetails.fiber}   color="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" />
                        </div>
                      </div>
                    )}

                    {/* Ingredients */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        <UtensilsCrossed className="h-4 w-4" /> Ingredients
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recipe.ingredients.map((ing, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl"
                          >
                            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{ing}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        <ChefHat className="h-4 w-4" /> Step-by-Step Instructions
                      </h3>
                      <ol className="space-y-3">
                        {recipe.instructions.map((step, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors"
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/30">
                              {i + 1}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1">{step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && !recipe && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] text-center glass rounded-3xl p-12"
                >
                  <div className="relative mb-6">
                    <div className="text-8xl animate-bounce" style={{ animationDuration: '2.5s' }}>👨‍🍳</div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute -top-2 -right-2 text-3xl"
                    >✨</motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Your Recipe Awaits
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm leading-relaxed mb-8">
                    Add your ingredients on the left, choose your cuisine style and preferences, then hit <strong>Generate My Recipe</strong> to get a professional AI-crafted dish.
                  </p>
                  <div className="grid grid-cols-3 gap-4 w-full max-w-xs text-center">
                    {[
                      { icon: '🥕', label: 'Add Ingredients' },
                      { icon: '⚙️', label: 'Set Preferences' },
                      { icon: '✨', label: 'Get Recipe' },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="text-3xl">{step.icon}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{step.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
