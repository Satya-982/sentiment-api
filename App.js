import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    // Fix: Validate empty input before making API call
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/analyze?text=${encodeURIComponent(text)}`
      );

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResult(res.data.result[0]);
      }
    } catch (err) {
      // Fix: Show specific error instead of generic alert
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to API. Make sure the FastAPI server is running on port 8000.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Allow pressing Enter to trigger analysis
  const handleKeyDown = (e) => {
    if (e.key === "Enter") analyzeText();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1>Sentiment Analyzer 🤖</h1>

      <input
        type="text"
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: "8px", width: "300px", fontSize: "16px" }}
      />

      <button
        onClick={analyzeText}
        disabled={loading}
        style={{ marginLeft: "8px", padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2
            style={{
              color: result.label === "POSITIVE" ? "green" : "red",
            }}
          >
            {result.label}
          </h2>
          {/* Fix: Round score to 2 decimal places as percentage */}
          <p>Confidence: {(result.score * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
