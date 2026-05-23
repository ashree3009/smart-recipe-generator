import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Heart, ShoppingCart, Bot } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const cards = [
    {
      title: 'Generate Recipe',
      description: 'Turn your ingredients into a delicious meal using AI.',
      icon: Sparkles,
      link: '/generator',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-primary',
    },
    {
      title: 'Saved Recipes',
      description: 'View and manage your favorite saved recipes.',
      icon: Heart,
      link: '/saved',
      color: 'bg-red-100 dark:bg-red-900/30 text-secondary',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Ask culinary questions and get expert advice.',
      icon: Bot,
      link: '/chat',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Shopping List',
      description: 'Manage your ingredients and shopping needs.',
      icon: ShoppingCart,
      link: '/shopping',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👨‍🍳
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          What would you like to cook today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={card.link} className="block group">
                <div className="glass p-6 rounded-2xl h-full border border-transparent group-hover:border-primary/20 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.description}
                  </p>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-white/0 to-white/10 rounded-full blur-xl group-hover:bg-primary/5 transition-colors"></div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
