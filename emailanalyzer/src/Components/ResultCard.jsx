import React from "react";
import DonutProgress from "./DonutProgress.jsx";

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
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900";
    if (value < 70)
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900";
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900";
  };

  const getAuthBadge = (status) => {
    const s = (status || "").toLowerCase();

    if (s === "pass")
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900";

    if (s === "fail")
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900";

    return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Risk Summary
        </p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
          Email Security Report
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Quick breakdown of authenticity and risk indicators.
        </p>
      </div>

      {/* Risk Meter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Risk Score
            </p>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              Based on sender trust + spam/phishing signals.
            </p>

            <span
              className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getRiskBadge(
                riskValue
              )}`}
            >
              {getRiskLabel(riskValue)}
            </span>
          </div>

          <div className="shrink-0 scale-90">
            <DonutProgress score={riskValue} />
          </div>
        </div>
      </div>

      {/* Email Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Email Header
        </p>

        <div className="mt-3 space-y-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              From
            </p>
            <p className="max-w-55 truncate text-right font-mono text-xs text-slate-800 dark:text-slate-100">
              {from || "Unknown sender"}
            </p>
          </div>

          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Subject
            </p>
            <p className="max-w-50 truncate text-right text-slate-800 dark:text-slate-100">
              {subject || "No subject"}
            </p>
          </div>

          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Category
            </p>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white dark:bg-slate-100 dark:text-slate-900">
              {normalizedCategory || "unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Authentication Checks
        </p>

        <div className="mt-4 space-y-3">
          {/* SPF */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              DMARC
            </p>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Not available
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Tip: If SPF/DKIM fails and risk is high, avoid clicking links or
        downloading attachments.
      </div>
    </div>
  );
};

export default ResultCard;
