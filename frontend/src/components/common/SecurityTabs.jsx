import React from 'react';

export const SecurityTabs = ({ activeMode, onChangeMode, disabled = false }) => {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChangeMode('vulnerable')}
        className={`pb-2.5 px-4 text-sm transition-colors border-b-2 -mb-[2px] ${
          activeMode === 'vulnerable'
            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        Vulnerable
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChangeMode('secure')}
        className={`pb-2.5 px-4 text-sm transition-colors border-b-2 -mb-[2px] ${
          activeMode === 'secure'
            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        Secure
      </button>
    </div>
  );
};
