import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { 
  Users, 
  Plus, 
  Upload, 
  Search, 
  Tag, 
  Archive, 
  Edit3, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  ChevronRight
} from 'lucide-react';
import { StudentFormModal } from './StudentFormModal';
import { CsvImportModal } from './CsvImportModal';
import { StudentDetailModal } from './StudentDetailModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const StudentsScreen: React.FC = () => {
  const { 
    students, 
    searchQuery, 
    setSearchQuery, 
    selectedTagFilter, 
    setSelectedTagFilter,
    deleteStudent,
    archiveStudent
  } = useApp();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);
  
  const [showArchiveList, setShowArchiveList] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(students.flatMap(s => s.tags || []))
  );

  // Filter student list
  const filteredStudents = students.filter(student => {
    const isArchivedMatch = showArchiveList ? student.isArchived : !student.isArchived;
    if (!isArchivedMatch) return false;

    if (selectedTagFilter && !(student.tags || []).includes(selectedTagFilter)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = student.name.toLowerCase().includes(q);
      const idMatch = (student.studentId || '').toLowerCase().includes(q);
      const tagMatch = (student.tags || []).some(t => t.toLowerCase().includes(q));
      return nameMatch || idMatch || tagMatch;
    }

    return true;
  });

  return (
    <div className="space-y-5 pb-12 animate-in fade-in">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Student Roster</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage student records, assign groups, and import class lists.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => {
              setStudentToEdit(null);
              setShowFormModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, ID or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTagFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTagFilter === null 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Tags
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(tag === selectedTagFilter ? null : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTagFilter === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Active vs Archived Toggle */}
        <button
          onClick={() => setShowArchiveList(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            showArchiveList
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>{showArchiveList ? 'Archived' : 'Active'}</span>
        </button>

      </div>

      {/* Student Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              No students found.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or tag filters.
            </p>
          </div>
        ) : (
          filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        ID: {student.studentId || '-'} • {student.gradeLevel || 'Grade 5'}
                      </p>
                    </div>
                  </div>

                  {/* Detail View Button */}
                  <button
                    onClick={() => setSelectedDetailStudent(student)}
                    title="View Student 360 Records"
                    className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags */}
                {student.tags && student.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {student.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {student.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 italic">
                    "{student.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => archiveStudent(student.id, !student.isArchived)}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{student.isArchived ? 'Unarchive' : 'Archive'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setStudentToEdit(student);
                      setShowFormModal(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg"
                    title="Edit Student"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(student.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                    title="Delete Student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={showFormModal}
        studentToEdit={studentToEdit}
        onClose={() => {
          setShowFormModal(false);
          setStudentToEdit(null);
        }}
      />

      <CsvImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <StudentDetailModal
        student={selectedDetailStudent}
        onClose={() => setSelectedDetailStudent(null)}
        onEditStudent={(st) => {
          setStudentToEdit(st);
          setShowFormModal(true);
        }}
      />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Student?"
        message="This will permanently delete this student and remove their associated record entries."
        confirmLabel="Delete Student"
        onConfirm={() => {
          if (deleteTargetId) deleteStudent(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
