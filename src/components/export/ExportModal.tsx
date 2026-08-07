import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecordType, Student, ExportOptions } from '../../types';
import { ExportService } from '../../services/exportService';
import { X, Download, FileText, FileSpreadsheet, FileCode, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  recordType: RecordType;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  recordType,
  onClose
}) => {
  const { students, recordEntries, showToast } = useApp();

  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [selectedColIds, setSelectedColIds] = useState<string[]>(
    recordType.columns.map(c => c.id)
  );
  const [teacherName, setTeacherName] = useState('Teacher');
  const [schoolName, setSchoolName] = useState('Central School');
  const [title, setTitle] = useState(recordType.name);

  if (!isOpen) return null;

  const activeStudentsMap = new Map<string, Student>(
    students.map(s => [s.id, s])
  );

  const toggleColumn = (colId: string) => {
    setSelectedColIds(prev => 
      prev.includes(colId) 
        ? prev.filter(id => id !== colId) 
        : [...prev, colId]
    );
  };

  const handleExport = () => {
    if (selectedColIds.length === 0) {
      showToast('Select at least one column to export', 'error');
      return;
    }

    const options: ExportOptions = {
      format,
      includeColumns: selectedColIds,
      title,
      teacherName,
      schoolName
    };

    if (format === 'pdf') {
      ExportService.exportToPDF(recordType, activeStudentsMap, recordEntries, options);
    } else if (format === 'excel') {
      ExportService.exportToExcel(recordType, activeStudentsMap, recordEntries, options);
    } else {
      ExportService.exportToCSV(recordType, activeStudentsMap, recordEntries, options);
    }

    showToast(`Exported ${recordType.name} as ${format.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Export {recordType.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose file format, select columns, and customize header metadata.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 my-2">
          
          {/* Format selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  format === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">PDF Document</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  format === 'excel'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  format === 'csv'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileCode className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">CSV Data</span>
              </button>
            </div>
          </div>

          {/* PDF Metadata */}
          {format === 'pdf' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  School / Grade
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Select Columns */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Include Columns ({selectedColIds.length}/{recordType.columns.length})
              </label>
              <button
                type="button"
                onClick={() => {
                  if (selectedColIds.length === recordType.columns.length) {
                    setSelectedColIds([]);
                  } else {
                    setSelectedColIds(recordType.columns.map(c => c.id));
                  }
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Toggle All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {recordType.columns.map(col => {
                const isSelected = selectedColIds.includes(col.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => toggleColumn(col.id)}
                    className={`p-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors border ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                        : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{col.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
