import React from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const Header = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="w-full border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-400 shadow-lg shadow-blue-500/40">
            <span className="text-lg font-black text-white">EA</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Email Risk Analyzer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload .eml files to detect phishing & spam risk
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleDarkMode}
          className="group relative inline-flex h-9 w-16 items-center rounded-full border border-slate-300/80 bg-white/70 px-1 shadow-sm shadow-slate-300/60 backdrop-blur-md transition-all duration-300 hover:border-blue-500/70 hover:shadow-md hover:shadow-blue-500/30 dark:border-slate-700/80 dark:bg-slate-900/70 dark:shadow-none dark:hover:border-blue-400/80"
          aria-label="Toggle dark mode"
        >
          <span
            className={`pointer-events-none absolute inset-y-0 flex w-1/2 items-center justify-center text-[10px] font-semibold tracking-wide ${
              !isDark
                ? 'text-blue-600 opacity-90'
                : 'text-slate-400 opacity-40'
            }`}
          >
            LT
          </span>
          <span
            className={`pointer-events-none absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-[10px] font-semibold tracking-wide ${
              isDark
                ? 'text-amber-300 opacity-90'
                : 'text-slate-400 opacity-40'
            }`}
          >
            DK
          </span>

          <span
            className={`h-7 w-7 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-400 shadow-md shadow-blue-500/40 transition-transform duration-300 ${
              isDark ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;