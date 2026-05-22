import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateProductDescription({
  name,
  origin_country,
  category,
}) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a creative copywriter for Yumpora, an exotic snacks online store.
Write a short, fun, and enticing product description for this snack:

Product name: ${name}
Origin country: ${origin_country || "Unknown"}
Category: ${category || "Snack"}

Rules:
- Maximum 2 sentences
- Make it sound delicious and exotic
- Mention the country of origin naturally
- Fun and playful tone
- No hashtags, no emojis, no quotes
- Output ONLY the description, nothing else
    `.trim(),
  });

  return response.text.trim();
}
