import { useState } from "react";
import FileUpload from "../Components/FileUpload";
import Loader from "../Components/Loader";
import ResultCard from "../Components/ResultCard";

const BACKEND_URL = "http://localhost:5000//analyze_email_route";

function EmailAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyzeClick = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      {/* Main Upload Section */}
      <section
        aria-label="Upload email for phishing analysis"
        className="animate-fadeIn"
      >
        <div className="mx-auto w-full max-w-[1560px] rounded-3xl border border-gray-200/80 bg-[var(--card-bg)]/95 p-8 shadow-xl shadow-indigo-100/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:p-10 lg:p-12 lg:min-h-[280px]">
          <header className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-text)] sm:text-sm">
              Step 1
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-[24px] md:text-[26px]">
              Upload an email (.eml) to analyze
            </h2>
            <p className="max-w-2xl text-base text-[var(--muted-text)] sm:text-lg">
              Drag &amp; drop or browse to upload a raw email file. We&apos;ll
              analyze headers, authentication checks and overall phishing risk.
            </p>
          </header>

          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onAnalyze={handleAnalyzeClick}
            isLoading={loading}
          />
        </div>
      </section>

      {/* Result Section */}
      <section
        aria-label="Email phishing risk results"
        className="space-y-6"
      >
        {loading && (
          <div className="mx-auto w-full max-w-[1560px]">
            <Loader />
          </div>
        )}

        {result && (
          <div className="mx-auto w-full max-w-[1560px] rounded-3xl border border-pink-200 bg-pink-100 p-6 shadow-lg shadow-indigo-100/80 backdrop-blur-sm sm:p-8 lg:p-10 lg:min-h-[360px]">
            <ResultCard result={result} />
          </div>
        )}
      </section>
    </div>
  );
}

export default EmailAnalyzer;
