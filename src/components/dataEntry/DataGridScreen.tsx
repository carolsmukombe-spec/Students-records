import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecordType, Student, ViewMode } from '../../types';
import { 
  Table, 
  LayoutGrid, 
  ArrowDown, 
  Copy, 
  Calendar, 
  MessageSquare, 
  Download, 
  Check, 
  Sparkles,
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { CalculationService } from '../../services/calculationService';
import { CardView } from './CardView';
import { CommentLibraryModal } from './CommentLibraryModal';
import { ExportModal } from '../export/ExportModal';

interface DataGridScreenProps {
  onOpenChooser: () => void;
}

export const DataGridScreen: React.FC<DataGridScreenProps> = ({ onOpenChooser }) => {
  const { 
    recordTypes, 
    currentRecordTypeId, 
    setCurrentRecordTypeId, 
    students, 
    recordEntries, 
    updateCell, 
    fillDownColumn, 
    quickFillTodayDate,
    quickFillCheckbox,
    deleteRecordRow,
    viewMode,
    setViewMode,
    showToast
  } = useApp();

  const currentRt = recordTypes.find(rt => rt.id === currentRecordTypeId) || recordTypes[0];
  const activeStudents = students.filter(s => !s.isArchived);

  // Active focused cell state for toolbar operations
  const [activeCell, setActiveCell] = useState<{ studentId: string; columnId: string } | null>(null);
  
  // Modals state
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [targetCommentColId, setTargetCommentColId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  if (!currentRt) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">No Record Books available.</p>
        <button
          onClick={onOpenChooser}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
        >
          Create First Record Book
        </button>
      </div>
    );
  }

  // Get active cell value for Fill Down action
  const getActiveCellValue = () => {
    if (!activeCell) return null;
    const entry = recordEntries.find(
      e => e.recordTypeId === currentRt.id && e.studentId === activeCell.studentId
    );
    return entry?.data[activeCell.columnId];
  };

  const handleFillDownActive = () => {
    if (!activeCell) {
      showToast('Click a cell first to select the value to fill down', 'info');
      return;
    }
    const val = getActiveCellValue();
    if (val === undefined || val === null) {
      showToast('Cell is empty. Enter a value before filling down.', 'info');
      return;
    }
    fillDownColumn(currentRt.id, activeCell.columnId, val);
  };

  return (
    <div className="space-y-4">
      
      {/* Smart Data Entry Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        
        {/* Left Smart Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleFillDownActive}
            title="Apply focused cell value down to all students in this column"
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Fill Down</span>
          </button>

          <button
            onClick={() => {
              // Find first date column and fill today
              const dateCol = currentRt.columns.find(c => c.type === 'date');
              if (dateCol) {
                quickFillTodayDate(currentRt.id, dateCol.id);
              } else {
                showToast('No Date column in this record book', 'info');
              }
            }}
            title="Set today's date for all rows"
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Today's Date</span>
          </button>

          <button
            onClick={() => {
              const textCol = currentRt.columns.find(c => c.type === 'longText' || c.type === 'text');
              setTargetCommentColId(textCol ? textCol.id : currentRt.columns[0]?.id || null);
              setShowCommentModal(true);
            }}
            title="Open teacher comment phrase library"
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Comment Library</span>
          </button>
        </div>

        {/* Right View & Export Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher (Grid / Card) */}
          <div className="p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Spreadsheet Grid View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Student Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (PDF/Excel)</span>
          </button>
        </div>

      </div>

      {/* Main Data Entry Interface */}
      {viewMode === 'card' ? (
        <CardView
          recordType={currentRt}
          students={activeStudents}
          onOpenCommentLibrary={(colId) => {
            setTargetCommentColId(colId);
            setShowCommentModal(true);
          }}
        />
      ) : (
        /* Spreadsheet Grid View with Sticky First Column */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto relative max-h-[65vh] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Sticky Column Headers */}
              <thead className="bg-slate-100 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-20 text-xs font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {/* Sticky First Column Header: Student Name */}
                  <th className="p-3 sticky left-0 z-30 bg-slate-100 dark:bg-slate-800 min-w-[180px] sm:min-w-[220px] shadow-r border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Student Name</span>
                      <span className="text-[10px] text-slate-400 font-normal">({activeStudents.length})</span>
                    </div>
                  </th>

                  {/* Dynamic Column Headers */}
                  {currentRt.columns.map(col => (
                    <th key={col.id} className="p-3 min-w-[140px] max-w-[220px] whitespace-nowrap border-r border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{col.name}</span>
                        <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 shrink-0">
                          {col.type === 'calculated' ? col.formula : col.type}
                        </span>
                      </div>
                    </th>
                  ))}

                  {/* Actions Column */}
                  <th className="p-3 w-12 text-center">Row</th>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {activeStudents.map((student, sIdx) => {
                  const entry = recordEntries.find(
                    e => e.recordTypeId === currentRt.id && e.studentId === student.id
                  );
                  const data = entry?.data || {};

                  return (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors ${
                        sIdx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-900/50' : ''
                      }`}
                    >
                      {/* Sticky First Column: Student Name & ID */}
                      <td className="p-3 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-r">
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {student.studentId || 'No ID'}
                        </div>
                      </td>

                      {/* Dynamic Editable Cells */}
                      {currentRt.columns.map(col => {
                        const val = data[col.id] ?? '';
                        const isFocused = activeCell?.studentId === student.id && activeCell?.columnId === col.id;

                        if (col.type === 'checkbox') {
                          return (
                            <td 
                              key={col.id} 
                              onClick={() => setActiveCell({ studentId: student.id, columnId: col.id })}
                              className={`p-2 text-center border-r border-slate-100 dark:border-slate-800/80 ${isFocused ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(val)}
                                onChange={(e) => updateCell(currentRt.id, student.id, col.id, e.target.checked)}
                                className="w-5 h-5 rounded-md text-indigo-600 accent-indigo-600 cursor-pointer align-middle"
                              />
                            </td>
                          );
                        }

                        if (col.type === 'dropdown') {
                          return (
                            <td 
                              key={col.id} 
                              onClick={() => setActiveCell({ studentId: student.id, columnId: col.id })}
                              className={`p-1.5 border-r border-slate-100 dark:border-slate-800/80 ${isFocused ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
                            >
                              <select
                                value={val}
                                onChange={(e) => updateCell(currentRt.id, student.id, col.id, e.target.value)}
                                className="w-full bg-transparent p-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <option value="">-</option>
                                {(col.dropdownOptions || []).map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                          );
                        }

                        if (col.type === 'calculated') {
                          const isGrade = col.formula === 'grade';
                          return (
                            <td key={col.id} className="p-3 border-r border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 font-bold text-center">
                              {val !== '' ? (
                                <span className={isGrade ? CalculationService.getGradeColor(String(val)) + ' px-2 py-0.5 rounded-md text-xs' : 'text-slate-800 dark:text-slate-200'}>
                                  {val}
                                </span>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-600">-</span>
                              )}
                            </td>
                          );
                        }

                        return (
                          <td 
                            key={col.id} 
                            onClick={() => setActiveCell({ studentId: student.id, columnId: col.id })}
                            className={`p-1.5 border-r border-slate-100 dark:border-slate-800/80 ${isFocused ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
                          >
                            <input
                              type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                              value={val}
                              onChange={(e) => updateCell(currentRt.id, student.id, col.id, e.target.value)}
                              placeholder="..."
                              className="w-full bg-transparent px-2 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            />
                          </td>
                        );
                      })}

                      {/* Row Delete Action */}
                      <td className="p-2 text-center">
                        {entry && (
                          <button
                            onClick={() => deleteRecordRow(entry.id)}
                            title="Clear row entries"
                            className="p-1 text-slate-300 hover:text-rose-600 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>⚡ Changes saved automatically offline</span>
            <span>Tip: Click any cell and press "Fill Down" to auto-apply across all rows.</span>
          </div>

        </div>
      )}

      {/* Modals */}
      <CommentLibraryModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSelectComment={(comment) => {
          if (activeCell && targetCommentColId) {
            updateCell(currentRt.id, activeCell.studentId, targetCommentColId, comment);
          } else if (activeStudents.length > 0 && targetCommentColId) {
            updateCell(currentRt.id, activeStudents[0].id, targetCommentColId, comment);
          }
        }}
      />

      <ExportModal
        isOpen={showExportModal}
        recordType={currentRt}
        onClose={() => setShowExportModal(false)}
      />

    </div>
  );
};
