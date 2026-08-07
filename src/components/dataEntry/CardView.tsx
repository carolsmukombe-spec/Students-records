import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecordType, Student } from '../../types';
import { ChevronLeft, ChevronRight, Check, MessageSquare, Sparkles, Copy } from 'lucide-react';
import { CalculationService } from '../../services/calculationService';

interface CardViewProps {
  recordType: RecordType;
  students: Student[];
  onOpenCommentLibrary: (colId: string) => void;
}

export const CardView: React.FC<CardViewProps> = ({
  recordType,
  students,
  onOpenCommentLibrary
}) => {
  const { recordEntries, updateCell, copyPreviousRow } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (students.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active students to display in Card View.</p>
      </div>
    );
  }

  const currentStudent = students[currentIndex];
  const activeEntry = recordEntries.find(
    e => e.recordTypeId === recordType.id && e.studentId === currentStudent?.id
  );
  const data = activeEntry?.data || {};

  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      
      {/* Student Navigation Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Student {currentIndex + 1} of {students.length}
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {currentStudent.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            ID: {currentStudent.studentId || '-'}
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === students.length - 1}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Copy previous entry shortcut */}
      <div className="flex justify-end">
        <button
          onClick={() => copyPreviousRow(recordType.id, currentStudent.id)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Previous Row Entry</span>
        </button>
      </div>

      {/* Column Inputs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        {recordType.columns.map(col => {
          const val = data[col.id] ?? '';

          if (col.type === 'checkbox') {
            return (
              <div key={col.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{col.name}</span>
                <input
                  type="checkbox"
                  checked={Boolean(val)}
                  onChange={(e) => updateCell(recordType.id, currentStudent.id, col.id, e.target.checked)}
                  className="w-6 h-6 rounded-lg text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>
            );
          }

          if (col.type === 'dropdown') {
            return (
              <div key={col.id} className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {col.name}
                </label>
                <select
                  value={val}
                  onChange={(e) => updateCell(recordType.id, currentStudent.id, col.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value="">Select option...</option>
                  {(col.dropdownOptions || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (col.type === 'calculated') {
            const isGrade = col.formula === 'grade';
            return (
              <div key={col.id} className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{col.name} (Auto)</span>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase">{col.formula}</p>
                </div>
                <span className={`text-base font-extrabold ${isGrade ? CalculationService.getGradeColor(String(val)) + ' px-2.5 py-1 rounded-xl' : 'text-slate-900 dark:text-slate-100'}`}>
                  {val !== '' ? val : '-'}
                </span>
              </div>
            );
          }

          if (col.type === 'longText') {
            return (
              <div key={col.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {col.name}
                  </label>
                  <button
                    type="button"
                    onClick={() => onOpenCommentLibrary(col.id)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Comment Library</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={val}
                  onChange={(e) => updateCell(recordType.id, currentStudent.id, col.id, e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>
            );
          }

          return (
            <div key={col.id} className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {col.name}
              </label>
              <input
                type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                value={val}
                onChange={(e) => updateCell(recordType.id, currentStudent.id, col.id, e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-slate-100"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
