import { GoogleGenAI, Type } from "@google/genai";

export const fetchLiveNRLData = async (round: number, season: number) => {
  // Always initialize GoogleGenAI inside the function to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Find the official NRL ladder and fixtures for Round ${round}, Season ${season}.
    Specifically look for data from the NRL official website or reliable sporting news for the 2026 season.
    
    Return the data in a strict JSON format with the following structure:
    {
      "fixtures": [
        { "id": "string", "homeTeamName": "string", "awayTeamName": "string", "kickoff": "ISO string", "venue": "string" }
      ],
      "ladder": [
        { "teamName": "string", "rank": number, "played": number, "points": number, "differential": number }
      ]
    }
    
    Ensure team names match official NRL names (e.g., 'Penrith Panthers', 'Sydney Roosters').
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

    // NOTE: For Search Grounding, response.text might occasionally be unstable for JSON parsing.
    // We attempt to parse but provide a fallback structure.
    const text = response.text || "{}";
    let data = { fixtures: [], ladder: [] };
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Could not parse Gemini JSON response for NRL data:", e);
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "NRL Data Source",
      uri: chunk.web?.uri || "https://www.nrl.com"
    })) || [];

    return { data, sources };
  } catch (error) {
    console.error("Gemini Live Sync Error:", error);
    throw error;
  }
};

export const getRiskExplanation = async (teamName: string, opponentName: string, teamRank: number, opponentRank: number) => {
  // Always initialize GoogleGenAI inside the function to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    In the context of NRL (National Rugby League), explain briefly why picking ${teamName} (Rank ${teamRank}) to beat ${opponentName} (Rank ${opponentRank}) is considered a 'risky upset' this week.
    Provide 2-3 short, engaging points based on their ladder positions. Be conversational like a footy analyst.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No explanation available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The footy gods are silent right now, but that ranking gap says it all!";
  }
};