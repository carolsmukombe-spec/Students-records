export type ColumnType = 
  | 'text'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'longText'
  | 'calculated';

export interface ColumnDefinition {
  id: string;
  name: string;
  type: ColumnType;
  order: number;
  isRequired?: boolean;
  defaultValue?: any;
  dropdownOptions?: string[];
  formula?: string; // e.g. "percentage", "grade", "sum", "avg", "custom"
  formulaConfig?: {
    scoreColId?: string;
    maxScoreColId?: string;
    sourceColIds?: string[];
    customFormula?: string;
  };
}

export interface RecordType {
  id: string;
  name: string;
  description: string;
  columns: ColumnDefinition[];
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  category?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId?: string;
  photoPath?: string;
  tags: string[];
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  gender?: 'M' | 'F' | 'Other';
  gradeLevel?: string;
}

export interface RecordEntry {
  id: string;
  recordTypeId: string;
  studentId: string;
  data: Record<string, any>; // columnId -> cell value
  createdAt: string;
  updatedAt: string;
}

export interface CommentLibraryItem {
  id: string;
  text: string;
  category: string;
  usageCount: number;
  createdAt: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeColumns: string[]; // column IDs
  studentIds?: string[];
  startDate?: string;
  endDate?: string;
  title?: string;
  teacherName?: string;
  schoolName?: string;
}

export type ViewMode = 'grid' | 'card';
export type AppTab = 'home' | 'records' | 'students' | 'reports' | 'settings';
