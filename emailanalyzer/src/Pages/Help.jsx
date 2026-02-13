import React from "react";
import {
  HelpCircle,
  Upload,
  FileCheck,
  BarChart3,
  Mail,
  Shield,
  ChevronRight,
} from "lucide-react";

const FAQ = [
  {
    q: "What file format can I upload?",
    a: "Only .eml files (raw email files). You can save an email as .eml from Outlook, Gmail (via “Download message”), Thunderbird, or Apple Mail, then upload it here.",
  },
  {
    q: "What does the risk score mean?",
    a: "The score is from 0 to 10 (shown as 0–100%). Higher score means higher phishing risk. We combine content analysis, link checks, sender authentication (SPF/DKIM/DMARC), and metadata to calculate it.",
  },
  {
    q: "What are SPF, DKIM and DMARC?",
    a: "They are email authentication methods. SPF and DKIM help verify that the email was sent by the claimed domain. DMARC tells receivers what to do if verification fails. “Pass” means the sender domain is properly configured; “Fail” or missing records are red flags.",
  },
  {
    q: "Why is “From” or “To” sometimes empty?",
    a: "Some emails don’t have standard From/To headers, or the file might be incomplete. We show whatever the email file contains; if it’s missing, we display “—”.",
  },
  {
    q: "Is my email data stored?",
    a: "Uploaded files are processed temporarily and then deleted. We don’t store your email content. Use this tool only on emails you are allowed to analyze (e.g. your own or with permission).",
  },
];

const STEPS = [
  { icon: Upload, label: "Upload a .eml file", desc: "Drag & drop or browse to select the email file." },
  { icon: FileCheck, label: "We analyze it", desc: "Headers, links, sender auth, and content are checked." },
  { icon: BarChart3, label: "See the report", desc: "Risk score, From/To, SPF/DKIM/DMARC, and tips are shown." },
];

const Help = () => {
  return (
    <div className="mx-auto max-w-[900px] space-y-12">
      <div className="text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 sm:text-sm">
          Support
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] md:text-[28px]">
          Help
        </h2>
        <p className="mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
          How to use the Email Phishing Analyzer and what the results mean.
        </p>
      </div>

      {/* How it works */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Mail className="h-5 w-5 text-indigo-600" />
          How it works
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-slate-900">{step.label}</p>
                <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          Frequently asked questions
        </h3>
        <ul className="mt-4 space-y-4">
          {FAQ.map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="font-semibold text-slate-900">{item.q}</p>
              <p className="mt-2 text-sm text-slate-600">{item.a}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-indigo-600" />
          <div>
            <p className="font-semibold text-indigo-900">Ready to check an email?</p>
            <p className="text-sm text-indigo-800">
              Go to Dashboard and upload a .eml file to get your phishing risk report.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

export default Help;
