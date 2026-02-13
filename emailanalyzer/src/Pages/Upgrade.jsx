import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MessageCircle,
  Image,
  HardDrive,
  Users,
  Workflow,
  Play,
  Clock,
  FlaskConical,
  X,
} from "lucide-react";

const FREE_FEATURES = [
  { icon: Sparkles, text: "Get simple explanations" },
  { icon: MessageCircle, text: "Quick phishing risk summary for each email" },
  { icon: Image, text: "View From, To, SPF, DKIM & DMARC in one report" },
  { icon: HardDrive, text: "Save limited memory and context" },
];

const PRO_FEATURES = [
  { icon: Sparkles, text: "Unlimited email analysis per month" },
  { icon: MessageCircle, text: "Detailed risk score with component breakdown" },
  { icon: Image, text: "Full report: From, To, URLs, SPF, DKIM & DMARC" },
  { icon: HardDrive, text: "Save and revisit your analysis history" },
  { icon: Users, text: "Share reports with your team" },
  { icon: Workflow, text: "URL and link safety analysis in every report" },
  { icon: Play, text: "Originating IP and infrastructure checks" },
  { icon: Clock, text: "Faster, priority analysis" },
  { icon: FlaskConical, text: "Early access to new security checks" },
];

const Upgrade = () => {
  return (
    <div className="min-h-[80vh] rounded-2xl bg-slate-900 px-4 py-8 text-white sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Top bar: title + close */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Upgrade your plan
          </h2>
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>

        {/* Two plan cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free plan */}
          <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-xl sm:p-8">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Free</h3>
            <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              ₹0 <span className="text-base font-normal text-slate-400">/ month</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">Get started with email phishing analysis</p>
            <p className="mt-1 text-sm font-medium text-slate-300">Check 50 emails per month</p>

            <div className="mt-6 flex flex-1 flex-col">
              <button
                type="button"
                disabled
                className="w-full rounded-xl bg-slate-600 py-3 text-sm font-medium text-slate-300"
              >
                Your current plan
              </button>

              <ul className="mt-6 space-y-4">
                {FREE_FEATURES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-300">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-6 text-left text-xs text-slate-500">
              Have an existing plan?{" "}
              <button type="button" className="text-indigo-400 underline hover:text-indigo-300">
                See billing help
              </button>
            </p>
          </div>

          {/* Pro plan */}
          <div className="flex flex-col rounded-2xl border border-slate-600 bg-slate-800/80 p-6 shadow-xl sm:p-8">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Pro</h3>
            <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              ₹99 <span className="text-base font-normal text-slate-400">/ month</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">(inclusive of GST)</p>
            <p className="mt-0.5 text-sm text-slate-400">Maximize your email security</p>

            <div className="mt-6 flex flex-1 flex-col">
              <button
                type="button"
                className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
              >
                Upgrade to Pro
              </button>

              <ul className="mt-6 space-y-4">
                {PRO_FEATURES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-300">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-6 text-left text-xs text-slate-500">
              Fair use policy applies.{" "}
              <button type="button" className="text-indigo-400 underline hover:text-indigo-300">
                Learn more
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
