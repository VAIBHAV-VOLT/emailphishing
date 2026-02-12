import React from "react";
import Header from "./Components/Header.jsx";
import EmailAnalyzer from "./Pages/EmailAnalyzer.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-sky-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
            <EmailAnalyzer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
