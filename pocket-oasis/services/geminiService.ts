import { GoogleGenAI, Type } from "@google/genai";
import { ZoneType, Quest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for speed/cost effectiveness on mobile
const MODEL_TEXT = "gemini-3-flash-preview";

export const generateQuest = async (zone: ZoneType, playerLevel: number): Promise<Quest> => {
  const prompt = `
    Generate a unique, engaging metaverse quest for a player level ${playerLevel} in the "${zone}" zone.
    The tone should match the zone:
    - Medieval: Epic, archaic language, dragons, magic.
    - Neon Arena: Tactical, aggressive, sci-fi slang.
    - Zen Garden: Peaceful, philosophical, finding balance.
    
    Return purely JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            objective: { type: Type.STRING },
            reward: { type: Type.NUMBER, description: "Credits reward between 50 and 500" },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
          },
          required: ["title", "description", "objective", "reward", "difficulty"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      title: data.title || "Unknown Quest",
      description: data.description || "Data corrupted...",
      objective: data.objective || "Survive",
      reward: data.reward || 100,
      difficulty: data.difficulty || "Medium",
      zone: zone
    };
  } catch (error) {
    console.error("AI Quest Gen Error:", error);
    // Fallback quest
    return {
      id: crypto.randomUUID(),
      title: "Network Glitch",
      description: "The AI quest generator is offline. Reboot the terminal.",
      objective: "Reconnect",
      reward: 50,
      difficulty: "Easy",
      zone: zone
    };
  }
};

export const generateNPCResponse = async (zone: ZoneType, playerInput: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `You are an NPC in the ${zone} of the OASIS metaverse. 
      Context: ${context}.
      Player said: "${playerInput}".
      Respond in character (max 2 sentences).`,
    });
    return response.text || "...";
  } catch (e) {
    return "I... I can't hear you clearly.";
  }
};