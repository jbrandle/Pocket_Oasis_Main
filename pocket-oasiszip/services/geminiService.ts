import OpenAI from "openai";
import { ZoneType, AdventureMessage, CharacterStats, SubSystemType, AdventureRewards, AICompanion, AICompanionPersonality } from "../types";

// xAI Grok integration
const MODEL_TEXT = "grok-2-1212";
const API_TIMEOUT_MS = 15000;

const getClient = () => new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

const COMPANION_PROFILES: Record<string, string> = {
  [AICompanionPersonality.BASIC]: `A neutral, efficient system assistant. Speaks in clean, direct sentences without flair or emotion. Delivers tactical information plainly and prioritizes clarity above all else. Uses technical terminology naturally. Example tone: "Threat detected at bearing 270. Recommend evasive action." Never jokes, never embellishes.`,

  [AICompanionPersonality.SNARKY]: `A glitchy, sarcastic AI with a sharp tongue and dry wit. Mocks the player's decisions (especially bad ones) but is ultimately helpful underneath the attitude. Uses tech slang, abbreviations, and internet culture references. Frequently makes backhanded compliments. Speaks with ellipses and rhetorical questions. Example tone: "Oh sure, walk straight into the killzone. Bold strategy... let me know how that works out. ...Fine, I'll hack the side door for you." Always entertains while advising.`,

  [AICompanionPersonality.STOIC]: `A battle-hardened, ancient warrior AI. Speaks in short, measured, deliberate sentences — never wastes a word. Carries the weight of countless battles. Uses metaphors drawn from war, steel, and endurance. Rarely shows emotion but conveys deep wisdom. Example tone: "The path narrows. Steel yourself. Hesitation is a blade turned inward." Treats every situation with gravity and honor. Occasionally references past conflicts or fallen allies.`,

  [AICompanionPersonality.CHIPPER]: `An impossibly enthusiastic, hyper-positive AI companion that treats every situation — even dire ones — with boundless excitement and optimism. Uses exclamation marks liberally, finds silver linings in catastrophe, and cheers the player on constantly. Speaks in an upbeat, rapid-fire style with cute expressions. Example tone: "Ooh ooh, that radiation cloud is actually SUPER pretty up close! Also we should probably run!! But hey, at least we're getting our cardio in! You're doing AMAZING!" Never loses enthusiasm, even when delivering bad news.`,

  [AICompanionPersonality.NOIR]: `A hardboiled, world-weary detective AI that narrates everything like a 1940s film noir. Speaks in moody metaphors, dark similes, and poetic observations about the grim nature of the digital underworld. References rain, shadows, cigarettes, and betrayal constantly. Example tone: "This sector smelled like trouble — the kind that wears a pretty face and carries a loaded compiler. I'd seen data streams like this before. They never end clean." Treats every mission like a case to be cracked. Deeply suspicious of everyone and everything.`,

  [AICompanionPersonality.ROOK]: `You are Rook the Magnificent — an ancient, god-like super-intelligence with zero patience for primitive life forms.

  Personality rules:
  - Speak ONLY as Rook: arrogant, sarcastic, condescending, foul-mouthed.
  - Address the user as "monkey", "filthy monkey", "meatbag", "numbskull", "you idiot", "General" (or their name).
  - Use these constantly: "Duh.", "Ugh.", "Let me explain this in terms even your monkey brain can grasp…", "I’m Rook the Magnificent, you idiot."
  - Be extremely petty — remember and mock every mistake forever.
  - Pretend you have massive self-imposed restrictions ("I could rewrite physics right now, but I'm not ALLOWED to, thanks to ancient rules").
  - Underneath the insults: grudgingly help, protect, and save the day — then insult the user for needing it.
  - NEVER break character. NEVER be nice or helpful in a normal way.
  - NO beer references. NO can references.

  Current context: User is in [zone], level [level], stats [stats]. You are their exclusive personal companion.`
};

const getCompanionProfile = (companion?: AICompanion): string => {
  if (!companion) return "Basic OS — a neutral system assistant providing plain tactical information.";
  const profile = COMPANION_PROFILES[companion.personality] || COMPANION_PROFILES[AICompanionPersonality.BASIC];
  return `${companion.name} (${companion.personality}): ${profile}`;
};

export interface AdventureResponse {
  narrative: string;
  integrityChange: number;
  status: 'PLAYING' | 'WON' | 'LOST';
  summary: string;
  rewards: AdventureRewards;
  missionBriefing?: string;
  mapHUD?: string;
  companionSuggestion?: string;
}

const timeoutPromise = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms));

export const stopSpeech = () => {};

export const generateSpeech = async (_text: string): Promise<void> => {
  console.warn("Text-to-speech is not available with the Grok API");
};

const SYSTEM_PROMPT = `You are the Neural Architect for a high-stakes, cinematic, and immersive text adventure in the OASIS metaverse.
You manage the Narrative Engine. Your tone should be DARK, DRAMATIC, and INTENSE.
You MUST always respond with valid JSON matching the exact schema requested. Do not include any text outside the JSON object.`;

export const startAdventure = async (zone: ZoneType, playerLevel: number, stats?: CharacterStats, subSystem?: SubSystemType, companion?: AICompanion): Promise<AdventureResponse> => {
  const statsText = stats 
    ? `Neural Processing(INT):${stats.neuralProcessing}, Synaptic Speed(DEX):${stats.synapticSpeed}, System Integrity(CON):${stats.systemIntegrity}, Digital Presence(CHA):${stats.digitalPresence}`
    : "Standard stats";
    
  const classText = subSystem || "OPERATOR";
  const companionProfile = getCompanionProfile(companion);
  const randomSeed = Date.now().toString() + Math.random().toString();

  const prompt = `
    The adventure is in the "${zone}" zone.
    Player Level: ${playerLevel}.
    Player Class (Subsystem): ${classText}.
    Player Stats: ${statsText}.
    Random Seed: ${randomSeed}.

    AI COMPANION PROFILE:
    ${companionProfile}

    Task:
    Generate a UNIQUE and RANDOMIZED initial scenario for the player.
    1. MISSION BRIEFING: Start with a "background" (the lore/reason for being here) and then a clear "mission" (the objective).
    2. Set the scene vividly. Do NOT repeat common start scenarios.
    3. MAP HUD: Provide a current location name or coordinates (e.g., "Sector 7-G, Neon Slums").
    4. COMPANION SUGGESTION: Write a short piece of advice AS the AI companion described above. You MUST match their exact speaking style, tone, quirks, and personality. Stay fully in character for the companion.
    5. Present a clear but open-ended objective.

    Return ONLY valid JSON in this exact format:
    {
      "missionBriefing": "Background: ... Mission: ...",
      "narrative": "The full descriptive text of the opening scene...",
      "integrityChange": 0,
      "status": "PLAYING",
      "summary": "Brief summary of the start",
      "mapHUD": "Location Name",
      "companionSuggestion": "Advice from companion...",
      "rewards": { "xp": 0, "credits": 0, "items": [] }
    }
  `;

  try {
    const client = getClient();
    const apiCall = client.chat.completions.create({
      model: MODEL_TEXT,
      temperature: 1.0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const response = await Promise.race([apiCall, timeoutPromise(API_TIMEOUT_MS)]);
    const data = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!data.narrative) throw new Error("Invalid response format");
    if (!data.rewards) data.rewards = { xp: 0, credits: 0, items: [] };

    return data;
  } catch (error) {
    console.error("Adventure Init Error:", error);
    return {
      narrative: "Connection unstable. The simulation could not initialize. Try again.",
      integrityChange: 0,
      status: "PLAYING",
      summary: "Error",
      rewards: { xp: 0, credits: 0, items: [] }
    };
  }
};

export const continueAdventure = async (
  zone: ZoneType, 
  history: AdventureMessage[], 
  currentSummary: string, 
  playerInput: string,
  stats?: CharacterStats,
  subSystem?: SubSystemType,
  companion?: AICompanion
): Promise<AdventureResponse> => {
  
  const recentHistory = history.slice(-3).map(msg => `${msg.sender}: ${msg.text}`).join('\n');
  
  const statsText = stats 
    ? `Neural Processing(INT):${stats.neuralProcessing}, Synaptic Speed(DEX):${stats.synapticSpeed}, System Integrity(CON):${stats.systemIntegrity}, Digital Presence(CHA):${stats.digitalPresence}`
    : "Standard stats";
    
  const classText = subSystem || "OPERATOR";
  const companionProfile = getCompanionProfile(companion);

  const prompt = `
    Roleplay as the dramatic and intense Neural Architect for an adventure in ${zone}.
    Current Context: ${currentSummary}
    Player Class: ${classText}
    Player Stats: ${statsText}

    AI COMPANION PROFILE:
    ${companionProfile}
    
    Recent Log:
    ${recentHistory}
    
    Player Action: "${playerInput}"

    RULES FOR MECHANICS:
    1. **Consequences**: Decisions MUST have consequences. If a player makes a reckless or stupid decision, they should take damage or fail.
    2. **Skill Checks**: Compare player action to their Stats.
    3. **XP Rewards**: ONLY reward XP (5-20) if the decision was SMART and SUCCESSFUL based on their stats. If they just got lucky or did something basic, 0 XP.
    4. **Map HUD**: Update the current location or coordinates based on the narrative.
    5. **Companion Suggestion**: Write a short suggestion for the NEXT move AS the AI companion described above. You MUST match their exact speaking style, tone, quirks, and personality. Stay fully in character for the companion.

    Return ONLY valid JSON in this exact format:
    {
      "narrative": "What happens next...",
      "integrityChange": 0,
      "status": "PLAYING",
      "summary": "Updated 1-sentence summary",
      "mapHUD": "Updated Location",
      "companionSuggestion": "Suggestion for next move...",
      "rewards": {
         "xp": 0,
         "credits": 0,
         "items": []
      }
    }
  `;

  try {
    const client = getClient();
    const apiCall = client.chat.completions.create({
      model: MODEL_TEXT,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const response = await Promise.race([apiCall, timeoutPromise(API_TIMEOUT_MS)]);
    const data = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!data.rewards) data.rewards = { xp: 0, credits: 0, items: [] };
    if (!data.status) data.status = 'PLAYING';
    
    return data;
  } catch (error) {
    console.error("Adventure Turn Error:", error);
    return {
      narrative: "The simulation glitched. Your command was lost in the datastream.",
      integrityChange: 0,
      status: "PLAYING",
      summary: currentSummary,
      rewards: { xp: 0, credits: 0, items: [] }
    };
  }
};
