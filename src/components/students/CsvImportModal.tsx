import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExportService } from '../../services/exportService';
import { Student } from '../../types';
import { X, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { importStudentsCSV, showToast } = useApp();

  const [previewStudents, setPreviewStudents] = useState<Partial<Student>[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg('');
    setFileName(file.name);

    try {
      const parsed = await ExportService.parseStudentCSV(file);
      if (parsed.length === 0) {
        setErrorMsg('No valid student rows found in the CSV file.');
      } else {
        setPreviewStudents(parsed);
      }
    } catch (err: any) {
      setErrorMsg('Failed to parse CSV file: ' + (err?.message || 'Invalid format'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewStudents.length > 0) {
      importStudentsCSV(previewStudents);
      setPreviewStudents([]);
      setFileName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Import Students from CSV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload a .csv file containing columns like Name, Student ID, Tags, Notes.
            </p>
          </div>
        </div>

        {/* Dropzone / Upload input */}
        {previewStudents.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer my-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileSpreadsheet className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {loading ? 'Reading CSV file...' : 'Click or Drag & Drop CSV File'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports standard CSV format with headers.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col my-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              <span>File: {fileName}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {previewStudents.length} Students Detected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
              {previewStudents.map((st, idx) => (
                <div key={idx} className="p-3 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{st.name}</span>
                    <span className="text-slate-500">ID: {st.studentId || '-'}</span>
                  </div>
                  {st.tags && st.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {st.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-medium my-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          {previewStudents.length > 0 && (
            <button
              onClick={handleConfirmImport}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Import {previewStudents.length} Students</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
