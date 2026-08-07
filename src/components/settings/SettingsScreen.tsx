import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { 
  Settings, 
  Moon, 
  Sun, 
  Smartphone, 
  Download, 
  Upload, 
  RefreshCw, 
  MessageSquare, 
  Plus, 
  Trash2, 
  ShieldAlert 
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsScreen: React.FC = () => {
  const { 
    darkMode, 
    toggleDarkMode, 
    mobileFrameMode, 
    toggleMobileFrameMode,
    commentLibrary,
    addComment,
    deleteComment,
    resetToDefaultData,
    importBackupJSON,
    showToast
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentCat, setNewCommentCat] = useState('Academic');

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportFullBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `teacher_record_book_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded full backup file');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        importBackupJSON(content);
      }
    };
    reader.readAsText(file);
  };

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(newCommentText.trim(), newCommentCat);
    setNewCommentText('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto animate-in fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>App Settings & Offline Backup</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure appearance, manage saved comment phrases, and backup/restore data.
        </p>
      </div>

      {/* Appearance & Layout Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Dark Mode Theme</h4>
              <p className="text-xs text-slate-500">Eye-safe dark canvas for evening grading.</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Mobile Phone Preview Frame</h4>
              <p className="text-xs text-slate-500">Toggle mobile app frame simulation.</p>
            </div>
          </div>
          <button
            onClick={toggleMobileFrameMode}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${mobileFrameMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${mobileFrameMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Backup & Restore Data Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Offline Data Backup & Restore
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportBackup}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center shrink-0 font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                Export JSON Backup
              </h4>
              <p className="text-xs text-slate-500">Save all students and record entries to file.</p>
            </div>
          </button>

          <label className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all flex items-center gap-3 cursor-pointer group">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600">
                Restore JSON Backup
              </h4>
              <p className="text-xs text-slate-500">Upload previously exported backup file.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Comment Phrase Manager Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Teacher Comment Library Phrases ({commentLibrary.length})
        </h3>

        <form onSubmit={handleAddPhrase} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Add new frequent teacher phrase..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
          />
          <select
            value={newCommentCat}
            onChange={(e) => setNewCommentCat(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          >
            <option value="Academic">Academic</option>
            <option value="Behavior">Behavior</option>
            <option value="Reading">Reading</option>
            <option value="Math">Math</option>
            <option value="General">General</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
          >
            Add Phrase
          </button>
        </form>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
          {commentLibrary.map(item => (
            <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">"{item.text}"</p>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{item.category}</span>
              </div>
              <button
                onClick={() => deleteComment(item.id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">Reset All App Data</h4>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
            Clears local storage and re-seeds with default sample student roster and templates.
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Reset Data
        </button>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset All Data?"
        message="This will wipe all custom student profiles, custom record books, and cell entries, restoring the initial sample class seed data."
        confirmLabel="Reset Everything"
        onConfirm={resetToDefaultData}
        onClose={() => setShowResetConfirm(false)}
      />

    </div>
  );
};
