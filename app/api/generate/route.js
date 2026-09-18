import OpenAI from "openai";
import {NextResponse} from "next/server";

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:"OPENAI_API_KEY is missing in server environment."},{status:500});
    const {topic,language="Marathi",duration="60",style="Cinematic Story"}=await req.json();
    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const prompt=`Create a ${duration}-second ${style} short video in ${language}.
Topic: ${topic}
Return ONLY valid JSON with this shape:
{"title":"...","script":"complete voiceover script","scenes":[{"duration":7,"visual":"short visual description","narration":"voiceover for this scene","image_prompt":"detailed cinematic image-generation prompt"}]}
Make 6-10 scenes whose durations approximately total ${duration} seconds. Keep narration natural for ${language}. Do not include markdown fences.`;
    const response=await client.chat.completions.create({
      model:"gpt-4o-mini",
      temperature:0.8,
      response_format:{type:"json_object"},
      messages:[
        {role:"system",content:"You are a professional short-form video scriptwriter."},
        {role:"user",content:prompt}
      ]
    });
    const text=response.choices[0].message.content;
    return NextResponse.json(JSON.parse(text));
  }catch(e){
    console.error(e);
    return NextResponse.json({error:e.message||"Generation failed"},{status:500});
  }
}
