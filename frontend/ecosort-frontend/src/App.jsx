import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [correctedCategory, setCorrectedCategory] = useState("");
  const [history, setHistory] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const analyzeWaste = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze the image.");

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setResult(data);

      const newHistoryItem = {
        item: data.detected_item,
        category: data.category,
        confidence: data.confidence,
        date: new Date().toLocaleString(),
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);

      localStorage.setItem(
        "ecosortHistory",
        JSON.stringify(updatedHistory)
      );
    } catch (err) {
      setError("Unable to analyze the image. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };
  const clearHistory = () => {
  setHistory([]);
  localStorage.removeItem("ecosortHistory");
};

  return (
    <div className="app">

      <header>
        <h1>♻️ EcoSort AI</h1>
        <p>Smart Waste Classification for a Sustainable Future</p>
      </header>

      <main>

        <div className="upload-card">
          <h2>📷 Upload Waste Image</h2>
          <p>Upload an image of a waste item and let AI identify it.</p>

          <label className="camera-button">
            📷 Take Photo or Upload Image
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Selected waste"
              className="preview-image"
            />
          )}

          <button onClick={analyzeWaste} disabled={loading}>
            {loading ? "🤖 AI is Analyzing..." : "🤖 Analyze Waste"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>

        {result && (
          <div className="result-card">
            <h2>♻️ AI Analysis Result</h2>

            <p><strong>🔍 Detected Item:</strong> {result.detected_item}</p>
            <p><strong>📊 Confidence:</strong> {result.confidence}</p>
            <p><strong>⚠️ AI Status:</strong> {result.warning}</p>
            <p><strong>🗑️ Waste Category:</strong> {result.category}</p>

            <h3>💡 Disposal Recommendation</h3>
            <p>{result.recommendation}</p>

            <h3>🌍 Sustainability Impact</h3>
            <p>{result.impact}</p>

            <h3>🤖 Top AI Predictions</h3>

            {result.all_predictions?.map((prediction, index) => (
              <p key={index}>
                <strong>{index + 1}. {prediction.label}</strong>
                {" — "}
                {(prediction.score * 100).toFixed(2)}%
              </p>
            ))}

            <h3>✏️ Is the category incorrect?</h3>

            <select
              value={correctedCategory}
              onChange={(e) => setCorrectedCategory(e.target.value)}
            >
              <option value="">Select the correct category</option>
              <option value="Recyclable">♻️ Recyclable</option>
              <option value="Organic Waste">🍌 Organic Waste</option>
              <option value="E-Waste">💻 E-Waste</option>
              <option value="Hazardous Waste">⚠️ Hazardous Waste</option>
              <option value="General Waste">🗑️ General Waste</option>
            </select>

            {correctedCategory && (
              <p>✅ Corrected Category: <strong>{correctedCategory}</strong></p>
            )}
          </div>
        )}
{history.length > 0 && (
  <div className="history-card">
    <h2>📊 Analysis History</h2>

    <button onClick={clearHistory} className="clear-button">
      🗑️ Clear History
    </button>

            {history.map((item, index) => (
              <div key={index} className="history-item">
                <p><strong>Item:</strong> {item.item}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Confidence:</strong> {item.confidence}</p>
                <p><strong>Date:</strong> {item.date}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      <section className="info-section">
        <h2>🤖 How EcoSort AI Works</h2>

        <div className="info-cards">
          <div className="info-card">
            <h3>1️⃣ Upload</h3>
            <p>Upload an image of a waste item.</p>
          </div>

          <div className="info-card">
            <h3>2️⃣ AI Analysis</h3>
            <p>AI analyzes the uploaded image and identifies the object.</p>
          </div>

          <div className="info-card">
            <h3>3️⃣ Waste Classification</h3>
            <p>EcoSort AI categorizes the detected item into an appropriate waste category.</p>
          </div>

          <div className="info-card">
            <h3>4️⃣ Sustainable Action</h3>
            <p>The system provides disposal recommendations and environmental impact.</p>
          </div>
        </div>
      </section>

      <section className="responsible-ai">
        <h2>⚖️ Responsible AI Considerations</h2>

        <div className="responsible-content">
          <p><strong>🔍 Transparency:</strong> EcoSort AI displays the detected item and AI confidence.</p>
          <p><strong>⚖️ Fairness:</strong> The system should be tested using diverse images to reduce inaccurate results.</p>
          <p><strong>🔒 Privacy:</strong> Uploaded images are used only for analysis and should not contain unnecessary personal information.</p>
          <p><strong>👤 Human Oversight:</strong> Users should verify important disposal decisions using local guidelines.</p>
        </div>
      </section>

      <section className="dashboard">
        <h2>📊 EcoSort AI Sustainability Dashboard</h2>

        <p className="dashboard-intro">
          Using AI-powered waste classification to support responsible waste management.
        </p>

        <div className="stats-container">
          <div className="stat-card">
            <h3>🤖 AI Powered</h3>
            <p>Image-based waste identification</p>
          </div>

          <div className="stat-card">
            <h3>♻️ 5 Categories</h3>
            <p>Recyclable, Organic, E-Waste, Hazardous and General Waste</p>
          </div>

          <div className="stat-card">
            <h3>🎯 SDG 12</h3>
            <p>Responsible Consumption and Production</p>
          </div>

          <div className="stat-card">
            <h3>🌍 Sustainable Action</h3>
            <p>Encouraging proper waste disposal decisions</p>
          </div>
        </div>
      </section>
      <footer>
        🌍 Supporting Sustainable Development Goal 12: Responsible Consumption and Production
      </footer>
    </div>
  );
}
export default App;