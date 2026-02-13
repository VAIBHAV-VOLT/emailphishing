import React from "react";
import DonutProgress from "./DonutProgress.jsx";
import { ShieldCheck, AlertTriangle, MailWarning, BarChart3 } from "lucide-react";

const ResultCard = ({ result }) => {
  if (result == null || typeof result !== "object") return null;
  if (result.error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <p className="font-semibold">Something went wrong</p>
        <p className="mt-2 text-sm">{String(result.error)}</p>
      </div>
    );
  }

  // Support both nested (data) and flat response from backend
  const data = result?.data != null ? result.data : result || {};
  const overall_score = data.overall_score;
  const risk_level = data.risk_level;
  const from_address = data.from_address ?? data.from;
  const to_address = data.to_address ?? data.to;
  const spf = data.spf;
  const dmarc = data.dmarc;
  const dkim = data.dkim;
  const originating_ip = data.originating_ip;
  const rawScores = data.component_scores;
  const details = data.details;

  const component_scores =
    rawScores && typeof rawScores === "object" && !Array.isArray(rawScores)
      ? rawScores
      : {};

  const scoreNum = Number(overall_score);
  const overallScoreOutOf10 = Number.isFinite(scoreNum) ? scoreNum : 0;
  const riskValue = Math.max(0, Math.min(100, (overallScoreOutOf10 / 10) * 100));

  const getRiskLabel = (value) => {
    if (value < 35) return "Low Risk";
    if (value < 70) return "Medium Risk";
    return "High Risk";
  };

  const getRiskBadge = (value) => {
    if (value < 35) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value < 70) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getAuthBadge = (status) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "pass" || s === "true") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "fail" || s === "false") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const extractStatus = (value) => {
    if (value === null || value === undefined) return "Fail";
    if (typeof value === "boolean") return value ? "Pass" : "Fail";
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "pass" || lower === "true") return "Pass";
      if (lower === "fail" || lower === "false") return "Fail";
      return value;
    }
    return String(value);
  };

  const getComponentLabel = (key) => {
    const labels = {
      transformer_score: "Content (AI)",
      security_check_score: "Security check",
      url_analyzer_score: "URL analyzer",
      metadata_score: "Metadata",
      ip_score: "IP analysis",
      url_score: "URL score",
    };
    return labels[key] ?? key.replaceAll("_", " ");
  };

  return (
    <div className="space-y-8 lg:space-y-10">
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] xl:gap-10">
        <div className="space-y-8">
          {/* Risk Score + Donut */}
          <div className="mx-auto w-full rounded-4xl border border-indigo-100 bg-linear-to-r from-indigo-50 via-white to-purple-50 p-px shadow-xl shadow-indigo-100/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-(--card-bg)/95 px-6 py-6 sm:flex-row sm:px-8 sm:py-7 lg:px-10 lg:py-8">
              <div>
                <p className="text-base font-semibold text-slate-900 sm:text-lg md:text-xl">
                  Risk Score
                </p>
                <p className="mt-1 text-sm text-slate-500 sm:text-[15px] md:text-base">
                  Based on sender trust + phishing indicators.
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500 sm:text-[13px]">
                  0 = safest, 100 = highest risk
                </p>

                <span
                  className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getRiskBadge(riskValue)}`}
                >
                  {risk_level != null && String(risk_level).trim() !== ""
                    ? String(risk_level)
                    : getRiskLabel(riskValue)}
                </span>
              </div>
              <div className="shrink-0 self-center scale-100 md:scale-105">
                <DonutProgress score={riskValue} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {/* From / To + Originating IP */}
            <div className="min-h-56 rounded-3xl border border-gray-200/80 bg-(--card-bg)/95 p-6 shadow-md shadow-indigo-100/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm md:text-[13px]">
                Email addresses
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    From
                  </p>
                  <p className="max-w-56 truncate text-right font-mono text-xs text-slate-900 sm:text-sm">
                    {from_address != null && String(from_address).trim() !== ""
                      ? String(from_address)
                      : "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    To
                  </p>
                  <p className="max-w-56 truncate text-right font-mono text-xs text-slate-900 sm:text-sm">
                    {to_address != null && String(to_address).trim() !== ""
                      ? String(to_address)
                      : "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">
                    Originating IP
                  </p>
                  <p className="max-w-44 truncate text-right font-mono text-xs text-slate-900 sm:text-sm">
                    {originating_ip != null && String(originating_ip).trim() !== ""
                      ? String(originating_ip)
                      : "Not found"}
                  </p>
                </div>
              </div>
            </div>

            {/* SPF / DKIM / DMARC */}
            <div className="min-h-56 rounded-3xl border border-gray-200/80 bg-(--card-bg)/95 p-6 shadow-md shadow-indigo-100/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm md:text-[13px]">
                Authentication checks
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">SPF</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getAuthBadge(extractStatus(spf))}`}>
                    {extractStatus(spf)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">DKIM</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getAuthBadge(extractStatus(dkim))}`}>
                    {extractStatus(dkim)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-[17px]">DMARC</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getAuthBadge(extractStatus(dmarc))}`}>
                    {extractStatus(dmarc)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Component scores */}
          <div className="rounded-3xl border border-gray-200/80 bg-(--card-bg)/95 p-6 shadow-md shadow-indigo-100/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm md:text-[13px]">
                Component scores
              </p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(component_scores).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {getComponentLabel(key)}
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {typeof value === "number" ? Number(value).toFixed(2) : String(value ?? "")}
                  </p>
                  {typeof value === "number" && <p className="mt-1 text-xs text-slate-500">out of 10</p>}
                </div>
              ))}
            </div>
            {Object.keys(component_scores).length === 0 && (
              <p className="mt-4 text-sm text-slate-500">No component score breakdown available.</p>
            )}
          </div>

          {details && typeof details === "object" && Object.keys(details).length > 0 && (
            <div className="rounded-3xl border border-gray-200/80 bg-(--card-bg)/95 p-6 shadow-md md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
                Details
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(details).map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                    <span className="text-[11px] font-semibold uppercase text-slate-500">{k.replaceAll("_", " ")}</span>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">{String(v ?? "—")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-[13px] text-slate-500">
            Tip: If SPF/DKIM/DMARC fail and the risk score is high, treat the email as suspicious.
          </div>
        </div>

        <aside className="flex h-full flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-xl shadow-indigo-100/80 backdrop-blur-sm sm:p-7 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-400/70">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Security tips</p>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">Stay safe with every email</p>
            </div>
          </div>
          <ul className="mt-3 space-y-3 text-sm text-slate-700 sm:text-[15px]">
            <li className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-sm">
                <MailWarning className="h-4 w-4" />
              </div>
              <p>Verify the sender&apos;s address and domain before clicking links.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <p>Be cautious of urgent requests for passwords or money.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
                <span className="text-xs font-bold">IT</span>
              </div>
              <p>When in doubt, forward the email to your IT team.</p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ResultCard;