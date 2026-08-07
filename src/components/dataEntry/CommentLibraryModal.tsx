import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, MessageSquare, Plus, Check, Tag } from 'lucide-react';

interface CommentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComment: (commentText: string) => void;
}

export const CommentLibraryModal: React.FC<CommentLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectComment
}) => {
  const { commentLibrary, addComment, incrementCommentUsage } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Add phrase state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState('Academic');

  if (!isOpen) return null;

  const categories = Array.from(new Set(commentLibrary.map(c => c.category)));

  const filteredComments = commentLibrary.filter(c => {
    if (selectedCategory && c.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.text.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.usageCount - a.usageCount);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addComment(newText.trim(), newCat);
    setNewText('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Teacher Comment Library
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap any saved comment phrase to insert it directly into the active cell.
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-2 mb-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search comments or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {filteredComments.map(item => (
            <div
              key={item.id}
              onClick={() => {
                incrementCommentUsage(item.id);
                onSelectComment(item.text);
                onClose();
              }}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 flex items-start justify-between gap-3 group"
            >
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  "{item.text}"
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 inline-block">
                  {item.category} • Used {item.usageCount} times
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                Insert →
              </span>
            </div>
          ))}
        </div>

        {/* Add New Phrase Form toggle */}
        {showAddForm ? (
          <form onSubmit={handleAdd} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0">
            <input
              type="text"
              required
              placeholder="Enter new comment phrase..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                <option value="Academic">Academic</option>
                <option value="Behavior">Behavior</option>
                <option value="Reading">Reading</option>
                <option value="Math">Math</option>
                <option value="General">General</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-xs"
                >
                  Save Phrase
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Phrase</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
