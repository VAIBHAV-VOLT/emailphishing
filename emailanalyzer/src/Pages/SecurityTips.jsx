import React from "react";
import {
  ShieldCheck,
  MailWarning,
  Link2,
  Lock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const TIPS = [
  {
    icon: MailWarning,
    title: "Verify sender address",
    body: "Always check the From and Reply-To fields. Phishers often use addresses that look like real ones (e.g. support@paypa1.com instead of paypal.com). Hover over links to see the real URL before clicking.",
  },
  {
    icon: Link2,
    title: "Don’t click suspicious links",
    body: "If an email asks you to log in or update details, open your browser and type the company’s website yourself. Never use links from the email. Our tool highlights risky URLs—treat them with caution.",
  },
  {
    icon: Lock,
    title: "Check SPF, DKIM & DMARC",
    body: "Legitimate senders usually have these authentication records. If our report shows SPF/DKIM/DMARC as Fail or missing, treat the email as suspicious and avoid sharing any personal or financial information.",
  },
  {
    icon: AlertTriangle,
    title: "Beware of urgency and threats",
    body: "Phishing emails often say “Act now”, “Account suspended”, or “Verify within 24 hours”. Real companies rarely pressure you this way. When in doubt, contact the company through their official website or phone number.",
  },
  {
    icon: ShieldCheck,
    title: "Use our analyzer before trusting",
    body: "Upload suspicious .eml files here to get a risk score and breakdown. High risk + failed authentication = do not trust the email. When unsure, forward it to your IT or security team.",
  },
];

const SecurityTips = () => {
  return (
    <div className="mx-auto max-w-[900px] space-y-10">
      <div className="text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 sm:text-sm">
          Stay safe
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] md:text-[28px]">
          Security Tips
        </h2>
        <p className="mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
          Simple habits to avoid phishing and keep your inbox safe.
        </p>
      </div>

      <div className="space-y-6">
        {TIPS.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-indigo-100/50 transition-all hover:shadow-lg sm:p-8"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {tip.title}
                </h3>
                <p className="mt-2 text-slate-600 sm:text-[15px]">{tip.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-slate-800">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-900">Quick rule of thumb</p>
            <p className="mt-1 text-sm text-emerald-800">
              If you didn’t expect the email, or something feels off—don’t click, don’t reply, don’t share data. Verify through official channels first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTips;
