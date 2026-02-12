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
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-300/60 bg-white p-6 text-center shadow-sm transition-all duration-150 dark:border-slate-700/60 dark:bg-[#111827] ${
          isDragging
            ? 'border-[#1a73e8] bg-slate-50 dark:border-[#8ab4f8] dark:bg-slate-900'
            : 'hover:border-[#1a73e8] hover:bg-slate-50/60 dark:hover:border-[#8ab4f8] dark:hover:bg-slate-900'
        }`}
      >

        <input
          type="file"
          accept=".eml"
          onChange={handleInputChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        <div className="relative z-20 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-[#8ab4f8] shadow-sm shadow-slate-900/40 dark:bg-slate-800 dark:text-[#c3ddff]">
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
              <rect x="4" y="5" width="16" height="14" rx="2.5" />
              <path d="M5 8.5 12 13l7-4.5" />
            </svg>
          </div>

          <div>
            <p className="text-base font-medium">
              Drag &amp; drop your <span className="font-semibold">.eml</span>{' '}
              file here
            </p>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              Or click to browse. We only accept raw email files (.eml).
            </p>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm shadow-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:shadow-black/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          Make sure your email analysis server is running before you click
          <span className="font-semibold"> Analyze Email</span>.
        </p>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f8fc] dark:focus-visible:ring-offset-[#0f172a] ${
            disabled
              ? 'cursor-not-allowed bg-slate-300 text-slate-600 shadow-none dark:bg-slate-700 dark:text-slate-400'
              : 'bg-[#1a73e8] text-white shadow-sm hover:bg-[#185abc] active:scale-[0.98]'
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