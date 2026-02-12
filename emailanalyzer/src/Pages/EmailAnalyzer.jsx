import { useState } from "react";
import Header from "../Components/Header";
import FileUpload from "../Components/FileUpload";
import Loader from "../Components/Loader";
import ResultCard from "../Components/ResultCard";

const BACKEND_URL = "http://localhost:5000/analyze-email";

function EmailAnalyzer() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

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
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-linear-to-br from-indigo-100 to-purple-200 dark:from-slate-900 dark:to-slate-800 transition">
                <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

                <main className="flex flex-col items-center gap-6 p-6">
                    <FileUpload
                        selectedFile={selectedFile}
                        onFileSelect={setSelectedFile}
                        onAnalyze={handleAnalyzeClick}
                        isLoading={loading}
                    />

                    {loading && <Loader />}
                    {result && <ResultCard result={result} />}
                </main>
            </div>
        </div>
    );
}

export default EmailAnalyzer;
