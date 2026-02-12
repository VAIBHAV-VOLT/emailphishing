import React from 'react';

const Loader = ({ message = 'Analyzing email…' }) => {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-sm dark:border-slate-700/70 dark:bg-[#111827] dark:shadow-black/40">
      <div className="relative flex h-11 w-11 items-center justify-center">
        <span className="relative inline-flex h-8 w-8 animate-spin rounded-full border-2 border-[#1a73e8]/70 border-t-transparent dark:border-[#8ab4f8]/80" />
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
        {message}
      </p>
      <p className="max-w-xs text-[13px] text-slate-500 dark:text-slate-400">
        This might take a moment while the backend parses headers, checks SPF/DKIM
        and runs risk models.
      </p>
    </div>
  );
};

export default Loader;