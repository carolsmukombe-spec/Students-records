import { RecordType, Student, RecordEntry, CommentLibraryItem } from '../types';
import { DEFAULT_TEMPLATES, INITIAL_STUDENTS, INITIAL_COMMENT_LIBRARY, INITIAL_RECORD_ENTRIES } from '../data/defaultTemplates';

const KEYS = {
  RECORD_TYPES: 'srb_record_types_v1',
  STUDENTS: 'srb_students_v1',
  RECORD_ENTRIES: 'srb_record_entries_v1',
  COMMENT_LIBRARY: 'srb_comment_library_v1',
  ACTIVE_RECORD_TYPE: 'srb_active_rt_v1',
  RECENT_DROPDOWNS: 'srb_recent_dropdowns_v1',
  THEME: 'srb_theme_v1'
};

export class StorageService {
  static loadRecordTypes(): RecordType[] {
    try {
      const data = localStorage.getItem(KEYS.RECORD_TYPES);
      if (!data) {
        this.saveRecordTypes(DEFAULT_TEMPLATES);
        return DEFAULT_TEMPLATES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load record types', e);
      return DEFAULT_TEMPLATES;
    }
  }

  static saveRecordTypes(types: RecordType[]): void {
    try {
      localStorage.setItem(KEYS.RECORD_TYPES, JSON.stringify(types));
    } catch (e) {
      console.error('Failed to save record types', e);
    }
  }

  static loadStudents(): Student[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (!data) {
        this.saveStudents(INITIAL_STUDENTS);
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load students', e);
      return INITIAL_STUDENTS;
    }
  }

  static saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students', e);
    }
  }

  static loadRecordEntries(): RecordEntry[] {
    try {
      const data = localStorage.getItem(KEYS.RECORD_ENTRIES);
      if (!data) {
        this.saveRecordEntries(INITIAL_RECORD_ENTRIES);
        return INITIAL_RECORD_ENTRIES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load record entries', e);
      return INITIAL_RECORD_ENTRIES;
    }
  }

  static saveRecordEntries(entries: RecordEntry[]): void {
    try {
      localStorage.setItem(KEYS.RECORD_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save record entries', e);
    }
  }

  static loadCommentLibrary(): CommentLibraryItem[] {
    try {
      const data = localStorage.getItem(KEYS.COMMENT_LIBRARY);
      if (!data) {
        this.saveCommentLibrary(INITIAL_COMMENT_LIBRARY);
        return INITIAL_COMMENT_LIBRARY;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load comment library', e);
      return INITIAL_COMMENT_LIBRARY;
    }
  }

  static saveCommentLibrary(items: CommentLibraryItem[]): void {
    try {
      localStorage.setItem(KEYS.COMMENT_LIBRARY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save comment library', e);
    }
  }

  static loadRecentDropdowns(): Record<string, string[]> {
    try {
      const data = localStorage.getItem(KEYS.RECENT_DROPDOWNS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  static saveRecentDropdown(columnId: string, val: string): void {
    try {
      const recent = this.loadRecentDropdowns();
      const list = recent[columnId] || [];
      const updated = [val, ...list.filter(item => item !== val)].slice(0, 5); // Keep last 5
      recent[columnId] = updated;
      localStorage.setItem(KEYS.RECENT_DROPDOWNS, JSON.stringify(recent));
    } catch (e) {
      console.error('Failed to save recent dropdown', e);
    }
  }

  static exportFullBackupJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      recordTypes: this.loadRecordTypes(),
      students: this.loadStudents(),
      recordEntries: this.loadRecordEntries(),
      commentLibrary: this.loadCommentLibrary()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importFullBackupJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.recordTypes && Array.isArray(parsed.recordTypes)) {
        this.saveRecordTypes(parsed.recordTypes);
      }
      if (parsed.students && Array.isArray(parsed.students)) {
        this.saveStudents(parsed.students);
      }
      if (parsed.recordEntries && Array.isArray(parsed.recordEntries)) {
        this.saveRecordEntries(parsed.recordEntries);
      }
      if (parsed.commentLibrary && Array.isArray(parsed.commentLibrary)) {
        this.saveCommentLibrary(parsed.commentLibrary);
      }
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }

  static resetToDefaultSeed(): void {
    localStorage.removeItem(KEYS.RECORD_TYPES);
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.RECORD_ENTRIES);
    localStorage.removeItem(KEYS.COMMENT_LIBRARY);
    localStorage.removeItem(KEYS.RECENT_DROPDOWNS);
  }
}
