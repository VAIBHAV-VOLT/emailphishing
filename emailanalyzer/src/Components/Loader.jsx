import React from 'react';

const Loader = ({ message = 'Analyzing email…' }) => {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white/70 p-5 text-center shadow-sm shadow-slate-200/70 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/40">
      <div className="relative flex h-11 w-11 items-center justify-center">
        <span className="absolute inline-flex h-11 w-11 animate-ping rounded-full bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-emerald-400/40" />
        <span className="relative inline-flex h-8 w-8 animate-spin rounded-full border-2 border-blue-500/50 border-t-transparent dark:border-blue-400/60" />
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {message}
      </p>
      <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
        This might take a moment while the backend parses headers, checks SPF/DKIM
        and runs risk models.
      </p>
    </div>
  );
};

export default Loader;