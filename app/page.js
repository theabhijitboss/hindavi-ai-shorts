 "use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("Marathi");
  const [duration, setDuration] = useState("60");
  const [style, setStyle] = useState("Cinematic Story");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [error, setError] = useState("");

  async function generateScript() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, duration, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateImage(index, prompt) {
    setImageLoading((s) => ({ ...s, [index]: true }));
    setError("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_prompt: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed");
      setResult((old) => ({
        ...old,
        scenes: old.scenes.map((scene, i) =>
          i === index ? { ...scene, generated_image: data.image } : scene
        ),
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setImageLoading((s) => ({ ...s, [index]: false }));
    }
  }

  return (
    <main className="container">
      <div className="brand">
        <div className="logo">हिंदवी स्वराज</div>
        <span className="pill">AI SHORTS</span>
      </div>

      <section className="hero">
        <h1>AI Shorts तयार करा</h1>
        <p>Topic द्या → AI Script → Scenes → आता AI Images पण!</p>
      </section>

      <section className="card">
        <label>तुमचा Topic</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="उदा. छत्रपती शिवाजी महाराजांचे स्वराज्य..."
        />

        <div className="grid">
          <div>
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>Marathi</option>
              <option>Hindi</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <label>Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="30">30 sec</option>
              <option value="60">60 sec</option>
              <option value="90">90 sec</option>
            </select>
          </div>
          <div>
            <label>Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option>Cinematic Story</option>
              <option>Motivational</option>
              <option>Facts</option>
              <option>Emotional</option>
              <option>Educational</option>
            </select>
          </div>
        </div>

        <button className="primary" onClick={generateScript} disabled={loading || !topic.trim()}>
          {loading ? "AI Script तयार करत आहे..." : "Generate AI Short"}
        </button>

        {error && <div className="error">{error}</div>}
      </section>

      {result && (
        <section className="results">
          <div className="card">
            <h2>{result.title}</h2>
            <h3>🎙️ Script</h3>
            <p className="script">{result.script}</p>
          </div>

          <h2 className="section-title">🎬 Scenes & AI Images</h2>

          {result.scenes?.map((scene, index) => (
            <div className="scene card" key={index}>
              <div className="scene-head">
                <h3>Scene {index + 1}</h3>
                <span>{scene.duration}s</span>
              </div>
              <p><b>Visual:</b> {scene.visual}</p>
              <p><b>Narration:</b> {scene.narration}</p>
              <details>
                <summary>Image Prompt पाहा</summary>
                <p className="prompt">{scene.image_prompt}</p>
              </details>

              {scene.generated_image ? (
                <div className="image-wrap">
                  <img src={scene.generated_image} alt={`Scene ${index + 1}`} />
                  <a className="download" href={scene.generated_image} download={`scene-${index + 1}.png`}>
                    Download Image
                  </a>
                </div>
              ) : (
                <button
                  className="secondary"
                  onClick={() => generateImage(index, scene.image_prompt)}
                  disabled={imageLoading[index]}
                >
                  {imageLoading[index] ? "🖼️ Image तयार होत आहे..." : "🖼️ Generate Image"}
                </button>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
