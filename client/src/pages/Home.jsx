import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat, Sparkles, Utensils } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75"></div>
            <div className="relative bg-white dark:bg-gray-900 p-4 rounded-full">
              <ChefHat className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
          Cook Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
          Turn the ingredients in your fridge into delicious recipes in seconds. 
          Personalized to your taste, diet, and cooking skills.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
          >
            <Sparkles className="h-5 w-5" />
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-8 py-4 rounded-xl text-lg font-bold transition-all"
          >
            <Utensils className="h-5 w-5" />
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
