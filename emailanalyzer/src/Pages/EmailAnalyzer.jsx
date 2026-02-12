import React, { useCallback, useState } from 'react';
import FileUpload from '../Components/FileUpload.jsx';
import Loader from '../Components/Loader.jsx';
import ResultCard from '../Components/ResultCard.jsx';

// Toggle between real backend and dummy data
const USE_MOCK = true; // set to false when you connect the real backend

// Real backend config
const API_ENDPOINT = 'http://localhost:8000/analyze';
const FETCH_TIMEOUT_MS = 5000;

// Dummy responses for UI testing (no real backend needed)
const MOCK_RESULTS = [
  {
    from: 'alerts@github.com',
    subject: 'New sign-in from Chrome on Windows',
    spf_status: 'pass',
    dkim_status: 'pass',
    category: 'Safe',
    risk_score: 12,
  },
  {
    from: 'promo@super-lottery-win.co',
    subject: 'You’ve been selected for an exclusive reward!',
    spf_status: 'pass',
    dkim_status: 'fail',
    category: 'Spam',
    risk_score: 58,
  },
  {
    from: 'support@paypai-secure.com',
    subject: 'URGENT: Your account will be locked in 24 hours',
    spf_status: 'fail',
    dkim_status: 'fail',
    category: 'Phishing',
    risk_score: 91,
  },
  {
    from: 'unknown@random-mail-server.xyz',
    subject: 'Invoice attached',
    spf_status: 'unknown',
    dkim_status: 'none',
    category: 'Unknown',
    risk_score: 45,
  },
];

const EmailAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isTimeout, setIsTimeout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeEmail = useCallback(async () => {
    if (!selectedFile || isLoading) return;

    setIsLoading(true);
    setError('');
    setIsTimeout(false);
    setResult(null);

    try {
      if (USE_MOCK) {
        // ----- MOCK PATH: use dummy data for UI testing -----
        await new Promise(resolve => setTimeout(resolve, 1000)); // show loader

        // 25% chance: simulate timeout error to test retry flow
        const shouldTimeout = Math.random() < 0.25;
        if (shouldTimeout) {
          setError('Server taking too long. Please retry.');
          setIsTimeout(true);
          return;
        }

        // Randomly exercise SAFE / SPAM / PHISHING / UNKNOWN states
        const randomIndex = Math.floor(Math.random() * MOCK_RESULTS.length);
        const mock = MOCK_RESULTS[randomIndex];
        setResult(mock);
      } else {
        // ----- REAL BACKEND PATH -----
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, FETCH_TIMEOUT_MS);

        try {
          const formData = new FormData();
          formData.append('file', selectedFile);

          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });

          if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(
              text || `Server error (${response.status}) while analyzing email.`
            );
          }

          const data = await response.json();
          setResult(data);
        } finally {
          clearTimeout(timeoutId);
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Server taking too long. Please retry.');
        setIsTimeout(true);
      } else {
        setError(
          err.message ||
            'Something went wrong while analyzing the email. Please try again.'
        );
        setIsTimeout(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, isLoading]);

  const handleRetry = () => {
    if (!selectedFile) return;
    analyzeEmail();
  };

  const handleFileSelect = file => {
    setSelectedFile(file);
    setResult(null);
    setError('');
    setIsTimeout(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Upload an email and check its risk
        </h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Select a raw <span className="font-semibold">.eml</span> file from
          your inbox to quickly see who sent it, how trustworthy it looks, and
          how risky it might be.
        </p>
      </div>

      <FileUpload
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onAnalyze={analyzeEmail}
        isLoading={isLoading}
      />

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-300/70 bg-rose-50/80 p-3 text-sm text-rose-800 shadow-sm shadow-rose-200/80 dark:border-rose-500/70 dark:bg-rose-950/70 dark:text-rose-100 dark:shadow-black/70">
          <p className="flex-1 font-medium">{error}</p>
          <div className="flex items-center gap-2">
            {isTimeout && selectedFile && (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-rose-500/60 transition hover:bg-rose-500 active:scale-[0.97]"
              >
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setError('');
                setIsTimeout(false);
              }}
              className="text-xs font-medium text-rose-700 underline-offset-2 hover:underline dark:text-rose-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isLoading && <Loader />}

      {result && !isLoading && <ResultCard result={result} />}
    </div>
  );
};

export default EmailAnalyzer;