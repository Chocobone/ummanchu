// /src/lib/geminiVideoAnalyzer.js
import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-2.0-flash-lite";

export async function analyzeVideoWithGemini(apiKey, base64Video, durationSec) {
  if (!apiKey) throw new Error("Gemini API 키가 없습니다.");

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  // Gemini가 이해할 수 있는 JSON 분석 요청
  const prompt = `
  당신은 영상 분석 전문가입니다.
  아래 base64 인코딩된 MP4 영상을 분석하고 다음 형식(JSON)으로만 답변하세요.

  {
    "scene_type": "",
    "main_subjects": [],
    "activities": [],
    "mood": "",
    "movement": "",
    "recommended_music_style": "",
    "tempo": "",
    "keywords": []
  }

  영상 길이는 약 ${durationSec}초입니다.
  반드시 JSON만 반환하세요. 설명 금지.
  `;

  // Gemini에 전달 (base64 → inlineData로 넣기)
  const response = await model.generateContent([
    {
      inlineData: {
        data: base64Video.split(",")[1],  // "data:video/mp4;base64,AAAA..." 에서 실제 base64만 추출
        mimeType: "video/mp4"
      }
    },
    { text: prompt }
  ]);

  // Gemini 응답 텍스트 파싱
  const text = response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini JSON 파싱 실패:", text);
    return { error: "JSON_PARSE_ERROR", raw: text };
  }
}
