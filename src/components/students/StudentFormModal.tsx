import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { X, UserPlus, Tag, FileText, Hash } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  studentToEdit?: Student | null;
  onClose: () => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  studentToEdit,
  onClose
}) => {
  const { addStudent, updateStudent } = useApp();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [gradeLevel, setGradeLevel] = useState('Grade 5');

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setStudentId(studentToEdit.studentId || '');
      setTagsInput((studentToEdit.tags || []).join(', '));
      setNotes(studentToEdit.notes || '');
      setGender(studentToEdit.gender || 'M');
      setGradeLevel(studentToEdit.gradeLevel || 'Grade 5');
    } else {
      setName('');
      setStudentId(`STU-${Math.floor(1000 + Math.random() * 9000)}`);
      setTagsInput('');
      setNotes('');
      setGender('M');
      setGradeLevel('Grade 5');
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        name: name.trim(),
        studentId: studentId.trim() || undefined,
        tags,
        notes: notes.trim(),
        gender,
        gradeLevel
      });
    } else {
      addStudent({
        name: name.trim(),
        studentId: studentId.trim() || undefined,
        tags,
        notes: notes.trim(),
        isArchived: false,
        gender,
        gradeLevel
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {studentToEdit ? 'Edit Student Profile' : 'Add New Student'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill in student details and custom tags for group filtering.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student ID
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="STU-1001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Grade / Class
              </label>
              <input
                type="text"
                placeholder="Grade 5"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Group / Tags (comma-separated)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Advanced, Math Group 1, ESL"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Separate multiple tags with commas.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Teacher Notes & Accommodations
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Prefers seating in front row, extra time accommodation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
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
              {studentToEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
