import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Plus, Trash2, Check, Edit3, X, Filter,
  Search, Package, Loader2, ChevronDown, ShoppingBag,
  RotateCcw, AlertCircle, CheckCircle2, ClipboardList,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Meat', 'Grains', 'Snacks', 'Others'];
const UNITS = ['pcs', 'kg', 'g', 'liter', 'ml', 'cup', 'tbsp', 'tsp', 'bunch', 'pack', 'other'];

const CATEGORY_COLORS = {
  Vegetables: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Fruits:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Dairy:      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Spices:     'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Meat:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Grains:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Snacks:     'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Others:     'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const CATEGORY_ICONS = {
  Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛', Spices: '🌶️',
  Meat: '🥩', Grains: '🌾', Snacks: '🍿', Others: '🛒',
};

const EMPTY_FORM = { name: '', quantity: '1', unit: 'pcs', category: 'Others', note: '' };

function getToken() {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u).token : '';
  } catch { return ''; }
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ─── Add / Edit Form ─────────────────────────────────────────────────────────
const ItemForm = ({ initial = EMPTY_FORM, onSubmit, onCancel, isEdit }) => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
    if (!isEdit) setForm(EMPTY_FORM);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div className="sm:col-span-2">
          <input
            type="text"
            required
            placeholder="Item name (e.g. Tomatoes)"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none transition"
          />
        </div>
        {/* Quantity */}
        <input
          type="text"
          placeholder="Quantity (e.g. 2)"
          value={form.quantity}
          onChange={e => set('quantity', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none transition"
        />
        {/* Unit */}
        <select
          value={form.unit}
          onChange={e => set('unit', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none transition"
        >
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        {/* Category */}
        <div className="sm:col-span-2">
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none transition"
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
          </select>
        </div>
        {/* Note */}
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Optional note..."
            value={form.note}
            onChange={e => set('note', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none transition"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Cancel
          </button>
        )}
        <button
          type="submit" disabled={submitting}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/25 transition disabled:opacity-60">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

// ─── Single Shopping Item Row ─────────────────────────────────────────────────
const ShoppingItemRow = ({ item, onToggle, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(item._id);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(item._id);
    setDeleting(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
        item.purchased
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 opacity-70'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-md'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle} disabled={toggling}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          item.purchased
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 dark:border-gray-500 hover:border-orange-400'
        }`}
      >
        {toggling
          ? <Loader2 className="h-3 w-3 animate-spin text-white" />
          : item.purchased && <Check className="h-3 w-3 text-white" />
        }
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold text-sm ${item.purchased ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {item.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {item.quantity} {item.unit}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Others}`}>
            {CATEGORY_ICONS[item.category]} {item.category}
          </span>
        </div>
        {item.note && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{item.note}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition"
          title="Edit"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDelete} disabled={deleting}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition"
          title="Delete"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Stats Bar ───────────────────────────────────────────────────────────────
const StatsBar = ({ items }) => {
  const total = items.length;
  const purchased = items.filter(i => i.purchased).length;
  const pending = total - purchased;
  const pct = total > 0 ? Math.round((purchased / total) * 100) : 0;

  return (
    <div className="glass rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Items</p>
        </div>
        <div className="text-center border-x border-gray-100 dark:border-gray-700">
          <p className="text-2xl font-bold text-orange-500">{pending}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">{purchased}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Purchased</p>
        </div>
      </div>
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>Shopping Progress</span>
          <span className="font-semibold text-green-500">{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main Shopping List Page ──────────────────────────────────────────────────
const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmClear, setConfirmClear] = useState(null); // 'purchased' | 'all'

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchItems = useCallback(async () => {
    try {
      setError('');
      const { data } = await axios.get(`${API_URL}/api/shopping`, { headers: authHeaders() });
      setItems(data);
    } catch (err) {
      console.error('[ShoppingList] fetchItems error:', err);
      setError(err.response?.data?.message || 'Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async (form) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/shopping`, form, { headers: authHeaders() });
      setItems(prev => [data, ...prev]);
      setShowAddForm(false);
      flash('Item added to your shopping list!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleEdit = async (form) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/shopping/${editingItem._id}`, form, { headers: authHeaders() });
      setItems(prev => prev.map(i => i._id === data._id ? data : i));
      setEditingItem(null);
      flash('Item updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await axios.patch(`${API_URL}/api/shopping/${id}/toggle`, {}, { headers: authHeaders() });
      setItems(prev => prev.map(i => i._id === data._id ? data : i));
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/shopping/${id}`, { headers: authHeaders() });
      setItems(prev => prev.filter(i => i._id !== id));
      flash('Item removed');
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleClearPurchased = async () => {
    try {
      await axios.delete(`${API_URL}/api/shopping/purchased`, { headers: authHeaders() });
      setItems(prev => prev.filter(i => !i.purchased));
      setConfirmClear(null);
      flash('Purchased items cleared!');
    } catch (err) {
      setError('Failed to clear purchased items');
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(`${API_URL}/api/shopping/all`, { headers: authHeaders() });
      setItems([]);
      setConfirmClear(null);
      flash('Shopping list cleared!');
    } catch (err) {
      setError('Failed to clear list');
    }
  };

  // Filter & search
  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Group by category for display
  const grouped = CATEGORIES.filter(c => c !== 'All').reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  const hasPurchased = items.some(i => i.purchased);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/30">
              <ShoppingCart className="h-6 w-6 text-white" />
            </span>
            Shopping List
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 ml-1">
            Manage your ingredients and grocery needs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasPurchased && (
            <button
              onClick={() => setConfirmClear('purchased')}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Clear Purchased
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={() => setConfirmClear('all')}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Clear All
            </button>
          )}
          <button
            onClick={() => { setShowAddForm(f => !f); setEditingItem(null); }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition text-sm"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>
      </div>

      {/* ── Notifications ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-xl text-green-700 dark:text-green-400 text-sm"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Clear Dialog ── */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                {confirmClear === 'all' ? 'Clear Entire List?' : 'Clear Purchased Items?'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                {confirmClear === 'all'
                  ? 'This will permanently remove all items from your shopping list.'
                  : 'This will remove all items you have marked as purchased.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmClear(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Cancel
                </button>
                <button
                  onClick={confirmClear === 'all' ? handleClearAll : handleClearPurchased}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/20 transition">
                  Yes, Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Form ── */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl p-5 mb-6 border border-orange-100 dark:border-orange-900/30">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-orange-500" />
                Add New Item
              </h3>
              <ItemForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats ── */}
      {items.length > 0 && <StatsBar items={items} />}

      {/* ── Search & Category Filter ── */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none transition text-sm"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 flex-nowrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-xs px-3 py-2 rounded-xl font-medium transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat !== 'All' && `${CATEGORY_ICONS[cat]} `}{cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── List Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-3" />
          <p className="text-gray-400 text-sm">Loading your shopping list...</p>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-7xl mb-5">🛒</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your list is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-6">
            Start by adding ingredients you need to buy. You can also auto-add missing ingredients from your saved recipes.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-red-600"
          >
            <Plus className="h-5 w-5" />
            Add First Ingredient
          </button>
        </motion.div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No items match your search</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="mt-3 text-orange-500 hover:text-orange-600 text-sm font-medium transition">
            Clear filters
          </button>
        </div>
      ) : (
        /* Grouped List */
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{cat}</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium ml-1">
                  {catItems.length}
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700 ml-2" />
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {catItems.map(item => (
                    editingItem?._id === item._id ? (
                      <motion.div
                        key={`edit-${item._id}`}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="glass rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30"
                      >
                        <p className="text-xs text-blue-500 font-semibold mb-3 flex items-center gap-1">
                          <Edit3 className="h-3 w-3" /> Editing: {item.name}
                        </p>
                        <ItemForm
                          initial={editingItem}
                          onSubmit={handleEdit}
                          onCancel={() => setEditingItem(null)}
                          isEdit
                        />
                      </motion.div>
                    ) : (
                      <ShoppingItemRow
                        key={item._id}
                        item={item}
                        onToggle={handleToggle}
                        onEdit={setEditingItem}
                        onDelete={handleDelete}
                      />
                    )
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tip Banner ── */}
      {items.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
          <p className="text-xs text-orange-700 dark:text-orange-300 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 flex-shrink-0" />
            <span>
              <strong>Tip:</strong> When generating a recipe, click "Add Missing to Shopping List" to automatically add required ingredients you don't have.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
