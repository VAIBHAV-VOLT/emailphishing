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
    <section className="space-y-4 mx-5">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex min-h-105 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white/70 p-8 text-center shadow-sm shadow-slate-200/70 backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/70 dark:shadow-black/40 sm:min-h-115 ${isDragging
          ? 'border-blue-500/90 bg-blue-50/60 dark:border-blue-400/90 dark:bg-slate-900/80'
          : 'border-slate-300/70 hover:border-blue-500/70 hover:bg-blue-50/40 dark:border-slate-700/80 dark:hover:border-blue-400/80 dark:hover:bg-slate-900/80'
          }`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-tr from-blue-500/10 via-purple-500/10 to-emerald-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

        <input
          type="file"
          accept=".eml"
          onChange={handleInputChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        <div className="relative z-20 flex flex-col items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-tr from-blue-500 via-purple-500 to-emerald-400 text-white shadow-lg shadow-blue-500/40 sm:h-24 sm:w-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12"
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
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 sm:text-xl">
              Drop your <span className="font-semibold">.eml</span>{' '}
              file here
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Or click to browse. We only accept raw email files (.eml).
            </p>
          </div>

          <div className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-slate-50/80 px-5 py-2.5 text-base font-medium text-slate-600 shadow-sm shadow-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:shadow-black/40 sm:text-lg">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>
              FileUploaded:{' '}
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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your file is ready. Click <span className="font-semibold">Analyze</span> to continue.
        </p>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled}
          className={`inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-semibold tracking-tight text-white shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950 sm:px-10 sm:py-4 sm:text-lg ${disabled
            ? 'cursor-not-allowed bg-slate-500/60 text-slate-300 shadow-none'
            : 'bg-linear-to-tr from-blue-500 via-purple-500 to-emerald-400 shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 active:scale-[0.98]'
            }`}
        >
          {isLoading && (
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            </span>
          )}
          <span>{isLoading ? 'Analyzing…' : 'Analyze Email'}</span>
        </button>
      </div>
    </section>
  );
};

export default FileUpload;