import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 pointer-events-auto ${
            toast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
              : toast.type === 'info'
              ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
          }`}
        >
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
