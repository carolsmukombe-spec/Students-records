import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_TEMPLATES } from '../../data/defaultTemplates';
import { X, Sparkles, BookOpen, ChevronRight, Plus } from 'lucide-react';

interface TemplateChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomBuilder: () => void;
}

export const TemplateChooserModal: React.FC<TemplateChooserModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomBuilder
}) => {
  const { addRecordType, setCurrentRecordTypeId, setActiveTab } = useApp();

  if (!isOpen) return null;

  const handleSelectTemplate = (template: typeof DEFAULT_TEMPLATES[0]) => {
    const created = addRecordType({
      name: template.name,
      description: template.description,
      columns: template.columns,
      isTemplate: false,
      category: template.category
    });
    setCurrentRecordTypeId(created.id);
    setActiveTab('records');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Choose Record Book Template
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a pre-configured template with suggested columns, or build custom columns.
            </p>
          </div>
        </div>

        {/* Custom Blank Option */}
        <button
          onClick={() => {
            onClose();
            onOpenCustomBuilder();
          }}
          className="p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors text-left flex items-center justify-between mb-4 group shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Start from Scratch (Custom Record Book)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design custom headers, date pickers, dropdown lists, and formulas.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </button>

        {/* 6 Pre-built Templates Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEFAULT_TEMPLATES.map(tpl => (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-slate-400">{tpl.columns.length} columns</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tpl.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[180px]">
                  Cols: {tpl.columns.map(c => c.name).join(', ')}
                </span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                  Use →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm rounded-xl hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
