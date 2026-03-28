import React, { useState } from "react";

export default function CVAnalyzerEnhanced() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF, JPG, PNG, and WEBP files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      setFile(null);
      return;
    }

    setError("");
    setResult(null);
    setFile(selectedFile);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a CV first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    // Fake API delay
    setTimeout(() => {
      setResult({
        name: "John Doe",
        email: "john@example.com",
        score: 82,
        skills: ["React", "JavaScript", "HTML", "CSS"],
        strengths: [
          "Strong frontend development skills",
          "Good technical stack coverage",
          "Clean project experience",
        ],
        improvements: [
          "Add more measurable achievements",
          "Improve summary section",
          "Include more keywords for ATS",
        ],
      });
      setLoading(false);
    }, 1800);
  };

  const resetPage = () => {
    setFile(null);
    setResult(null);
    setError("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">CV Analyzer</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your CV and get a quick AI-style analysis with score,
            detected skills, strengths, and improvement suggestions.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition ${
              dragActive
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-slate-700 bg-slate-950"
            }`}
          >
            <p className="text-lg font-semibold mb-2">
              Drag & drop your CV here
            </p>
            <p className="text-slate-400 mb-4">or click below to upload</p>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleInputChange}
              className="block mx-auto text-sm text-slate-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-cyan-500 file:text-white
                         hover:file:bg-cyan-600"
            />

            <p className="text-xs text-slate-500 mt-4">
              Supported: PDF, JPG, PNG, WEBP • Max size: 10MB
            </p>
          </div>

          {/* File Preview */}
          {file && (
            <div className="mt-5 bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={resetPage}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Remove
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze CV"}
            </button>

            <button
              onClick={resetPage}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Analyzing your CV...</p>
            <p className="text-slate-400 text-sm mt-1">
              Please wait while we process the file.
            </p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 grid gap-6">
            {/* Top summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Name</p>
                  <p className="font-semibold text-lg">{result.name}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="font-semibold text-lg">{result.email}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">CV Score</p>
                  <p className="font-semibold text-2xl text-cyan-400">
                    {result.score}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Detected Skills</h3>
              <div className="flex flex-wrap gap-3">
                {result.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths + Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((item, index) => (
                    <li
                      key={index}
                      className="bg-slate-800 rounded-xl p-3 text-slate-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-yellow-400">
                  Improvements
                </h3>
                <ul className="space-y-3">
                  {result.improvements.map((item, index) => (
                    <li
                      key={index}
                      className="bg-slate-800 rounded-xl p-3 text-slate-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}