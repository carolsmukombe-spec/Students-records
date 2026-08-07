import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecordType } from '../../types';
import { 
  FileSpreadsheet, 
  Plus, 
  Copy, 
  Edit3, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Table, 
  Layers 
} from 'lucide-react';
import { RecordTypeBuilderModal } from './RecordTypeBuilderModal';
import { TemplateChooserModal } from './TemplateChooserModal';
import { DataGridScreen } from '../dataEntry/DataGridScreen';
import { ConfirmModal } from '../common/ConfirmModal';

export const RecordTypesScreen: React.FC = () => {
  const { 
    recordTypes, 
    currentRecordTypeId, 
    setCurrentRecordTypeId, 
    duplicateRecordType, 
    deleteRecordType 
  } = useApp();

  const [showChooserModal, setShowChooserModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [recordTypeToEdit, setRecordTypeToEdit] = useState<RecordType | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'grid' | 'manage'>('grid');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const currentRt = recordTypes.find(rt => rt.id === currentRecordTypeId) || recordTypes[0];

  return (
    <div className="space-y-5 pb-12 animate-in fade-in">
      
      {/* Top Controls & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Record Books</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Offline data entry grid with sticky student column & custom column definitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab Switcher */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Data Entry Grid</span>
            </button>

            <button
              onClick={() => setActiveSubTab('manage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'manage'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Manage Books ({recordTypes.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowChooserModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Record Book</span>
          </button>
        </div>
      </div>

      {/* Main SubTab Content */}
      {activeSubTab === 'grid' ? (
        <DataGridScreen onOpenChooser={() => setShowChooserModal(true)} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recordTypes.map(rt => {
              const isSelected = rt.id === currentRecordTypeId;
              return (
                <div
                  key={rt.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {rt.category || 'Academic'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{rt.columns.length} columns</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {rt.name}
                    </h3>
                    {rt.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {rt.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {rt.columns.map(c => (
                        <span key={c.id} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentRecordTypeId(rt.id);
                        setActiveSubTab('grid');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors"
                    >
                      Open Grid →
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateRecordType(rt.id)}
                        title="Duplicate Record Book"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setRecordTypeToEdit(rt);
                          setShowBuilderModal(true);
                        }}
                        title="Edit Structure"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(rt.id)}
                        disabled={recordTypes.length <= 1}
                        title="Delete Record Book"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <TemplateChooserModal
        isOpen={showChooserModal}
        onClose={() => setShowChooserModal(false)}
        onOpenCustomBuilder={() => {
          setRecordTypeToEdit(null);
          setShowBuilderModal(true);
        }}
      />

      <RecordTypeBuilderModal
        isOpen={showBuilderModal}
        recordTypeToEdit={recordTypeToEdit}
        onClose={() => {
          setShowBuilderModal(false);
          setRecordTypeToEdit(null);
        }}
      />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Record Book?"
        message="Are you sure you want to delete this Record Book? All logged cell data for this book will be permanently removed."
        confirmLabel="Delete Record Book"
        onConfirm={() => {
          if (deleteTargetId) deleteRecordType(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
