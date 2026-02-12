import React from "react";
import Header from "./Components/Header.jsx";
import EmailAnalyzer from "./Pages/EmailAnalyzer.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 dark:bg-[#0f172a] dark:text-slate-50">
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
            <EmailAnalyzer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
