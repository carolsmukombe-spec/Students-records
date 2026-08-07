import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Moon, Sun, Smartphone, Monitor, Plus, Search, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    recordTypes, 
    currentRecordTypeId, 
    setCurrentRecordTypeId, 
    activeTab, 
    setActiveTab, 
    darkMode, 
    toggleDarkMode, 
    mobileFrameMode, 
    toggleMobileFrameMode,
    searchQuery,
    setSearchQuery
  } = useApp();

  const currentRt = recordTypes.find(rt => rt.id === currentRecordTypeId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Record Book
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Teacher Assistant
            </p>
          </div>
        </div>

        {/* Center: Record Book Quick Selector (When in Records tab or Data Grid view) */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 hidden md:flex items-center gap-2">
          {recordTypes.length > 0 && (
            <div className="relative w-full">
              <select
                value={currentRecordTypeId || ''}
                onChange={(e) => {
                  setCurrentRecordTypeId(e.target.value);
                  if (activeTab !== 'records') setActiveTab('records');
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8 truncate"
              >
                {recordTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>
                    📖 {rt.name} ({rt.columns.length} cols)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search Bar Input (Global) */}
        <div className="relative flex-1 max-w-xs sm:block hidden">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students or records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Frame Toggle */}
          <button
            onClick={toggleMobileFrameMode}
            title={mobileFrameMode ? "Switch to Full Screen" : "Switch to Mobile App Preview"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileFrameMode ? <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Smartphone className="w-5 h-5" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
