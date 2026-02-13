import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header.jsx";
import EmailAnalyzer from "./Pages/EmailAnalyzer.jsx";
import SecurityTips from "./Pages/SecurityTips.jsx";
import Help from "./Pages/Help.jsx";
import Upgrade from "./Pages/Upgrade.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#c7d2fe,transparent_55%),radial-gradient(circle_at_bottom_right,#fbcfe8,transparent_55%),linear-gradient(to_bottom_right,#eef2ff,#ffffff)] text-(--text-color)">
        <div className="flex min-h-screen flex-col">
          {/* Header section */}
          <Header />

          {/* Main content - routes */}
          <main className="flex-1">
            <div className="mx-auto flex w-full max-w-390 flex-col px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
              <Routes>
                <Route path="/" element={<EmailAnalyzer />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/security-tips" element={<SecurityTips />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </div>
          </main>

        {/* Footer section */}
        <footer className="border-t border-white/70 bg-(--card-bg)/90 py-6 text-sm text-(--muted-text) shadow-sm sm:py-8">
          <div className="mx-auto flex w-full max-w-[1560px] flex-col items-center gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-10 xl:px-12">
            <div className="min-w-0 flex-1 text-center sm:min-w-[55%] sm:text-left">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 sm:text-base">
                Think before you click.
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                © {new Date().getFullYear()} ThreatLens. All rights reserved.
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 sm:text-base md:text-[17px]">
              ThreatLens
            </p>
          </div>
        </footer>
      </div>
    </div>
    </BrowserRouter>
  );
};

export default App;
