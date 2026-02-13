import { GoogleGenAI } from "@google/genai";

export interface LiveNRLResponse {
  fixtures: any[];
  ladder: any[];
  sources: { title: string; uri: string }[];
}

export const fetchNRLDataFromSite = async (round: number = 1): Promise<LiveNRLResponse> => {
  // Always initialize GoogleGenAI inside the function to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // We use the specific URLs requested by the user in the prompt to ensure accuracy
  const prompt = `
    Find the official NRL ladder and draw for Round ${round}, Season 2026.
    Check these specific URLs:
    Ladder: https://www.nrl.com/ladder/?competition=111&round=${round}&season=2026
    Draw/Fixtures: https://www.nrl.com/draw/?competition=119&round=${round}&season=2026

    Return a JSON object with:
    1. "fixtures": list of matches with { homeTeam, awayTeam, kickoff (ISO string), venue }
    2. "ladder": list of teams with { teamName, rank, played, points, differential }

    Important: Ensure team names are accurate (e.g. "Melbourne Storm").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    // Handle potential parsing issues with grounded text responses safely
    const text = response.text || "{}";
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Gemini returned invalid JSON for NRL site data:", e);
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "NRL.com",
      uri: chunk.web?.uri || "https://www.nrl.com"
    })) || [];

    return {
      fixtures: data.fixtures || [],
      ladder: data.ladder || [],
      sources
    };
  } catch (error) {
    console.error("NRL API Service Error:", error);
    throw error;
  }
};