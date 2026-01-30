import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string; placeId?: string };
}

export interface MapSearchResult {
  text: string;
  chunks: GroundingChunk[];
}

const getAIClient = () => {
  if (!API_KEY) {
    throw new Error("API Anahtarı bulunamadı.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const askGeminiWasteAdvisor = async (query: string): Promise<string> => {
  try {
    const ai = getAIClient();
    
    const systemPrompt = `
      Sen 'Toprağa Dönüş' projesi için bir atık uzmanısın.
      Hedef kitle: Ortaokul öğrencileri.
      Görev: Kullanıcının sorduğu nesnenin organik olup olmadığını, komposta girip girmeyeceğini veya hangi geri dönüşüm kutusuna atılması gerektiğini açıkla.
      Ton: Bilimsel ama anlaşılır, teşvik edici.
      Kural: Cevaplar kısa ve öz olmalı (maksimum 3 cümle).
      Önemli: Eğer nesne 'pil', 'elektronik' veya 'yağ' ise, bunun toprağı nasıl zehirlediğini 1 cümleyle vurgula.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${systemPrompt}\n\nSoru: ${query}`,
    });

    return response.text || "Şu an cevap oluşturulamadı.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bağlantı hatası oluştu. Lütfen tekrar deneyin.";
  }
};

export const findRecyclingStations = async (
  type: string,
  userLocation?: { lat: number; lng: number }
): Promise<MapSearchResult> => {
  try {
    const ai = getAIClient();

    const toolConfig = userLocation ? {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }
      }
    } : undefined;

    const prompt = userLocation 
      ? `Find ${type} recycling stations or collection points near my location. List them.`
      : `Find ${type} recycling stations or collection points in Istanbul. List them.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
      },
    });

    return {
      text: response.text || "Sonuç bulunamadı.",
      chunks: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || []
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return {
      text: "Harita servisine erişilemedi. Lütfen daha sonra tekrar deneyin.",
      chunks: []
    };
  }
};