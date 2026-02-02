"use client";

import { useState } from "react";

export default function EmailGeneratorPage() {
  const [jobDesc, setJobDesc] = useState("");
  const [company, setCompany] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateEmail() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch(
        `http://localhost:8000/email_des?job_description=${encodeURIComponent(jobDesc)}&company_name=${encodeURIComponent(company)}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Server error");
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1e1b4b",
            marginBottom: "8px"
          }}>
            Cold Email Generator
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: 0
          }}>
            Generate professional cold emails based on job descriptions
          </p>
        </div>

        {/* Form Container */}
        <div style={{
          background: "white",
          border: "2px solid #e9d5ff",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(124, 58, 237, 0.1)"
        }}>
          {/* Job Description Input */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e1b4b",
              marginBottom: "8px"
            }}>
              Job Description
            </label>
            <textarea
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={8}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                border: "2px solid #e9d5ff",
                borderRadius: "8px",
                fontFamily: "inherit",
                resize: "vertical",
                color: "#1e1b4b",
                outline: "none",
                transition: "border-color 0.2s, background-color 0.2s",
                boxSizing: "border-box",
                background: "#faf5ff"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c3aed";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9d5ff";
                e.target.style.background = "#faf5ff";
              }}
            />
          </div>

          {/* Company Name Input */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e1b4b",
              marginBottom: "8px"
            }}>
              Company Name
            </label>
            <input
              type="text"
              placeholder="Enter company name..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                border: "2px solid #e9d5ff",
                borderRadius: "8px",
                fontFamily: "inherit",
                outline: "none",
                color: "#1e1b4b",
                transition: "border-color 0.2s, background-color 0.2s",
                boxSizing: "border-box",
                background: "#faf5ff"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c3aed";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9d5ff";
                e.target.style.background = "#faf5ff";
              }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateEmail}
            disabled={loading || !jobDesc.trim() || !company.trim()}
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              background: loading || !jobDesc.trim() || !company.trim() 
                ? "rgba(124, 58, 237, 0.5)"
                : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              border: "none",
              borderRadius: "8px",
              cursor: loading || !jobDesc.trim() || !company.trim() 
                ? "not-allowed" 
                : "pointer",
              transition: "opacity 0.2s",
              fontFamily: "inherit"
            }}
            onMouseOver={(e) => {
              if (!loading && jobDesc.trim() && company.trim()) {
                e.currentTarget.style.opacity = "0.9";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && jobDesc.trim() && company.trim()) {
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block"
                }}></span>
                Generating...
              </span>
            ) : (
              "Generate Email"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "#fee2e2",
            border: "2px solid #fecaca",
            borderRadius: "8px",
            color: "#991b1b",
            fontSize: "14px"
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div style={{
            marginTop: "24px",
            background: "white",
            border: "2px solid #e9d5ff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(124, 58, 237, 0.1)"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e1b4b",
              marginTop: 0,
              marginBottom: "16px"
            }}>
              Generated Email
            </h3>
            <pre style={{
              background: "#faf5ff",
              padding: "20px",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#1e1b4b",
              lineHeight: "1.6",
              overflow: "auto",
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              border: "2px solid #e9d5ff"
            }}>
              {result}
            </pre>
          </div>
        )}
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}