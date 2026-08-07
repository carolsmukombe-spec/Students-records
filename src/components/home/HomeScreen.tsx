import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  FileSpreadsheet, 
  Users, 
  BarChart3, 
  Clock, 
  Search, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Calendar
} from 'lucide-react';

interface HomeScreenProps {
  onOpenNewRecordModal: () => void;
  onOpenNewStudentModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenNewRecordModal,
  onOpenNewStudentModal
}) => {
  const { 
    students, 
    recordTypes, 
    recordEntries, 
    setCurrentRecordTypeId, 
    setActiveTab,
    searchQuery,
    setSearchQuery
  } = useApp();

  const activeStudents = students.filter(s => !s.isArchived);
  
  // Calculate class metrics
  const totalEntries = recordEntries.length;

  // Get recent record types
  const recentRecordTypes = [...recordTypes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-2">
            <Calendar className="w-4 h-4" />
            <span>{todayFormatted}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome, Teacher 👋
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 mt-2 max-w-xl font-normal leading-relaxed">
            Manage student scores, reading logs, attendance, and progress offline with smart fill-down and instant grade calculations.
          </p>

          {/* Search bar inside banner on mobile */}
          <div className="mt-5 relative sm:hidden">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, tags, records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 backdrop-blur-md text-white placeholder-indigo-200 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => {
              setActiveTab('records');
              onOpenNewRecordModal();
            }}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">New Record Book</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Template or Custom</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('students');
              onOpenNewStudentModal();
            }}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Student</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Single or CSV Import</span>
          </button>

          <button
            onClick={() => {
              // Open first record type or switch tab
              if (recordTypes.length > 0) setCurrentRecordTypeId(recordTypes[0].id);
              setActiveTab('records');
            }}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Data Entry Grid</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Spreadsheet View</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-xs hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Class Reports</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Stats & Exports</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-lg">
            {activeStudents.length}
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Students</span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Enrolled Roster</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold text-lg">
            {recordTypes.length}
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Record Books</span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Custom & Pre-built</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-lg">
            {totalEntries}
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Data Entries</span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Logged Cells</p>
          </div>
        </div>
      </div>

      {/* Recent Record Books List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Record Books
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('records')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({recordTypes.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecordTypes.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No record books created yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentRecordTypes.map(rt => {
              const entriesCount = recordEntries.filter(e => e.recordTypeId === rt.id).length;
              return (
                <div
                  key={rt.id}
                  onClick={() => {
                    setCurrentRecordTypeId(rt.id);
                    setActiveTab('records');
                  }}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {rt.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rt.columns.length} Columns • {entriesCount} Student Entries
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
