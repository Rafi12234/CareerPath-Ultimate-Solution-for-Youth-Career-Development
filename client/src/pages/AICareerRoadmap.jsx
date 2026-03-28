import React, { useState } from "react";

export default function AICareerRoadmapBasic() {
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");

  const generateRoadmap = () => {
    if (!targetRole.trim()) {
      setError("Please enter a target job title.");
      return;
    }

    setError("");
    setLoading(true);
    setRoadmap(null);

    // Fake response
    setTimeout(() => {
      setRoadmap({
        target_role: targetRole,
        summary: `This is a simple roadmap for becoming a ${targetRole}.`,
        current_strengths: ["HTML", "CSS", "JavaScript"],
        missing_skills: ["React", "Node.js", "System Design"],
        learning_path: [
          "Learn the basics",
          "Build small projects",
          "Practice interview questions",
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h1>AI Career Roadmap</h1>
      <p>Enter your target role and get a simple roadmap.</p>

      <input
        type="text"
        placeholder="Enter target role"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          marginBottom: "10px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={generateRoadmap}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Generate Roadmap
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      {loading && <p style={{ marginTop: "20px" }}>Generating roadmap...</p>}

      {roadmap && (
        <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "20px" }}>
          <h2>{roadmap.target_role}</h2>
          <p>{roadmap.summary}</p>

          <h3>Current Strengths</h3>
          <ul>
            {roadmap.current_strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Missing Skills</h3>
          <ul>
            {roadmap.missing_skills.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Learning Path</h3>
          <ol>
            {roadmap.learning_path.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}