const ShoppingItem = require('../models/ShoppingItem');

// @desc    Get all shopping items for user
// @route   GET /api/shopping
// @access  Private
const getShoppingItems = async (req, res) => {
  try {
    console.log(`[Shopping] GET request from user: ${req.user._id}`);
    const items = await ShoppingItem.find({ user: req.user._id }).sort({ purchased: 1, createdAt: -1 });
    console.log(`[Shopping] Returning ${items.length} items`);
    res.status(200).json(items);
  } catch (error) {
    console.error('[Shopping] getShoppingItems error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a shopping item
// @route   POST /api/shopping
// @access  Private
const addShoppingItem = async (req, res) => {
  try {
    const { name, quantity, unit, category, note } = req.body;
    console.log(`[Shopping] ADD item: ${name} | user: ${req.user._id}`);

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Item name is required' });
    }

    const item = await ShoppingItem.create({
      user: req.user._id,
      name: name.trim(),
      quantity: quantity || '1',
      unit: unit || 'pcs',
      category: category || 'Others',
      note: note || '',
    });

    console.log(`[Shopping] Item created: ${item._id}`);
    res.status(201).json(item);
  } catch (error) {
    console.error('[Shopping] addShoppingItem error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk add shopping items (from recipe auto-generation)
// @route   POST /api/shopping/bulk
// @access  Private
const bulkAddShoppingItems = async (req, res) => {
  try {
    const { items } = req.body;
    console.log(`[Shopping] BULK ADD ${items?.length} items | user: ${req.user._id}`);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const toInsert = items.map(item => ({
      user: req.user._id,
      name: item.name.trim(),
      quantity: item.quantity || '1',
      unit: item.unit || 'pcs',
      category: item.category || 'Others',
      note: item.note || '',
    }));

    const created = await ShoppingItem.insertMany(toInsert);
    console.log(`[Shopping] Bulk created ${created.length} items`);
    res.status(201).json(created);
  } catch (error) {
    console.error('[Shopping] bulkAddShoppingItems error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a shopping item
// @route   PUT /api/shopping/:id
// @access  Private
const updateShoppingItem = async (req, res) => {
  try {
    console.log(`[Shopping] UPDATE item: ${req.params.id}`);
    const item = await ShoppingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await ShoppingItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error('[Shopping] updateShoppingItem error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle purchased status
// @route   PATCH /api/shopping/:id/toggle
// @access  Private
const togglePurchased = async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    item.purchased = !item.purchased;
    await item.save();
    console.log(`[Shopping] Toggled item ${item._id} -> purchased: ${item.purchased}`);
    res.status(200).json(item);
  } catch (error) {
    console.error('[Shopping] togglePurchased error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a shopping item
// @route   DELETE /api/shopping/:id
// @access  Private
const deleteShoppingItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    console.log(`[Shopping] Deleted item: ${req.params.id}`);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('[Shopping] deleteShoppingItem error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all purchased items
// @route   DELETE /api/shopping/purchased
// @access  Private
const clearPurchasedItems = async (req, res) => {
  try {
    const result = await ShoppingItem.deleteMany({ user: req.user._id, purchased: true });
    console.log(`[Shopping] Cleared ${result.deletedCount} purchased items`);
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('[Shopping] clearPurchasedItems error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire shopping list
// @route   DELETE /api/shopping/all
// @access  Private
const clearAllItems = async (req, res) => {
  try {
    const result = await ShoppingItem.deleteMany({ user: req.user._id });
    console.log(`[Shopping] Cleared all ${result.deletedCount} items`);
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('[Shopping] clearAllItems error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShoppingItems,
  addShoppingItem,
  bulkAddShoppingItems,
  updateShoppingItem,
  togglePurchased,
  deleteShoppingItem,
  clearPurchasedItems,
  clearAllItems,
};
