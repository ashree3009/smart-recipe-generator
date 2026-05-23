const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  quantity: {
    type: String,
    default: '1',
  },
  unit: {
    type: String,
    default: 'pcs',
    enum: ['pcs', 'kg', 'g', 'liter', 'ml', 'cup', 'tbsp', 'tsp', 'bunch', 'pack', 'other'],
  },
  category: {
    type: String,
    default: 'Others',
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Spices', 'Meat', 'Grains', 'Snacks', 'Others'],
  },
  purchased: {
    type: Boolean,
    default: false,
  },
  note: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const ShoppingItem = mongoose.model('ShoppingItem', shoppingItemSchema);
module.exports = ShoppingItem;
