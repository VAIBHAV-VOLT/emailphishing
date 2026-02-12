import React from 'react';
import DonutProgress from './DonutProgress.jsx';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const {
    from,
    subject,
    spf_status,
    dkim_status,
    category,
    risk_score,
  } = result;

  const normalizedCategory = (category || '').toString().toLowerCase();
  const isSafe =
    normalizedCategory === 'safe' || Number(risk_score) < 40;

  const bannerText = isSafe ? 'Email is SAFE' : 'Email is UNSAFE';
  const bannerSub = isSafe
    ? 'No strong phishing or spam indicators detected.'
    : 'Potentially malicious content or sender behavior detected. Handle with caution.';

  const bannerClasses = isSafe
    ? 'from-emerald-500/90 to-teal-400/90 text-emerald-900'
    : 'from-rose-500/90 to-orange-400/90 text-rose-950';

  return (
    <section className="mt-6 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-lg shadow-slate-200/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-black/70">
        <div
          className={`flex items-center justify-between gap-4 bg-gradient-to-r ${bannerClasses} px-5 py-3`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                {bannerText}
              </p>
              <p className="text-[11px] font-medium opacity-90">
                {bannerSub}
              </p>
            </div>
          </div>

          <div className="hidden text-[11px] font-mono uppercase tracking-[0.2em] text-white/80 sm:block">
            {normalizedCategory || 'Unknown'}
          </div>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:items-center">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                HEADER
              </p>
              <div className="rounded-xl bg-slate-50/90 p-3 text-sm shadow-sm shadow-slate-100 dark:bg-slate-900/90 dark:shadow-black/60">
                <p className="truncate">
                  <span className="font-semibold text-slate-600 dark:text-slate-200">
                    From:
                  </span>{' '}
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                    {from || 'Unknown sender'}
                  </span>
                </p>
                <p className="mt-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-200">
                    Subject:
                  </span>{' '}
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {subject || 'No subject'}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50/90 p-3 shadow-sm shadow-slate-100 dark:bg-slate-900/90 dark:shadow-black/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  SPF
                </p>
                <p
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    (spf_status || '').toLowerCase() === 'pass'
                      ? 'border-emerald-300/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/70 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-rose-300/80 bg-rose-50 text-rose-700 dark:border-rose-500/70 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      (spf_status || '').toLowerCase() === 'pass'
                        ? 'bg-emerald-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span>{spf_status || 'Unknown'}</span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50/90 p-3 shadow-sm shadow-slate-100 dark:bg-slate-900/90 dark:shadow-black/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  DKIM
                </p>
                <p
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    (dkim_status || '').toLowerCase() === 'pass'
                      ? 'border-emerald-300/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/70 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-rose-300/80 bg-rose-50 text-rose-700 dark:border-rose-500/70 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      (dkim_status || '').toLowerCase() === 'pass'
                        ? 'bg-emerald-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span>{dkim_status || 'Unknown'}</span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50/90 p-3 shadow-sm shadow-slate-100 dark:bg-slate-900/90 dark:shadow-black/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Category
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-100 dark:bg-slate-100 dark:text-slate-900">
                  <span className="px-2 py-1">
                    {(category || 'Unknown').toString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-50/90 p-4 text-center shadow-inner shadow-slate-100 dark:bg-slate-950/90 dark:shadow-black/70">
            <DonutProgress score={risk_score} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultCard;