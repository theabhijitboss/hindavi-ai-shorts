import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in Vercel Environment Variables." },
        { status: 500 }
      );
    }

    const {
      topic,
      language = "Marathi",
      duration = "60",
      style = "Cinematic Story",
    } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Please enter a topic." }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const prompt = `Create a ${duration}-second ${style} short video in ${language}.
Topic: ${topic}

Return ONLY valid JSON with this exact shape:
{
  "title": "...",
  "script": "complete voiceover script",
  "scenes": [
    {
      "duration": 7,
      "visual": "short visual description",
      "narration": "voiceover for this scene",
      "image_prompt": "detailed cinematic image-generation prompt"
    }
  ]
}

Make 6-10 scenes whose durations approximately total ${duration} seconds.
Keep narration natural for ${language}.
Do not include markdown fences or any text outside the JSON.`;

    const response = await client.chat.completions.create({
      model: "gemini-3.8-flash",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a professional short-form video scriptwriter. Return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) throw new Error("Gemini returned an empty response.");

    const cleanText = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");

    return NextResponse.json(JSON.parse(cleanText));
  } catch (e) {
    console.error("Gemini generation error:", e);
    return NextResponse.json(
      { error: e?.message || "Gemini generation failed" },
      { status: 500 }
    );
  }
}
