import React from 'react';
import { ColumnDefinition, ColumnType } from '../../types';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  CheckSquare, 
  Type, 
  Hash, 
  Calendar, 
  ListFilter, 
  AlignLeft, 
  Calculator 
} from 'lucide-react';

interface ColumnEditorProps {
  columns: ColumnDefinition[];
  onChange: (cols: ColumnDefinition[]) => void;
}

export const ColumnEditor: React.FC<ColumnEditorProps> = ({ columns, onChange }) => {

  const handleAddColumn = () => {
    const newCol: ColumnDefinition = {
      id: 'col_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name: `Column ${columns.length + 1}`,
      type: 'text',
      order: columns.length,
      isRequired: false
    };
    onChange([...columns, newCol]);
  };

  const handleUpdateColumn = (id: string, updates: Partial<ColumnDefinition>) => {
    const updated = columns.map(c => {
      if (c.id !== id) return c;
      const col = { ...c, ...updates };

      // Set default formulaConfig if switching to calculated type
      if (updates.type === 'calculated' && !col.formula) {
        col.formula = 'percentage';
      }
      return col;
    });
    onChange(updated);
  };

  const handleDeleteColumn = (id: string) => {
    if (columns.length <= 1) return; // Must have at least 1 column
    const filtered = columns.filter(c => c.id !== id).map((c, idx) => ({ ...c, order: idx }));
    onChange(filtered);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= columns.length) return;

    const list = [...columns];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const reordered = list.map((c, idx) => ({ ...c, order: idx }));
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Custom Columns ({columns.length})
        </label>
        <button
          type="button"
          onClick={handleAddColumn}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Column</span>
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {columns.map((col, idx) => (
          <div
            key={col.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
          >
            {/* Row 1: Move arrows, Name input, Type Selector, Delete */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-slate-400">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 hover:text-indigo-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === columns.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 hover:text-indigo-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Name */}
              <input
                type="text"
                placeholder="Column Header Name"
                value={col.name}
                onChange={(e) => handleUpdateColumn(col.id, { name: e.target.value })}
                className="flex-1 px-3 py-1.5 font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Column Type */}
              <select
                value={col.type}
                onChange={(e) => handleUpdateColumn(col.id, { type: e.target.value as ColumnType })}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="dropdown">Dropdown</option>
                <option value="checkbox">Checkbox</option>
                <option value="longText">Long Text</option>
                <option value="calculated">Calculated Formula</option>
              </select>

              <button
                type="button"
                disabled={columns.length <= 1}
                onClick={() => handleDeleteColumn(col.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Row 2: Type specific options */}
            {col.type === 'dropdown' && (
              <div className="pl-8 pt-1">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Dropdown Options (comma-separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pass, Fail, Retest Needed"
                  value={(col.dropdownOptions || []).join(', ')}
                  onChange={(e) => handleUpdateColumn(col.id, {
                    dropdownOptions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
            )}

            {col.type === 'calculated' && (
              <div className="pl-8 pt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Calculation Type:</span>
                  <select
                    value={col.formula || 'percentage'}
                    onChange={(e) => handleUpdateColumn(col.id, { formula: e.target.value })}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="percentage">Percentage (Score / MaxScore * 100)</option>
                    <option value="grade">Auto Grade (A, B, C, D, F)</option>
                    <option value="sum">Sum of Columns</option>
                    <option value="avg">Average of Columns</option>
                  </select>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};
