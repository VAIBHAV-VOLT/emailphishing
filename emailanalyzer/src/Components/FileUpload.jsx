import React, { useState } from 'react';

const FileUpload = ({
  selectedFile,
  onFileSelect,
  onAnalyze,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleFiles = files => {
    const file = files?.[0];
    if (!file) return;

    const isEml =
      file.name.toLowerCase().endsWith('.eml') ||
      file.type === 'message/rfc822';

    if (!isEml) {
      setLocalError('Only .eml email files are allowed.');
      onFileSelect(null);
      return;
    }

    setLocalError('');
    onFileSelect(file);
  };

  const handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer?.files?.length) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = event => {
    const files = event.target.files;
    handleFiles(files);
  };

  const disabled = !selectedFile || isLoading;

  return (
    <section className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white/70 p-6 text-center shadow-sm shadow-slate-200/70 backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/70 dark:shadow-black/40 ${
          isDragging
            ? 'border-blue-500/90 bg-blue-50/60 dark:border-blue-400/90 dark:bg-slate-900/80'
            : 'border-slate-300/70 hover:border-blue-500/70 hover:bg-blue-50/40 dark:border-slate-700/80 dark:hover:border-blue-400/80 dark:hover:bg-slate-900/80'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-emerald-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

        <input
          type="file"
          accept=".eml"
          onChange={handleInputChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        <div className="relative z-20 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-400 text-white shadow-md shadow-blue-500/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M4 7.5 12 13l8-5.5" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium">
              Drag &amp; drop your <span className="font-semibold">.eml</span>{' '}
              file here
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Or click to browse. We only accept raw email files (.eml).
            </p>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-50/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm shadow-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:shadow-black/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>
              Selected:{' '}
              {selectedFile ? (
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {selectedFile.name}
                </span>
              ) : (
                <span className="italic text-slate-400 dark:text-slate-500">
                  No file yet
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {localError && (
        <p className="text-sm font-medium text-red-500">
          {localError}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Make sure your email analysis server is running before you click
          <span className="font-semibold"> Analyze Email</span>.
        </p>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-tight shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950 ${
            disabled
              ? 'cursor-not-allowed bg-slate-300/70 text-slate-600 shadow-none dark:bg-slate-700/70 dark:text-slate-400'
              : 'bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-400 text-white shadow-blue-500/40 hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {isLoading && (
            <span className="inline-flex h-4 w-4 items-center justify-center">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            </span>
          )}
          <span>{isLoading ? 'Analyzing…' : 'Analyze Email'}</span>
        </button>
      </div>
    </section>
  );
};

export default FileUpload;