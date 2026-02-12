import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/70 bg-[var(--card-bg)]/95 backdrop-blur shadow-md">
      <div className="mx-auto flex min-h-[96px] w-full max-w-[1560px] items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-10 xl:px-12">
        {/* Logo / App name */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] text-base font-semibold text-white shadow-sm shadow-indigo-300/70">
            EA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-text)] sm:text-sm">
              Email Security
            </span>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px] md:text-[30px]">
              Email Phishing Analyzer
            </h1>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-7 text-[17px] font-medium text-[var(--muted-text)] sm:flex">
          <button className="transition-transform transition-colors hover:-translate-y-0.5 hover:text-[var(--primary-color)]">
            Dashboard
          </button>
          <button className="transition-transform transition-colors hover:-translate-y-0.5 hover:text-[var(--primary-color)]">
            Security Tips
          </button>
          <button className="transition-transform transition-colors hover:-translate-y-0.5 hover:text-[var(--primary-color)]">
            Help
          </button>
        </nav>

        {/* Compact menu for mobile */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/70 text-xs font-semibold text-[var(--muted-text)] shadow-sm shadow-indigo-100/60 transition hover:-translate-y-0.5 hover:shadow-md sm:hidden"
          aria-label="Open navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
