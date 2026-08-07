import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { HomeScreen } from './components/home/HomeScreen';
import { StudentsScreen } from './components/students/StudentsScreen';
import { RecordTypesScreen } from './components/recordTypes/RecordTypesScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { TemplateChooserModal } from './components/recordTypes/TemplateChooserModal';
import { RecordTypeBuilderModal } from './components/recordTypes/RecordTypeBuilderModal';
import { StudentFormModal } from './components/students/StudentFormModal';

const AppContent: React.FC = () => {
  const { activeTab, mobileFrameMode } = useApp();

  // Global action modal states
  const [showChooserModal, setShowChooserModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans ${mobileFrameMode ? 'p-4 sm:p-8 bg-slate-900' : ''}`}>
      
      {/* Mobile Phone Mockup Frame wrapper when enabled */}
      <div className={`flex-1 flex flex-col ${mobileFrameMode ? 'max-w-sm mx-auto w-full bg-slate-50 dark:bg-slate-950 border-[10px] border-slate-800 dark:border-slate-800 rounded-[48px] shadow-2xl overflow-hidden min-h-[780px] relative' : ''}`}>
        
        {/* Android Notch / Status Bar when in mobile frame mode */}
        {mobileFrameMode && (
          <div className="bg-slate-900 text-white text-[10px] px-6 py-1 flex justify-between items-center z-50 shrink-0">
            <span>9:41</span>
            <div className="w-16 h-3 bg-black rounded-full mx-auto" />
            <span>100% 🔋</span>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar />

        {/* Main Tab Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              onOpenNewRecordModal={() => setShowChooserModal(true)}
              onOpenNewStudentModal={() => setShowStudentModal(true)}
            />
          )}

          {activeTab === 'records' && <RecordTypesScreen />}

          {activeTab === 'students' && <StudentsScreen />}

          {activeTab === 'reports' && <ReportsScreen />}

          {activeTab === 'settings' && <SettingsScreen />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global Toast Alerts */}
        <ToastContainer />

      </div>

      {/* Global Modals */}
      <TemplateChooserModal
        isOpen={showChooserModal}
        onClose={() => setShowChooserModal(false)}
        onOpenCustomBuilder={() => setShowBuilderModal(true)}
      />

      <RecordTypeBuilderModal
        isOpen={showBuilderModal}
        onClose={() => setShowBuilderModal(false)}
      />

      <StudentFormModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
