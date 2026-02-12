import React from "react";
import DonutProgress from "./DonutProgress.jsx";
import { ShieldCheck, AlertTriangle, MailWarning } from "lucide-react";

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

  const normalizedCategory = (category || "").toString().toLowerCase();

  const riskValue = Math.max(0, Math.min(100, Number(risk_score) || 0));

  const getRiskLabel = (value) => {
    if (value < 35) return "Low Risk";
    if (value < 70) return "Medium Risk";
    return "High Risk";
  };

  const getRiskBadge = (value) => {
    if (value < 35)
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value < 70)
      return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getAuthBadge = (status) => {
    const s = (status || "").toLowerCase();

    if (s === "pass")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    if (s === "fail")
      return "bg-rose-50 text-rose-700 border-rose-200";

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Section title */}
      <div className="text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--muted-text) sm:text-sm">
          Risk Summary
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-[26px]">
          Email Security Report
        </h3>
        <p className="mt-2 text-sm text-(--muted-text) sm:text-base">
          Quick breakdown of authenticity and risk indicators.
        </p>
      </div>

      {/* Main grid: report + tips sidebar */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] xl:gap-10">
        {/* Left: detailed report */}
        <div className="space-y-8">
          {/* Top: Risk score card */}
          <div className="mx-auto w-full rounded-4xl border border-indigo-100 bg-linear-to-r from-indigo-50 via-white to-purple-50 p-px shadow-xl shadow-indigo-100/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-(--card-bg)/95 px-6 py-6 sm:flex-row sm:px-8 sm:py-7 lg:px-10 lg:py-8">
              <div>
                <p className="text-base font-semibold text-slate-900 sm:text-lg md:text-xl">
                  Risk Score
                </p>
                <p className="mt-1 text-sm text-slate-500 sm:text-[15px] md:text-base">
                  Based on sender trust + spam/phishing signals.
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500 sm:text-[13px]">
                  0 = safest, 100 = highest risk
                </p>
                <span
                  className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getRiskBadge(
                    riskValue
                  )}`}
                >
                  {getRiskLabel(riskValue)}
                </span>
              </div>

              <div className="shrink-0 self-center scale-100 md:scale-105">
                <DonutProgress score={riskValue} />
              </div>
            </div>
          </div>

          {/* Bottom: two info cards side by side */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {/* Email Header Details */}
            <div className="min-h-52.5 rounded-3xl border border-gray-200/80 bg-(--card-bg)/95 p-6 shadow-md shadow-indigo-100/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm md:text-[13px]">
                Email Header
              </p>

              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    From
                  </p>
                  <p className="max-w-80 truncate text-right font-mono text-xs text-slate-900 sm:text-sm md:text-[15px]">
                    {from || "Unknown sender"}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    Subject
                  </p>
                  <p className="max-w-80 truncate text-right text-slate-900 sm:text-sm md:text-[15px]">
                    {subject || "No subject"}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    Category
                  </p>
                  <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white sm:text-xs">
                    {normalizedCategory || "unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Authentication Checks */}
            <div className="min-h-52.5 rounded-3xl border border-gray-200/80 bg-(--card-bg)/95 p-6 shadow-md shadow-indigo-100/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm md:text-[13px]">
                Authentication Checks
              </p>

              <div className="mt-5 space-y-4">
                {/* SPF */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    SPF
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getAuthBadge(
                      spf_status
                    )}`}
                  >
                    {spf_status || "Unknown"}
                  </span>
                </div>

                {/* DKIM */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    DKIM
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getAuthBadge(
                      dkim_status
                    )}`}
                  >
                    {dkim_status || "Unknown"}
                  </span>
                </div>

                {/* DMARC Placeholder */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    DMARC
                  </p>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    Not available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-[13px] text-slate-500">
            Tip: If SPF/DKIM fails and the risk score is high, treat the email
            as suspicious and avoid clicking links or downloading attachments.
          </div>
        </div>

        {/* Right: security tips sidebar */}
        <aside className="flex h-full flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-xl shadow-indigo-100/80 backdrop-blur-sm sm:p-7 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-400/70">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Security Tips
              </p>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                Stay safe with every email
              </p>
            </div>
          </div>

          <ul className="mt-3 space-y-3 text-sm text-slate-700 sm:text-[15px]">
            <li className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-sm">
                <MailWarning className="h-4 w-4" />
              </div>
              <p>
                Always verify the <span className="font-semibold">sender&apos;s address</span> and
                domain before clicking links.
              </p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <p>
                Be cautious of <span className="font-semibold">urgent requests</span> for passwords,
                money, or sensitive information.
              </p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
                <span className="text-xs font-bold">IT</span>
              </div>
              <p>
                When in doubt, <span className="font-semibold">forward the email to your IT team</span>{' '}
                for manual review.
              </p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ResultCard;
