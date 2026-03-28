import React, { useState } from "react";

export default function CVAnalyzerBasic() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    setLoading(true);

    // Fake API simulation
    setTimeout(() => {
      setResult({
        name: "John Doe",
        score: 75,
        skills: ["React", "JavaScript", "HTML"],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>CV Analyzer</h2>

      {/* File Upload */}
      <input type="file" onChange={handleFileChange} />

      <br /><br />

      {/* Analyze Button */}
      <button onClick={handleAnalyze}>
        Analyze CV
      </button>

      {/* Loading */}
      {loading && <p>Analyzing...</p>}

      {/* Result */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result</h3>
          <p><b>Name:</b> {result.name}</p>
          <p><b>Score:</b> {result.score}</p>
          <p><b>Skills:</b> {result.skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}