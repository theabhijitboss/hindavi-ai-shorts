"use client";
import {useState} from "react";

export default function Home(){
  const [topic,setTopic]=useState("");
  const [language,setLanguage]=useState("Marathi");
  const [duration,setDuration]=useState("60");
  const [style,setStyle]=useState("Cinematic Story");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");

  async function generate(){
    if(!topic.trim()) return setError("कृपया Topic लिहा.");
    setLoading(true); setError(""); setResult(null);
    try{
      const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({topic,language,duration,style})});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"Generation failed");
      setResult(data);
    }catch(e){setError(e.message)}
    finally{setLoading(false)}
  }

  return <main>
    <header><div className="brand">हिंदवी स्वराज</div><div className="pill">AI SHORTS</div></header>
    <section className="hero">
      <div className="badge">✦ AI Story Studio</div>
      <h1>Topic टाका.<br/><span>Shorts Script तयार.</span></h1>
      <p>Marathi, Hindi किंवा English मध्ये cinematic short-video scripts, scenes, voiceover आणि visual prompts तयार करा.</p>
    </section>

    <section className="card">
      <label>तुमचा Topic / Idea</label>
      <textarea value={topic} onChange={e=>setTopic(e.target.value)}
        placeholder="उदा. छत्रपती शिवाजी महाराजांची एक प्रेरणादायी घटना..." />
      <div className="grid">
        <div><label>Language</label><select value={language} onChange={e=>setLanguage(e.target.value)}>
          <option>Marathi</option><option>Hindi</option><option>English</option></select></div>
        <div><label>Duration</label><select value={duration} onChange={e=>setDuration(e.target.value)}>
          <option value="30">30 sec</option><option value="60">60 sec</option><option value="90">90 sec</option></select></div>
        <div><label>Style</label><select value={style} onChange={e=>setStyle(e.target.value)}>
          <option>Cinematic Story</option><option>Motivational</option><option>Facts</option><option>Emotional</option><option>Educational</option></select></div>
      </div>
      <button onClick={generate} disabled={loading}>{loading?"Generating...":"✦ Generate AI Short"}</button>
      {error && <div className="error">{error}</div>}
    </section>

    {result && <section className="result">
      <div className="resultTop"><div><div className="small">GENERATED TITLE</div><h2>{result.title}</h2></div>
      <button className="copy" onClick={()=>navigator.clipboard.writeText(result.script)}>Copy Script</button></div>
      <div className="script">{result.script}</div>
      <h3>🎬 Scene Plan</h3>
      <div className="scenes">{result.scenes?.map((s,i)=><article key={i}>
        <b>Scene {i+1} · {s.duration}s</b><h4>{s.visual}</h4><p>{s.narration}</p>
        <div className="prompt">{s.image_prompt}</div>
      </article>)}</div>
      <div className="note">Next upgrade: AI voice + image generation + automatic MP4 rendering can be connected to this dashboard.</div>
    </section>}
    <footer>© 2026 Hindavi Swaraj Digital Services · AI Shorts Studio</footer>
  </main>
}
