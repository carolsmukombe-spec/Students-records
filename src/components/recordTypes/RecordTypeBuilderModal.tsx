import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RecordType, ColumnDefinition } from '../../types';
import { ColumnEditor } from './ColumnEditor';
import { X, FileSpreadsheet, Sparkles, BookOpen } from 'lucide-react';

interface RecordTypeBuilderModalProps {
  isOpen: boolean;
  recordTypeToEdit?: RecordType | null;
  onClose: () => void;
}

export const RecordTypeBuilderModal: React.FC<RecordTypeBuilderModalProps> = ({
  isOpen,
  recordTypeToEdit,
  onClose
}) => {
  const { addRecordType, updateRecordType } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);

  useEffect(() => {
    if (recordTypeToEdit) {
      setName(recordTypeToEdit.name);
      setDescription(recordTypeToEdit.description || '');
      setCategory(recordTypeToEdit.category || 'Academic');
      setColumns(recordTypeToEdit.columns || []);
    } else {
      setName('');
      setDescription('');
      setCategory('Academic');
      setColumns([
        { id: 'col_date', name: 'Date', type: 'date', order: 0, isRequired: true, defaultValue: 'today' },
        { id: 'col_score', name: 'Score', type: 'number', order: 1, defaultValue: 0 },
        { id: 'col_notes', name: 'Notes', type: 'longText', order: 2 }
      ]);
    }
  }, [recordTypeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || columns.length === 0) return;

    if (recordTypeToEdit) {
      updateRecordType(recordTypeToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        category,
        columns
      });
    } else {
      addRecordType({
        name: name.trim(),
        description: description.trim(),
        category,
        columns,
        isTemplate: false
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {recordTypeToEdit ? 'Edit Record Book' : 'Create Custom Record Book'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize name, category, and structure of spreadsheet columns.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Record Book Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Science Lab Performance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="Academic">Academic</option>
                <option value="Literacy">Literacy</option>
                <option value="Intervention">Intervention</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Reports">Reports</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Track lab experiment safety and participation"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2">
            <ColumnEditor columns={columns} onChange={setColumns} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors"
            >
              {recordTypeToEdit ? 'Save Changes' : 'Create Record Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
