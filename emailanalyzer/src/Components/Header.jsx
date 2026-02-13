import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navClass = (path) =>
    `transition-colors hover:text-white ${location.pathname === path ? "text-white font-semibold" : "text-slate-200"}`;

  const mobileNavClass = (path) =>
    `block rounded-lg px-4 py-3 text-[15px] font-medium ${location.pathname === path ? "bg-white/15 text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex min-h-[88px] w-full max-w-[1560px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Logo / App name */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-blue-500 via-purple-500 to-emerald-500 text-base font-bold text-white shadow-lg shadow-purple-900/40">
            TL
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-[26px]">
              ThreatLens
            </h1>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 sm:text-sm">
              Email Security
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 text-[15px] font-medium sm:flex">
          <Link to="/upgrade" className={navClass("/upgrade")}>
            Upgrade
          </Link>
          <Link to="/security-tips" className={navClass("/security-tips")}>
            Security Tips
          </Link>
          <Link to="/help" className={navClass("/help")}>
            Help
          </Link>
        </nav>

        {/* Mobile menu */}
        <div className="relative sm:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-slate-200"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
          {mobileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                aria-hidden="true"
                onClick={() => setMobileOpen(false)}
              />
              <nav
                className="absolute right-0 top-full z-40 mt-2 w-48 rounded-xl border border-white/20 bg-slate-900 py-2 shadow-xl"
                aria-label="Mobile navigation"
              >
                <Link to="/upgrade" className={mobileNavClass("/upgrade")} onClick={() => setMobileOpen(false)}>
                  Upgrade
                </Link>
                <Link to="/security-tips" className={mobileNavClass("/security-tips")} onClick={() => setMobileOpen(false)}>
                  Security Tips
                </Link>
                <Link to="/help" className={mobileNavClass("/help")} onClick={() => setMobileOpen(false)}>
                  Help
                </Link>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
