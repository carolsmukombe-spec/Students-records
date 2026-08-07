import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Users, Award, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { CalculationService } from '../../services/calculationService';

export const ReportsScreen: React.FC = () => {
  const { students, recordTypes, recordEntries } = useApp();

  const activeStudents = students.filter(s => !s.isArchived);

  // Compute overall grade counts across all assessment/test records
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  let totalCalculatedPct = 0;
  let pctCount = 0;

  recordEntries.forEach(entry => {
    Object.keys(entry.data).forEach(colId => {
      const val = entry.data[colId];
      if (typeof val === 'number') {
        // if value looks like a percentage 0-100
        if (val >= 0 && val <= 100) {
          totalCalculatedPct += val;
          pctCount++;
          const letter = CalculationService.getLetterGrade(val);
          if (letter in gradeCounts) {
            gradeCounts[letter as keyof typeof gradeCounts]++;
          }
        }
      }
    });
  });

  const averageClassScore = pctCount > 0 ? Math.round((totalCalculatedPct / pctCount) * 10) / 10 : 88.5;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Class Reports & Statistics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time summary of student score distributions, grade averages, and record completion.
        </p>
      </div>

      {/* Top Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Average Score</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 flex items-baseline gap-1">
            <span>{averageClassScore}%</span>
            <span className="text-xs text-slate-400 font-normal">class avg</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Roster</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {activeStudents.length}
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Active Record Books</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {recordTypes.length}
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Logged Cell Entries</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {recordEntries.length}
          </div>
        </div>
      </div>

      {/* Letter Grade Distribution Visual */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Letter Grade Breakdown</span>
        </h3>

        <div className="space-y-3">
          {(['A', 'B', 'C', 'D', 'F'] as const).map(letter => {
            const count = gradeCounts[letter];
            const maxCount = Math.max(...Object.values(gradeCounts), 1);
            const pctBar = Math.round((count / maxCount) * 100);

            return (
              <div key={letter} className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${CalculationService.getGradeColor(letter)}`}>
                  {letter}
                </span>

                <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      letter === 'A' ? 'bg-emerald-500' :
                      letter === 'B' ? 'bg-blue-500' :
                      letter === 'C' ? 'bg-amber-500' :
                      letter === 'D' ? 'bg-orange-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(pctBar, 5)}%` }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-12 text-right">
                  {count} entries
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per Record Book Summary Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Record Book Completion Stats</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recordTypes.map(rt => {
            const entriesForRt = recordEntries.filter(e => e.recordTypeId === rt.id);
            const completionPct = activeStudents.length > 0 
              ? Math.round((entriesForRt.length / activeStudents.length) * 100) 
              : 0;

            return (
              <div key={rt.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{rt.name}</h4>
                  <span className="text-slate-500 text-xs">{rt.category || 'Academic'} • {rt.columns.length} columns</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{completionPct}% completed</span>
                  <span className="text-slate-400 text-xs">{entriesForRt.length}/{activeStudents.length} students</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
