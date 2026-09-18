import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const { image_prompt } = await req.json();
    if (!image_prompt?.trim()) {
      return NextResponse.json({ error: "Image prompt is required." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-image",
      input: image_prompt,
      response_format: [{
        type: "image",
        aspect_ratio: "9:16",
        image_size: "1K"
      }]
    });

    const image = interaction.output_image;
    if (!image?.data) throw new Error("Gemini did not return an image.");

    const mimeType = image.mime_type || "image/png";
    return NextResponse.json({ image: `data:${mimeType};base64,${image.data}` });
  } catch (e) {
    console.error("Image generation error:", e);
    return NextResponse.json(
      { error: e?.message || "Image generation failed.", status: e?.status || null },
      { status: 502 }
    );
  }
}
