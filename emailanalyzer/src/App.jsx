
import React from 'react';
import Header from './Components/Header.jsx';
import EmailAnalyzer from './Pages/EmailAnalyzer.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-emerald-500/20 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-emerald-900/40 blur-3xl" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <EmailAnalyzer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;