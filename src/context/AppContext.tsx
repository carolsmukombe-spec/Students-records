import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RecordType, Student, RecordEntry, CommentLibraryItem, AppTab, ViewMode } from '../types';
import { StorageService } from '../services/storageService';
import { CalculationService } from '../services/calculationService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  students: Student[];
  recordTypes: RecordType[];
  recordEntries: RecordEntry[];
  commentLibrary: CommentLibraryItem[];
  currentRecordTypeId: string | null;
  activeTab: AppTab;
  viewMode: ViewMode;
  searchQuery: string;
  selectedTagFilter: string | null;
  darkMode: boolean;
  mobileFrameMode: boolean;
  toasts: Toast[];

  // Navigation & View State
  setActiveTab: (tab: AppTab) => void;
  setCurrentRecordTypeId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
  setSelectedTagFilter: (tag: string | null) => void;
  toggleDarkMode: () => void;
  toggleMobileFrameMode: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Student Actions
  addStudent: (studentData: Omit<Student, 'id' | 'createdAt'>) => Student;
  updateStudent: (id: string, studentData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  archiveStudent: (id: string, isArchived: boolean) => void;
  importStudentsCSV: (importedList: Partial<Student>[]) => number;

  // Record Type Actions
  addRecordType: (rtData: Omit<RecordType, 'id' | 'createdAt' | 'updatedAt'>) => RecordType;
  updateRecordType: (id: string, rtData: Partial<RecordType>) => void;
  deleteRecordType: (id: string) => void;
  duplicateRecordType: (id: string) => RecordType;

  // Data Entry Actions
  updateCell: (recordTypeId: string, studentId: string, columnId: string, value: any) => void;
  fillDownColumn: (recordTypeId: string, columnId: string, value: any, studentIds?: string[]) => void;
  copyPreviousRow: (recordTypeId: string, studentId: string) => void;
  bulkUpdateColumn: (recordTypeId: string, columnId: string, value: any, studentIds: string[]) => void;
  quickFillTodayDate: (recordTypeId: string, columnId: string) => void;
  quickFillCheckbox: (recordTypeId: string, columnId: string, value: boolean) => void;
  deleteRecordRow: (entryId: string) => void;

  // Comment Library Actions
  addComment: (text: string, category: string) => void;
  deleteComment: (id: string) => void;
  incrementCommentUsage: (id: string) => void;

  // Settings & System
  resetToDefaultData: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [recordTypes, setRecordTypes] = useState<RecordType[]>([]);
  const [recordEntries, setRecordEntries] = useState<RecordEntry[]>([]);
  const [commentLibrary, setCommentLibrary] = useState<CommentLibraryItem[]>([]);
  
  const [currentRecordTypeId, setCurrentRecordTypeId] = useState<string | null>('template-assessment');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('srb_theme') === 'dark' || 
      (!('srb_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast Notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Sync Dark Mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('srb_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('srb_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleMobileFrameMode = () => setMobileFrameMode(prev => !prev);

  // Initial Load from Storage
  useEffect(() => {
    const loadedStudents = StorageService.loadStudents();
    const loadedRecordTypes = StorageService.loadRecordTypes();
    const loadedEntries = StorageService.loadRecordEntries();
    const loadedComments = StorageService.loadCommentLibrary();

    setStudents(loadedStudents);
    setRecordTypes(loadedRecordTypes);
    setRecordEntries(loadedEntries);
    setCommentLibrary(loadedComments);

    if (loadedRecordTypes.length > 0 && !currentRecordTypeId) {
      setCurrentRecordTypeId(loadedRecordTypes[0].id);
    }
  }, []);

  // Storage Auto-Save listeners
  useEffect(() => {
    if (students.length > 0) StorageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    if (recordTypes.length > 0) StorageService.saveRecordTypes(recordTypes);
  }, [recordTypes]);

  useEffect(() => {
    if (recordEntries.length > 0) StorageService.saveRecordEntries(recordEntries);
  }, [recordEntries]);

  useEffect(() => {
    if (commentLibrary.length > 0) StorageService.saveCommentLibrary(commentLibrary);
  }, [commentLibrary]);

  // STUDENT CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: 'stu_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Added student: ${newStudent.name}`);
    return newStudent;
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...studentData } : s));
    showToast('Student information updated');
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setRecordEntries(prev => prev.filter(e => e.studentId !== id));
    showToast('Student deleted', 'info');
  };

  const archiveStudent = (id: string, isArchived: boolean) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isArchived } : s));
    showToast(isArchived ? 'Student archived' : 'Student unarchived');
  };

  const importStudentsCSV = (importedList: Partial<Student>[]): number => {
    let count = 0;
    const newStudents: Student[] = [];

    importedList.forEach((item, idx) => {
      if (item.name) {
        newStudents.push({
          id: 'stu_imp_' + Date.now() + '_' + idx,
          name: item.name,
          studentId: item.studentId || `STU-${2000 + idx}`,
          tags: item.tags || ['CSV Import'],
          notes: item.notes || '',
          isArchived: false,
          createdAt: new Date().toISOString()
        });
        count++;
      }
    });

    if (count > 0) {
      setStudents(prev => [...newStudents, ...prev]);
      showToast(`Imported ${count} students successfully!`);
    }
    return count;
  };

  // RECORD TYPE CRUD
  const addRecordType = (rtData: Omit<RecordType, 'id' | 'createdAt' | 'updatedAt'>): RecordType => {
    const newRt: RecordType = {
      ...rtData,
      id: 'rt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRecordTypes(prev => [newRt, ...prev]);
    setCurrentRecordTypeId(newRt.id);
    showToast(`Created Record Book: ${newRt.name}`);
    return newRt;
  };

  const updateRecordType = (id: string, rtData: Partial<RecordType>) => {
    setRecordTypes(prev => prev.map(rt => rt.id === id ? { ...rt, ...rtData, updatedAt: new Date().toISOString() } : rt));
    showToast('Record Book definition updated');
  };

  const deleteRecordType = (id: string) => {
    setRecordTypes(prev => prev.filter(rt => rt.id !== id));
    setRecordEntries(prev => prev.filter(e => e.recordTypeId !== id));
    if (currentRecordTypeId === id) {
      const remaining = recordTypes.filter(rt => rt.id !== id);
      setCurrentRecordTypeId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast('Record Book deleted', 'info');
  };

  const duplicateRecordType = (id: string): RecordType => {
    const target = recordTypes.find(rt => rt.id === id);
    if (!target) throw new Error('Record type not found');

    const dup: RecordType = {
      ...target,
      id: 'rt_dup_' + Date.now(),
      name: `${target.name} (Copy)`,
      isTemplate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRecordTypes(prev => [dup, ...prev]);
    setCurrentRecordTypeId(dup.id);
    showToast(`Duplicated Record Book: ${dup.name}`);
    return dup;
  };

  // DATA ENTRY OPERATIONS (AUTO-CALCULATIONS & AUTO-SAVE)
  const updateCell = (recordTypeId: string, studentId: string, columnId: string, value: any) => {
    const rt = recordTypes.find(r => r.id === recordTypeId);
    if (!rt) return;

    setRecordEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(
        e => e.recordTypeId === recordTypeId && e.studentId === studentId
      );

      let updatedData: Record<string, any> = {};

      if (existingIndex >= 0) {
        const existingData = { ...prevEntries[existingIndex].data, [columnId]: value };
        // Evaluate calculations
        updatedData = CalculationService.evaluateRow(rt.columns, existingData);

        const updatedEntry: RecordEntry = {
          ...prevEntries[existingIndex],
          data: updatedData,
          updatedAt: new Date().toISOString()
        };

        const next = [...prevEntries];
        next[existingIndex] = updatedEntry;
        return next;
      } else {
        // Create new entry
        const initialData = { [columnId]: value };
        updatedData = CalculationService.evaluateRow(rt.columns, initialData);

        const newEntry: RecordEntry = {
          id: 'ent_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          recordTypeId,
          studentId,
          data: updatedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return [newEntry, ...prevEntries];
      }
    });

    // Save recent dropdown value if applicable
    const colDef = rt.columns.find(c => c.id === columnId);
    if (colDef && colDef.type === 'dropdown' && typeof value === 'string' && value.trim()) {
      StorageService.saveRecentDropdown(columnId, value.trim());
    }
  };

  const fillDownColumn = (recordTypeId: string, columnId: string, value: any, targetStudentIds?: string[]) => {
    const rt = recordTypes.find(r => r.id === recordTypeId);
    if (!rt) return;

    const studentList = targetStudentIds && targetStudentIds.length > 0 
      ? targetStudentIds 
      : students.filter(s => !s.isArchived).map(s => s.id);

    setRecordEntries(prevEntries => {
      const entriesMap = new Map<string, RecordEntry>(prevEntries.map(e => [`${e.recordTypeId}_${e.studentId}`, e]));

      studentList.forEach(sId => {
        const key = `${recordTypeId}_${sId}`;
        const existing = entriesMap.get(key);
        const currentData = existing ? { ...existing.data } : {};
        currentData[columnId] = value;

        const evaluatedData = CalculationService.evaluateRow(rt.columns, currentData);

        if (existing) {
          entriesMap.set(key, {
            ...existing,
            data: evaluatedData,
            updatedAt: new Date().toISOString()
          });
        } else {
          entriesMap.set(key, {
            id: 'ent_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
            recordTypeId,
            studentId: sId,
            data: evaluatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });

      return Array.from(entriesMap.values());
    });

    showToast(`Filled value down for ${studentList.length} students`);
  };

  const copyPreviousRow = (recordTypeId: string, studentId: string) => {
    const rt = recordTypes.find(r => r.id === recordTypeId);
    if (!rt) return;

    // Find the last modified row entry in this record book
    const existingForRt = recordEntries.filter(e => e.recordTypeId === recordTypeId && e.studentId !== studentId);
    if (existingForRt.length === 0) {
      showToast('No previous entry found to copy from', 'info');
      return;
    }

    const lastEntry = existingForRt.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    
    // Copy data except student specific notes or custom IDs
    const copiedData = { ...lastEntry.data };
    const evaluated = CalculationService.evaluateRow(rt.columns, copiedData);

    setRecordEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(
        e => e.recordTypeId === recordTypeId && e.studentId === studentId
      );

      if (existingIndex >= 0) {
        const next = [...prevEntries];
        next[existingIndex] = {
          ...next[existingIndex],
          data: evaluated,
          updatedAt: new Date().toISOString()
        };
        return next;
      } else {
        return [{
          id: 'ent_' + Date.now(),
          recordTypeId,
          studentId,
          data: evaluated,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, ...prevEntries];
      }
    });

    showToast('Copied previous row data');
  };

  const bulkUpdateColumn = (recordTypeId: string, columnId: string, value: any, studentIds: string[]) => {
    fillDownColumn(recordTypeId, columnId, value, studentIds);
  };

  const quickFillTodayDate = (recordTypeId: string, columnId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    fillDownColumn(recordTypeId, columnId, todayStr);
  };

  const quickFillCheckbox = (recordTypeId: string, columnId: string, value: boolean) => {
    fillDownColumn(recordTypeId, columnId, value);
  };

  const deleteRecordRow = (entryId: string) => {
    setRecordEntries(prev => prev.filter(e => e.id !== entryId));
    showToast('Record row cleared', 'info');
  };

  // COMMENT LIBRARY ACTIONS
  const addComment = (text: string, category: string) => {
    const newItem: CommentLibraryItem = {
      id: 'c_' + Date.now(),
      text,
      category,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    setCommentLibrary(prev => [newItem, ...prev]);
    showToast('Saved comment phrase');
  };

  const deleteComment = (id: string) => {
    setCommentLibrary(prev => prev.filter(c => c.id !== id));
    showToast('Comment phrase removed', 'info');
  };

  const incrementCommentUsage = (id: string) => {
    setCommentLibrary(prev => prev.map(c => c.id === id ? { ...c, usageCount: c.usageCount + 1 } : c));
  };

  // SYSTEM & RESET
  const resetToDefaultData = () => {
    StorageService.resetToDefaultSeed();
    const loadedStudents = StorageService.loadStudents();
    const loadedRecordTypes = StorageService.loadRecordTypes();
    const loadedEntries = StorageService.loadRecordEntries();
    const loadedComments = StorageService.loadCommentLibrary();

    setStudents(loadedStudents);
    setRecordTypes(loadedRecordTypes);
    setRecordEntries(loadedEntries);
    setCommentLibrary(loadedComments);
    setCurrentRecordTypeId(loadedRecordTypes[0]?.id || null);
    showToast('Reset data to initial defaults');
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    const success = StorageService.importFullBackupJSON(jsonStr);
    if (success) {
      setStudents(StorageService.loadStudents());
      setRecordTypes(StorageService.loadRecordTypes());
      setRecordEntries(StorageService.loadRecordEntries());
      setCommentLibrary(StorageService.loadCommentLibrary());
      showToast('Successfully restored backup file!');
    } else {
      showToast('Failed to import JSON backup file', 'error');
    }
    return success;
  };

  return (
    <AppContext.Provider value={{
      students,
      recordTypes,
      recordEntries,
      commentLibrary,
      currentRecordTypeId,
      activeTab,
      viewMode,
      searchQuery,
      selectedTagFilter,
      darkMode,
      mobileFrameMode,
      toasts,

      setActiveTab,
      setCurrentRecordTypeId,
      setViewMode,
      setSearchQuery,
      setSelectedTagFilter,
      toggleDarkMode,
      toggleMobileFrameMode,
      showToast,

      addStudent,
      updateStudent,
      deleteStudent,
      archiveStudent,
      importStudentsCSV,

      addRecordType,
      updateRecordType,
      deleteRecordType,
      duplicateRecordType,

      updateCell,
      fillDownColumn,
      copyPreviousRow,
      bulkUpdateColumn,
      quickFillTodayDate,
      quickFillCheckbox,
      deleteRecordRow,

      addComment,
      deleteComment,
      incrementCommentUsage,

      resetToDefaultData,
      importBackupJSON
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
