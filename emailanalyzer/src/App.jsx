import React from "react";
import Header from "./Components/Header.jsx";
import EmailAnalyzer from "./Pages/EmailAnalyzer.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#c7d2fe,transparent_55%),radial-gradient(circle_at_bottom_right,#fbcfe8,transparent_55%),linear-gradient(to_bottom_right,#eef2ff,#ffffff)] text-(--text-color)">
      <div className="flex min-h-screen flex-col">
        {/* Header section */}
        <Header />

        {/* Main content (upload + results) */}
        <main className="flex-1">
          <div className="mx-auto flex w-full max-w-390 flex-col px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
            <EmailAnalyzer />
          </div>
        </main>

        {/* Footer section */}
        <footer className="border-t border-white/70 bg-(--card-bg)/90 py-6 text-sm text-(--muted-text) shadow-sm sm:py-8">
          <div className="mx-auto flex w-full max-w-390 flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-10 xl:px-12">
            <p className="text-sm font-semibold tracking-tight sm:text-base md:text-[17px]">
              Email Phishing Analyzer
            </p>

          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
