import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const { topic, language = "Marathi", duration = "60", style = "Cinematic Story" } = await req.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: "Please enter a topic." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Create a ${duration}-second ${style} short video in ${language}.
Topic: ${topic}

Create 6-10 scenes whose durations approximately total ${duration} seconds.
Keep narration natural and engaging for ${language}.
For every scene, provide a concise visual description and a detailed cinematic image-generation prompt suitable for a 9:16 vertical short video.`;

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        script: { type: "string" },
        scenes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              duration: { type: "integer" },
              visual: { type: "string" },
              narration: { type: "string" },
              image_prompt: { type: "string" }
            },
            required: ["duration", "visual", "narration", "image_prompt"]
          }
        }
      },
      required: ["title", "script", "scenes"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
      response_format: [{
        type: "text",
        mime_type: "application/json",
        schema
      }]
    });

    const text = interaction.output_text;
    if (!text) throw new Error("Gemini returned an empty response.");

    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    console.error("Script generation error:", e);
    return NextResponse.json(
      { error: e?.message || "Script generation failed.", status: e?.status || null },
      { status: 502 }
    );
  }
}
