import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { X, User, Tag, Calendar, BookOpen, FileText, Hash, Award } from 'lucide-react';
import { CalculationService } from '../../services/calculationService';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEditStudent: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEditStudent
}) => {
  const { recordTypes, recordEntries } = useApp();

  if (!student) return null;

  // Gather all entries for this student
  const studentEntries = recordEntries.filter(e => e.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Student Profile Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.name}</h3>
              <button
                onClick={() => {
                  onClose();
                  onEditStudent(student);
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Edit Profile
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ID: {student.studentId || 'No ID'} • {student.gradeLevel || 'Grade 5'}
            </p>

            {/* Tags */}
            {student.tags && student.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {student.tags.map((t, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Teacher Notes */}
        {student.notes && (
          <div className="p-3 my-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 shrink-0">
            <span className="font-bold block mb-0.5">Teacher Accommodations / Notes:</span>
            {student.notes}
          </div>
        )}

        {/* Student Record Entries History */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Record Entries History ({studentEntries.length})
          </h4>

          {studentEntries.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                No entries recorded for this student yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Open a Record Book grid to log assessments or reading scores.
              </p>
            </div>
          ) : (
            studentEntries.map(entry => {
              const rt = recordTypes.find(r => r.id === entry.recordTypeId);
              if (!rt) return null;

              return (
                <div key={entry.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rt.name}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    {rt.columns.map(col => {
                      const val = entry.data[col.id];
                      if (val === undefined || val === null || val === '') return null;

                      let displayVal = String(val);
                      if (col.type === 'checkbox') displayVal = val ? 'Yes' : 'No';

                      const isGrade = col.type === 'calculated' && col.formula === 'grade';

                      return (
                        <div key={col.id} className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 font-medium block truncate">{col.name}</span>
                          <span className={`font-bold mt-0.5 inline-block ${isGrade ? CalculationService.getGradeColor(displayVal) + ' px-1.5 py-0.5 rounded-md text-xs' : 'text-slate-800 dark:text-slate-200'}`}>
                            {displayVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
