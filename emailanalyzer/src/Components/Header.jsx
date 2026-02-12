import React from "react";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const Header = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-sm dark:border-slate-800/80 dark:bg-[#111827]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a73e8] text-white font-semibold">
            EA
          </div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Email Risk Analyzer
          </h1>
        </div>

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-xl sm:flex">
          <div className="flex w-full items-center gap-2 rounded-full bg-[#eef3fc] px-4 py-2 text-sm text-slate-600 shadow-inner dark:bg-[#1f2937] dark:text-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="opacity-70 text-[13px]">Search analyzed emails…</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isDark ? "Light" : "Dark"}
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            DK
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
