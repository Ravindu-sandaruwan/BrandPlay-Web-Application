export type UserRole = 'brand_owner' | 'marketing_pro' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  createdAt: string;
}

export interface Brand {
  id: string;
  userId: string;
  brandName: string;
  description: string;
  logo: string; // Base64 data URL, SVG data or image URL
  logoType?: 'preset' | 'custom' | 'svg';
  primaryColour: string;
  secondaryColour: string;
  accentColour: string;
  websiteUrl?: string;
  industry?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TemplateId = 'spin-wheel' | 'endless-runner' | 'coin-collector' | 'quiz-game';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface SpinWheelSegment {
  id: string;
  text: string;
  subtext?: string;
  color: string;
  textColor?: string;
  rewardType: 'discount' | 'coupon' | 'free_product' | 'points' | 'try_again' | 'lose';
  rewardValue: string; // e.g. "20% OFF", "FREE DELIVERY", "100 PTS", "GIFT"
  promoCode?: string;
  probability: number; // weight 1 to 100
  isWinning: boolean;
}

export interface SpinWheelConfig {
  segmentCount: number; // 4, 6, 8, 10, 12
  segments: SpinWheelSegment[];
  spinDuration: number; // seconds (e.g. 3 to 7)
  centerLogo: boolean;
  pointerStyle: 'classic' | 'arrow' | 'diamond' | 'pin';
  showConfetti: boolean;
  allowReplay: boolean;
}

export interface GameConfiguration {
  branding: {
    logo: string;
    logoPlacement?: 'header' | 'center' | 'both';
    primaryColour: string;
    secondaryColour: string;
    accentColour: string;
    backgroundColour?: string;
    buttonColour?: string;
    textColour?: string;
    cardBackground?: string;
    customTitle: string;
    tagline: string;
    ctaButtonText: string;
    ctaUrl: string;
    promoCode: string;
    discountPercent: number;
    rewardType?: 'discount' | 'coupon' | 'free_product' | 'points' | 'custom';
    rewardDescription?: string;
    rewardExpiry?: string;
  };
  gameplay: {
    speed: number; // 1 to 10
    difficulty: 'easy' | 'medium' | 'hard';
    durationSeconds: number; // for timed games (e.g. 30, 45, 60, 90)
    scoreMultiplier: number; // 1 to 5
    soundEnabled: boolean;
    lives: number; // 1 to 5
    targetScore: number;
  };
  visuals: {
    character: 'runner_sneaker' | 'robot' | 'delivery_van' | 'coffee_cup' | 'gem_orb' | 'star_hero' | 'mascot_custom';
    customMascotUrl?: string;
    mascotName?: string;
    mascotPosition?: 'left' | 'right' | 'hidden';
    backgroundTheme: 'neon_city' | 'sunset_gradient' | 'minimal_grid' | 'skyline' | 'dark_cyber' | 'vibrant_carnival' | 'luxury_gold' | 'clean_store' | 'custom_bg';
    customBackgroundUrl?: string;
    obstacleType: 'hurdles' | 'traffic_cones' | 'spikes' | 'rival_boxes';
    collectibleType: 'brand_coins' | 'discount_tags' | 'coffee_beans' | 'gift_boxes' | 'stars';
    fontFamily: string;
  };
  content: {
    welcomeMessage: string;
    instructions?: string;
    winMessage: string;
    loseMessage?: string;
    gameOverMessage: string;
    questions?: QuizQuestion[];
  };
  spinWheel?: SpinWheelConfig;
}

export interface GameTemplate {
  id: TemplateId;
  name: string;
  description: string;
  tagline: string;
  thumbnail: string;
  genre: string;
  difficulty: 'Easy' | 'Medium' | 'Configurable';
  estimatedPlaytime: string;
  features: string[];
  defaultConfiguration: GameConfiguration;
}

export type GameStatus = 'draft' | 'ready' | 'published';

export interface Game {
  id: string;
  userId: string;
  brandId: string;
  templateId: TemplateId;
  gameName: string;
  description: string;
  configuration: GameConfiguration;
  status: GameStatus;
  publicSlug: string;
  plays: number;
  downloads: number;
  averageScore: number;
  highScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface HighScoreEntry {
  id: string;
  gameId: string;
  playerName: string;
  score: number;
  date: string;
}

export interface AnalyticsSummary {
  totalPlays: number;
  totalGames: number;
  publishedGames: number;
  totalDownloads: number;
  averageScore: number;
  mostPlayedGame?: Game;
  playsHistory: Array<{ date: string; plays: number; completions: number }>;
  templateStats: Array<{ templateName: string; count: number; plays: number }>;
}
