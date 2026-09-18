import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in Vercel Environment Variables." },
        { status: 500 }
      );
    }

    const { image_prompt } = await req.json();

    if (!image_prompt?.trim()) {
      return NextResponse.json(
        { error: "Image prompt is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: image_prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part) => part.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      throw new Error("Gemini did not return an image.");
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const imageData = `data:${mimeType};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({ image: imageData });
  } catch (e) {
    console.error("Gemini image generation error:", e);
    return NextResponse.json(
      { error: e?.message || "Gemini image generation failed." },
      { status: 500 }
    );
  }
}
