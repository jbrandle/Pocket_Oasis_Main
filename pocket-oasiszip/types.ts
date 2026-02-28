
export enum AppState {
  ONBOARDING = 'ONBOARDING',
  HUB = 'HUB',
  ZONE = 'ZONE',
  JOB = 'JOB',
  PROFILE = 'PROFILE',
  SHOP = 'SHOP',
  ARCADE = 'ARCADE',
  SOCIAL = 'SOCIAL',
  SETTINGS = 'SETTINGS',
  CALENDAR = 'CALENDAR',
  GUIDE = 'GUIDE'
}

export enum ZoneType {
  MEDIEVAL = 'Medieval Realm',
  FPS = 'Neon Arena',
  CHILL = 'Zen Garden',
  CYBER = 'Cyber City',
  SYNTHWAVE = 'Synthwave Coast',
  LIBRARY = 'Void Library',
  MARS = 'Mars Colony',
  SKYCITY = 'Sky City'
}

export interface AvatarConfig {
  name: string;
  style: 'photoreal' | 'stylized';
  sex: 'M' | 'F';
  age: number;
  eyeColor: string;
  outfit: string;
  cybernetics: number; // 0-100
  accessory?: string;
  equippedModules: string[];
}

export interface ActivityLogItem {
  id: string;
  timestamp: number; // Epoch
  dateString: string; // "Mon Jan 01 2024" for grouping
  description: string;
  xpEarned: number;
  creditsEarned?: number; // New: track financial gains
  itemsFound?: string[]; // New: track looted items
  integrityLost?: number; // New: track damage taken
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  type: 'QUEST' | 'SOCIAL' | 'SYSTEM';
}

export interface MiningStats {
  level: number; // Determines hashrate
  lastCollected: number; // Timestamp
  lastUpgradeTime?: number; // Last time an upgrade was purchased
}

export interface DroneMission {
  id: string;
  name: string;
  duration: number; // ms
  endTime: number; // Timestamp
  reward: number;
  description: string;
}

export interface SystemPreferences {
  notifications: boolean;
  haptics: boolean;
  stealth: boolean;
  animations: boolean;
  unitSystem: 'Metric' | 'Imperial';
  timeFormat: '12h' | '24h';
  locationSync: boolean; 
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: number; // timestamp
  endTime?: number; // timestamp
  category: 'Quest' | 'Social' | 'Biometric' | 'Sync';
  location?: string;
}

export interface AdventureMessage {
  sender: 'AI' | 'USER' | 'SYSTEM' | 'COMPANION';
  text: string;
  timestamp: number;
}

export interface AdventureRewards {
  xp: number;
  credits: number;
  items: string[]; // Names of items found
}

export interface AdventureSession {
  zone: ZoneType;
  isActive: boolean;
  history: AdventureMessage[];
  integrity: number; // 0-100, basically Health
  status: 'PLAYING' | 'WON' | 'LOST';
  summary: string; // Brief context for the AI to remember
  lastUpdated: number;
  accumulatedRewards: AdventureRewards; // Track total gains for this session (for save/abort logic)
  mapHUD?: string; // Current location/map context
  missionBriefing?: string; // The initial background + objective
}

export interface CharacterStats {
  neuralProcessing: number; // INT: Hacking, Logic
  synapticSpeed: number;    // DEX: Combat, Reflexes
  systemIntegrity: number;  // CON: Defense, Health
  digitalPresence: number;  // CHA: Social, Influence
}

export type SubSystemType = 'OPERATOR' | 'VANGUARD' | 'NETRUNNER' | 'GHOST';

export enum AICompanionPersonality {
  BASIC = 'Basic OS',
  SNARKY = 'Snarky Glitch',
  STOIC = 'Stoic Guardian',
  CHIPPER = 'Chipper Bot',
  NOIR = 'Noir Detective',
  ROOK = 'Rook'
}

export interface AICompanion {
  id: string;
  name: string;
  personality: AICompanionPersonality;
  level: number;
}

export interface UserProfile {
  id: string;
  avatar: AvatarConfig;
  credits: number;
  level: number;
  completedQuests: number;
  inventory: string[]; // List of owned ShopItem IDs
  inventoryCapacity: number; // Max items
  isSubscriber: boolean; 
  trialEndsAt?: number; 
  temporaryZoneAccess?: { [key in ZoneType]?: number }; // Map of ZoneType to expiry timestamp
  unlockedRook?: boolean;  // true if paid/unlocked
  // RPG Stats
  stats: CharacterStats;
  availableStatPoints: number;
  subSystem: SubSystemType;
  // Date & Tracking
  lastLoginDate: string; // ISO Date String YYYY-MM-DD
  dailyStreak: number;
  dailyXPGoal: number;
  // Bio-Sync / Health
  stepGoal: number;
  currentSteps: number;
  history: ActivityLogItem[];
  notifications: Notification[];
  calendarEvents: CalendarEvent[];
  // Jobs & Idle
  miningStats: MiningStats;
  activeMission: DroneMission | null;
  activeAdventure?: AdventureSession | null; // The current paused/active adventure
  companion: AICompanion;
  preferences: SystemPreferences;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objective: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  zone: ZoneType;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export type ItemCategory = 'Outfit' | 'Accessory' | 'Cybernetic' | 'NeuralModule';

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  image: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  description: string;
  value: string | number; // The actual value applied to the avatar config
}
