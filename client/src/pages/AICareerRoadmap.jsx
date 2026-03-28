import React, { useState } from "react";

export default function AICareerRoadmapEnhanced() {
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");

  const generateRoadmap = () => {
    if (!targetRole.trim()) {
      setError("Please enter a target role.");
      return;
    }

    setError("");
    setLoading(true);
    setRoadmap(null);

    // Fake API response
    setTimeout(() => {
      setRoadmap({
        target_role: targetRole,
        match_score: 72,
        summary: `You already have some useful foundations for becoming a ${targetRole}. Focus on filling the most important skill gaps and building practical projects.`,
        current_strengths: ["HTML", "CSS", "JavaScript"],
        missing_skills: ["React", "Node.js", "System Design"],
        learning_path: [
          {
            phase: "Phase 1",
            focus: "Learn Fundamentals",
            actions: [
              "Understand core concepts",
              "Practice basics daily",
              "Complete beginner tutorials"
            ]
          },
          {
            phase: "Phase 2",
            focus: "Build Projects",
            actions: [
              "Create 2 small projects",
              "Upload work to GitHub",
              "Write short project descriptions"
            ]
          },
          {
            phase: "Phase 3",
            focus: "Prepare for Jobs",
            actions: [
              "Improve resume",
              "Practice interview questions",
              "Apply to relevant positions"
            ]
          }
        ],
        projects: [
          "Portfolio Website",
          "Task Management App",
          "Simple Blog Platform"
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const resetRoadmap = () => {
    setTargetRole("");
    setRoadmap(null);
    setError("");
    setLoading(false);
  };

  const scoreColor =
    roadmap?.match_score >= 80
      ? "#16a34a"
      : roadmap?.match_score >= 60
      ? "#0891b2"
      : "#d97706";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
            AI Career Roadmap
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "18px" }}>
            Enter your target role and get a simple career roadmap.
          </p>
        </div>

        {/* Input Section */}
        <div
          style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "30px",
            border: "1px solid #334155",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)"
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            Target Role
          </label>

          <input
            type="text"
            placeholder="e.g. Frontend Developer, Data Scientist"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #475569",
              background: "#0f172a",
              color: "white",
              fontSize: "16px",
              outline: "none",
              marginBottom: "14px",
              boxSizing: "border-box"
            }}
          />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={generateRoadmap}
              disabled={loading}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#06b6d4",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>

            <button
              onClick={resetRoadmap}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "1px solid #475569",
                background: "transparent",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          </div>

          {error && (
            <p style={{ color: "#f87171", marginTop: "14px" }}>{error}</p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #334155",
              textAlign: "center"
            }}
          >
            <p style={{ fontSize: "18px", margin: 0 }}>
              Generating your roadmap...
            </p>
          </div>
        )}

        {/* Result */}
        {roadmap && (
          <div style={{ display: "grid", gap: "20px" }}>
            {/* Summary Card */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #334155"
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
                {roadmap.target_role}
              </h2>

              <div
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: `${scoreColor}22`,
                  color: scoreColor,
                  fontWeight: "bold",
                  marginBottom: "16px"
                }}
              >
                Match Score: {roadmap.match_score}%
              </div>

              <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                {roadmap.summary}
              </p>
            </div>

            {/* Strengths and Missing Skills */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
              }}
            >
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #334155"
                }}
              >
                <h3 style={{ color: "#4ade80", marginTop: 0 }}>Current Strengths</h3>
                <ul style={{ paddingLeft: "20px", color: "#e2e8f0" }}>
                  {roadmap.current_strengths.map((item, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: "#1e293b",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #334155"
                }}
              >
                <h3 style={{ color: "#fbbf24", marginTop: 0 }}>Missing Skills</h3>
                <ul style={{ paddingLeft: "20px", color: "#e2e8f0" }}>
                  {roadmap.missing_skills.map((item, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Learning Path */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #334155"
              }}
            >
              <h3 style={{ marginTop: 0 }}>Learning Path</h3>

              <div style={{ display: "grid", gap: "16px" }}>
                {roadmap.learning_path.map((phase, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "18px"
                    }}
                  >
                    <h4 style={{ marginTop: 0, marginBottom: "8px", color: "#22d3ee" }}>
                      {phase.phase}
                    </h4>
                    <p style={{ marginTop: 0, color: "#cbd5e1", fontWeight: "bold" }}>
                      {phase.focus}
                    </p>
                    <ul style={{ paddingLeft: "20px", color: "#e2e8f0" }}>
                      {phase.actions.map((action, i) => (
                        <li key={i} style={{ marginBottom: "8px" }}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #334155"
              }}
            >
              <h3 style={{ marginTop: 0 }}>Recommended Projects</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px"
                }}
              >
                {roadmap.projects.map((project, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "16px",
                      color: "#e2e8f0"
                    }}
                  >
                    {project}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}