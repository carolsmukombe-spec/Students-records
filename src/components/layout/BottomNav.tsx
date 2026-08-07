import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, FileSpreadsheet, Users, BarChart3, Settings } from 'lucide-react';
import { AppTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'records', label: 'Records', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-2 sm:px-6">
      <div className="max-w-md sm:max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
