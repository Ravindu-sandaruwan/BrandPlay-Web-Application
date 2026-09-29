import { Brand, Game, GameTemplate, User, QuizQuestion, SpinWheelSegment, SpinWheelConfig } from '../types';

export const PRESET_MASCOTS = [
  { id: 'runner_sneaker', name: 'Speedy Sneaker', category: 'Athletic & Footwear', emoji: '👟', description: 'Energetic sneaker mascot with wings' },
  { id: 'coffee_cup', name: 'Barista Cup', category: 'Café & Dining', emoji: '☕', description: 'Cheerful coffee cup with heart steam' },
  { id: 'delivery_van', name: 'Express Van', category: 'Logistics & Retail', emoji: '🚐', description: 'Fast electric delivery van' },
  { id: 'robot', name: 'Cyber Bot', category: 'Tech & SaaS', emoji: '🤖', description: 'Intelligent smiling AI helper bot' },
  { id: 'gem_orb', name: 'Luxe Diamond', category: 'Luxury & Jewelry', emoji: '💎', description: 'Sparkling multifaceted sapphire jewel' },
  { id: 'star_hero', name: 'Champion Star', category: 'General & Rewards', emoji: '⭐', description: 'Golden celebration star with trophy' },
  { id: 'mascot_custom', name: 'Custom Brand Mascot', category: 'User Upload', emoji: '🎨', description: 'Upload your own corporate mascot / character' },
];

export const PRESET_BACKGROUNDS = [
  { id: 'vibrant_carnival', name: 'Vibrant Carnival Fair', category: 'Playful & Event', gradient: 'from-blue-900 via-indigo-950 to-slate-950', previewColor: '#1e1b4b' },
  { id: 'neon_city', name: 'Neon Cyber Grid', category: 'Tech & Modern', gradient: 'from-slate-950 via-blue-950 to-slate-950', previewColor: '#0f172a' },
  { id: 'sunset_gradient', name: 'Sunset Warmth', category: 'Lifestyle & Retail', gradient: 'from-blue-900 via-purple-950 to-slate-950', previewColor: '#311042' },
  { id: 'minimal_grid', name: 'Minimalist Clean Studio', category: 'SaaS & Enterprise', gradient: 'from-slate-900 via-slate-950 to-black', previewColor: '#090d16' },
  { id: 'luxury_gold', name: 'Midnight Luxury', category: 'Luxury & Fashion', gradient: 'from-amber-950/40 via-slate-950 to-slate-950', previewColor: '#1a140a' },
  { id: 'clean_store', name: 'Boutique Storefront', category: 'E-commerce', gradient: 'from-sky-950 via-slate-950 to-slate-950', previewColor: '#082f49' },
  { id: 'custom_bg', name: 'Custom Brand Image', category: 'User Upload', gradient: 'from-slate-900 to-slate-950', previewColor: '#1e293b' },
];

export const DEFAULT_SPIN_WHEEL_SEGMENTS: SpinWheelSegment[] = [
  {
    id: 'seg-1',
    text: '10% OFF',
    subtext: 'Min spend $30',
    color: '#2563eb', // Royal Blue
    textColor: '#ffffff',
    rewardType: 'discount',
    rewardValue: '10% DISCOUNT',
    promoCode: 'SPIN10',
    probability: 25,
    isWinning: true,
  },
  {
    id: 'seg-2',
    text: 'Free Delivery',
    subtext: 'Next order',
    color: '#0284c7', // Sky Blue
    textColor: '#ffffff',
    rewardType: 'coupon',
    rewardValue: 'FREE DELIVERY',
    promoCode: 'FREESHIP',
    probability: 20,
    isWinning: true,
  },
  {
    id: 'seg-3',
    text: 'Try Again',
    subtext: 'One more spin',
    color: '#475569', // Slate
    textColor: '#f8fafc',
    rewardType: 'try_again',
    rewardValue: 'TRY AGAIN',
    promoCode: '',
    probability: 15,
    isWinning: false,
  },
  {
    id: 'seg-4',
    text: '20% OFF',
    subtext: 'Storewide coupon',
    color: '#3b82f6', // Electric Blue
    textColor: '#ffffff',
    rewardType: 'discount',
    rewardValue: '20% DISCOUNT',
    promoCode: 'VIP20',
    probability: 15,
    isWinning: true,
  },
  {
    id: 'seg-5',
    text: 'Free Gift',
    subtext: 'Mystery gift item',
    color: '#0ea5e9', // Cyan
    textColor: '#ffffff',
    rewardType: 'free_product',
    rewardValue: 'MYSTERY GIFT',
    promoCode: 'GIFTBOX',
    probability: 10,
    isWinning: true,
  },
  {
    id: 'seg-6',
    text: 'Better Luck',
    subtext: 'Thanks for playing',
    color: '#334155', // Deep Slate
    textColor: '#94a3b8',
    rewardType: 'lose',
    rewardValue: 'NO PRIZE',
    promoCode: '',
    probability: 15,
    isWinning: false,
  },
];

export const DEFAULT_SPIN_WHEEL_CONFIG: SpinWheelConfig = {
  segmentCount: 6,
  segments: DEFAULT_SPIN_WHEEL_SEGMENTS,
  spinDuration: 4.5,
  centerLogo: true,
  pointerStyle: 'classic',
  showConfetti: true,
  allowReplay: true,
};

export const DEMO_USERS: User[] = [
  {
    id: 'user_owner_1',
    name: 'Gayan Lakmal',
    email: 'gayan.lakmal@brandplay.io',
    role: 'brand_owner',
    company: 'Lakmal Brands & Retail',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'user_pro_1',
    name: 'Ravindu Sandaruwan',
    email: 'ravindu.sandaruwan@brandplay.io',
    role: 'marketing_pro',
    company: 'Sandaruwan Growth Marketing',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-20T11:30:00Z',
  },
  {
    id: 'user_admin_1',
    name: 'Gayan Lakmal (Administrator)',
    email: 'admin@brandplay.io',
    role: 'admin',
    company: 'BrandPlay HQ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T08:00:00Z',
  }
];

export const PRESET_LOGOS = [
  {
    id: 'tech_cube',
    name: 'Blue Cube',
    category: 'Technology',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="currentColor" fill-opacity="0.15"/>
      <path d="M50 22L76 36V64L50 78L24 64V36L50 22Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
      <path d="M50 22V50M76 36L50 50M24 36L50 50M50 50V78" stroke="currentColor" stroke-width="4"/>
    </svg>`,
  },
  {
    id: 'lightning_sneaker',
    name: 'Pulse Bolt',
    category: 'Sports & Apparel',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="currentColor" fill-opacity="0.15"/>
      <path d="M54 20L28 54H48L44 80L72 46H52L54 20Z" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'coffee_cup',
    name: 'Artisan Coffee',
    category: 'Food & Beverage',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="currentColor" fill-opacity="0.15"/>
      <path d="M26 38H68C68 56 58 68 47 68C36 68 26 56 26 38Z" fill="currentColor"/>
      <path d="M68 44H74C78 44 80 47 80 51C80 55 77 58 73 58H67" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <path d="M38 28C38 24 40 22 42 20M48 28C48 24 50 22 52 20M58 28C58 24 60 22 62 20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'eco_leaf',
    name: 'Nature Leaf',
    category: 'Eco & Wellness',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="currentColor" fill-opacity="0.15"/>
      <path d="M30 70C30 70 30 38 70 30C70 30 70 62 30 70Z" fill="currentColor"/>
      <path d="M30 70Q50 50 70 30" stroke="white" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'gem_diamond',
    name: 'Luxe Diamond',
    category: 'Luxury & Fashion',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="currentColor" fill-opacity="0.15"/>
      <path d="M32 36L50 22L68 36L50 78L32 36Z" fill="currentColor"/>
      <path d="M22 36H78L50 78L22 36Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
    </svg>`,
  },
];

export const DEMO_BRANDS: Brand[] = [
  {
    id: 'brand_aura',
    userId: 'user_owner_1',
    brandName: 'Lakmal Tech & Retail',
    description: 'Modern consumer brand offering premium electronics and lifestyle accessories.',
    logo: PRESET_LOGOS[0].svg,
    logoType: 'svg',
    primaryColour: '#2563eb', // Royal Blue
    secondaryColour: '#0f172a', // Deep Midnight
    accentColour: '#ffffff', // Crisp White
    websiteUrl: 'https://lakmalretail.example.com',
    industry: 'Consumer Tech & Retail',
    createdAt: '2026-08-16T12:00:00Z',
  },
  {
    id: 'brand_pulse',
    userId: 'user_owner_1',
    brandName: 'Sandaruwan Athletics',
    description: 'High-performance athletic apparel, sportswear, and fitness footwear.',
    logo: PRESET_LOGOS[1].svg,
    logoType: 'svg',
    primaryColour: '#1d4ed8', // Bold Sapphire Blue
    secondaryColour: '#1e293b', // Navy Slate
    accentColour: '#60a5fa', // Light Ice Blue
    websiteUrl: 'https://sandaruwanathletics.example.com',
    industry: 'Apparel & Fitness',
    createdAt: '2026-08-18T14:20:00Z',
  },
  {
    id: 'brand_novatech',
    userId: 'user_pro_1',
    brandName: 'BlueSky AI Studio',
    description: 'Next-generation cloud automation, intelligent workflows, and web apps.',
    logo: PRESET_LOGOS[0].svg,
    logoType: 'svg',
    primaryColour: '#3b82f6', // Electric Blue
    secondaryColour: '#0b132b', // Deep Ocean
    accentColour: '#ffffff', // Pure White
    websiteUrl: 'https://blueskyai.example.com',
    industry: 'SaaS & Enterprise',
    createdAt: '2026-08-22T09:15:00Z',
  },
];

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary benefit of interactive branded mini-games for marketing?',
    options: ['5x Higher Engagement & Recall', 'High Printing Costs', 'Requires Months of Coding', 'Static Display Only'],
    correctIndex: 0,
    explanation: 'Gamification delivers up to 5x higher consumer engagement and brand recall than traditional static ads!',
  },
  {
    id: 'q2',
    question: 'Which technology enables BrandPlay games to run in any browser without plugins?',
    options: ['HTML5 Canvas 2D', 'Flash Player', 'ActiveX Controls', 'Silverlight'],
    correctIndex: 0,
    explanation: 'HTML5 Canvas provides smooth hardware-accelerated 60 FPS graphics across all modern browsers and smartphones.',
  },
  {
    id: 'q3',
    question: 'How do customers typically redeem their rewards won in BrandPlay games?',
    options: ['Postal mail', 'Instant Promo Voucher Code at checkout', 'Paper tickets', 'Fax machine'],
    correctIndex: 1,
    explanation: 'Players unlock an instant promotional coupon code that can be applied immediately in online stores!',
  },
  {
    id: 'q4',
    question: 'Can BrandPlay games be embedded into external sites like Shopify or WordPress?',
    options: ['No, only on brandplay.io', 'Yes, via standard iframe or HTML5 export', 'Only on desktop computers', 'Requires app store install'],
    correctIndex: 1,
    explanation: 'BrandPlay games can be embedded anywhere with a responsive iframe or exported as an offline ZIP package!',
  },
];

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: 'spin-wheel',
    name: 'Customizable Spin Wheel',
    genre: 'Luck & Win / Gamified Conversion',
    tagline: 'Spin the branded wheel to unlock instant discounts, coupons, and prizes!',
    description: 'High-conversion interactive spin wheel customized with brand colors, logo center hub, celebratory mascot, custom prize segments, and weighted reward odds.',
    thumbnail: 'spinwheel',
    difficulty: 'Easy',
    estimatedPlaytime: '15-30 secs',
    features: [
      'Fully customizable brand segments (4 to 12 wedges)',
      'Brand logo prominently in center hub & header',
      'Animated brand mascot celebrating spins & wins',
      'Custom colors for wheel slices, border & pegs',
      'Weighted probability for realistic reward allocation',
      'Winning voucher popup with 1-click promo code copy',
    ],
    defaultConfiguration: {
      branding: {
        logo: PRESET_LOGOS[0].svg,
        logoPlacement: 'both',
        primaryColour: '#2563eb', // Royal Blue
        secondaryColour: '#0f172a', // Midnight Navy
        accentColour: '#38bdf8', // Sky Blue
        backgroundColour: '#090d16',
        buttonColour: '#2563eb',
        textColour: '#ffffff',
        cardBackground: '#0f172a',
        customTitle: 'Lucky Brand Spin Wheel',
        tagline: 'Spin the wheel and claim your exclusive reward voucher!',
        ctaButtonText: 'Claim Your Reward',
        ctaUrl: 'https://example.com/shop',
        promoCode: 'SPIN10',
        discountPercent: 10,
        rewardType: 'discount',
        rewardDescription: 'Exclusive branded discount voucher',
      },
      gameplay: {
        speed: 5,
        difficulty: 'easy',
        durationSeconds: 30,
        scoreMultiplier: 1,
        soundEnabled: true,
        lives: 3,
        targetScore: 100,
      },
      visuals: {
        character: 'runner_sneaker',
        customMascotUrl: '',
        mascotName: 'Brand Mascot',
        mascotPosition: 'right',
        backgroundTheme: 'vibrant_carnival',
        customBackgroundUrl: '',
        obstacleType: 'hurdles',
        collectibleType: 'brand_coins',
        fontFamily: 'Plus Jakarta Sans',
      },
      content: {
        welcomeMessage: 'Tap the center button or press SPIN to try your luck and win brand rewards!',
        instructions: 'Click SPIN to rotate the wheel. Whatever segment the pointer stops on is yours to keep!',
        winMessage: 'Congratulations! You won an exclusive brand reward!',
        loseMessage: 'Better luck next time! Thanks for participating.',
        gameOverMessage: 'Thanks for playing our lucky spin wheel!',
      },
      spinWheel: DEFAULT_SPIN_WHEEL_CONFIG,
    },
  },
  {
    id: 'endless-runner',
    name: 'Endless Brand Runner',
    genre: 'Arcade / Platformer',
    tagline: 'Run, jump over obstacles, and dash past branded billboards!',
    description: 'Fast-paced side-scrolling runner where players dodge obstacles and collect brand tokens. Brand logo appears in billboards, character flags, and celebratory gates.',
    thumbnail: 'runner',
    difficulty: 'Configurable',
    estimatedPlaytime: '1-3 mins',
    features: [
      'Parallax scrolling blue sky & cityscape',
      'Branded billboards displaying custom logo',
      'Customizable obstacles & character tokens',
      'Adjustable run speed & jump gravity',
      'Touch / click / Spacebar keyboard controls',
    ],
    defaultConfiguration: {
      branding: {
        logo: PRESET_LOGOS[0].svg,
        primaryColour: '#2563eb', // Royal Blue
        secondaryColour: '#0f172a', // Midnight Navy
        accentColour: '#ffffff', // Crisp White
        customTitle: 'Lakmal Speed Dash',
        tagline: 'Jump over hurdles to claim your 20% discount!',
        ctaButtonText: 'Claim 20% Discount Code',
        ctaUrl: 'https://lakmalretail.example.com/reward',
        promoCode: 'LAKMAL20',
        discountPercent: 20,
      },
      gameplay: {
        speed: 5,
        difficulty: 'medium',
        durationSeconds: 60,
        scoreMultiplier: 1,
        soundEnabled: true,
        lives: 3,
        targetScore: 250,
      },
      visuals: {
        character: 'runner_sneaker',
        backgroundTheme: 'neon_city',
        obstacleType: 'hurdles',
        collectibleType: 'brand_coins',
        fontFamily: 'Plus Jakarta Sans',
      },
      content: {
        welcomeMessage: 'Press Space or Tap to Jump! Collect blue coins and reach 250 points for your voucher.',
        winMessage: 'Spectacular Run! You unlocked the exclusive VIP discount voucher code!',
        gameOverMessage: 'Great effort! Give it another shot to claim the reward.',
      },
    },
  },
  {
    id: 'coin-collector',
    name: 'Brand Drop Catcher',
    genre: 'Catch & Action',
    tagline: 'Catch falling branded goodies while avoiding hazards!',
    description: 'Addictive arcade collector where items shower from above. Players move a branded basket or avatar left and right to catch items, trigger combo streaks, and beat the clock.',
    thumbnail: 'collector',
    difficulty: 'Easy',
    estimatedPlaytime: '45-60 secs',
    features: [
      'Smooth mouse, touch, or Arrow key movement',
      'Combo streak multipliers for unbroken catches',
      'Hazard penalty items to dodge',
      'Floating brand logo badge in header & catch particles',
      'Countdown pressure clock with victory screen',
    ],
    defaultConfiguration: {
      branding: {
        logo: PRESET_LOGOS[1].svg,
        primaryColour: '#1d4ed8', // Sapphire Blue
        secondaryColour: '#0f172a',
        accentColour: '#60a5fa', // Ice Blue
        customTitle: 'Sandaruwan Gear Catcher',
        tagline: 'Catch athletic drops before time expires!',
        ctaButtonText: 'Shop New Arrivals with Code',
        ctaUrl: 'https://sandaruwanathletics.example.com',
        promoCode: 'SANDARUWAN15',
        discountPercent: 15,
      },
      gameplay: {
        speed: 6,
        difficulty: 'medium',
        durationSeconds: 45,
        scoreMultiplier: 2,
        soundEnabled: true,
        lives: 3,
        targetScore: 300,
      },
      visuals: {
        character: 'runner_sneaker',
        backgroundTheme: 'neon_city',
        obstacleType: 'rival_boxes',
        collectibleType: 'discount_tags',
        fontFamily: 'Plus Jakarta Sans',
      },
      content: {
        welcomeMessage: 'Move left & right to catch blue energy tokens! Avoid red hazard crates.',
        winMessage: 'Victory! You collected enough energy drops to unlock 15% off!',
        gameOverMessage: 'Time is up! Replay to achieve a top tier ranking.',
      },
    },
  },
  {
    id: 'quiz-game',
    name: 'Brand Trivia Master',
    genre: 'Trivia / Educational',
    tagline: 'Test brand knowledge with interactive multiple-choice questions!',
    description: 'Engaging branded quiz that educates customers on your brand history, product features, or industry knowledge. Features a countdown timer, instant feedback, and a victory coupon.',
    thumbnail: 'quiz',
    difficulty: 'Configurable',
    estimatedPlaytime: '1-2 mins',
    features: [
      'Custom question & answer authoring interface',
      'Configurable per-question timer with visual bar',
      'Educational explanation cards on answer reveal',
      'Custom brand color styling & logo badge',
      'Guaranteed high customer brand recall',
    ],
    defaultConfiguration: {
      branding: {
        logo: PRESET_LOGOS[0].svg,
        primaryColour: '#2563eb', // Royal Blue
        secondaryColour: '#0f172a',
        accentColour: '#ffffff', // White
        customTitle: 'Lakmal Tech Trivia Master',
        tagline: 'Answer trivia questions to win exclusive discounts!',
        ctaButtonText: 'Claim Your Reward',
        ctaUrl: 'https://lakmalretail.example.com/claim',
        promoCode: 'TECHGENIUS',
        discountPercent: 25,
      },
      gameplay: {
        speed: 4,
        difficulty: 'easy',
        durationSeconds: 60,
        scoreMultiplier: 1,
        soundEnabled: true,
        lives: 1,
        targetScore: 300,
      },
      visuals: {
        character: 'robot',
        backgroundTheme: 'minimal_grid',
        obstacleType: 'hurdles',
        collectibleType: 'stars',
        fontFamily: 'Plus Jakarta Sans',
      },
      content: {
        welcomeMessage: 'Answer 4 tech questions to claim your discount prize!',
        winMessage: 'Flawless Trivia Performance! Here is your exclusive 25% discount voucher code.',
        gameOverMessage: 'Nice attempt! Give it another shot to win the voucher.',
        questions: DEFAULT_QUIZ_QUESTIONS,
      },
    },
  },
];

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game_aura_runner',
    userId: 'user_owner_1',
    brandId: 'brand_aura',
    templateId: 'endless-runner',
    gameName: 'Lakmal Sky Dash',
    description: 'Sprint through the neon blue cityscape to unlock customer rewards.',
    configuration: { ...GAME_TEMPLATES[0].defaultConfiguration },
    status: 'published',
    publicSlug: 'lakmal-sky-dash',
    plays: 1840,
    downloads: 98,
    averageScore: 320,
    highScore: 940,
    createdAt: '2026-08-25T14:00:00Z',
    updatedAt: '2026-09-02T16:30:00Z',
  },
  {
    id: 'game_pulse_catcher',
    userId: 'user_owner_1',
    brandId: 'brand_pulse',
    templateId: 'coin-collector',
    gameName: 'Sandaruwan Gear Drop',
    description: 'Catch athletic speed tokens to earn VIP launch coupon codes.',
    configuration: { ...GAME_TEMPLATES[1].defaultConfiguration },
    status: 'published',
    publicSlug: 'sandaruwan-gear-drop',
    plays: 2950,
    downloads: 162,
    averageScore: 430,
    highScore: 1250,
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-09-05T11:00:00Z',
  },
  {
    id: 'game_aura_trivia',
    userId: 'user_owner_1',
    brandId: 'brand_aura',
    templateId: 'quiz-game',
    gameName: 'Lakmal Brand Trivia',
    description: 'Interactive 4-question customer knowledge challenge.',
    configuration: { ...GAME_TEMPLATES[2].defaultConfiguration },
    status: 'published',
    publicSlug: 'lakmal-brand-trivia',
    plays: 1120,
    downloads: 54,
    averageScore: 390,
    highScore: 400,
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-08T15:20:00Z',
  },
  {
    id: 'game_novatech_sprint',
    userId: 'user_pro_1',
    brandId: 'brand_novatech',
    templateId: 'endless-runner',
    gameName: 'BlueSky Cloud Sprint',
    description: 'Dodge bugs and collect cloud crystals in royal blue aesthetic.',
    configuration: {
      ...GAME_TEMPLATES[0].defaultConfiguration,
      branding: {
        logo: PRESET_LOGOS[0].svg,
        primaryColour: '#3b82f6',
        secondaryColour: '#0f172a',
        accentColour: '#ffffff',
        customTitle: 'BlueSky Cloud Sprint',
        tagline: 'Avoid hazards and collect cloud tokens for $100 credits!',
        ctaButtonText: 'Claim Cloud Credits',
        ctaUrl: 'https://blueskyai.example.com/free',
        promoCode: 'BLUESKY100',
        discountPercent: 50,
      },
      visuals: {
        character: 'robot',
        backgroundTheme: 'dark_cyber',
        obstacleType: 'traffic_cones',
        collectibleType: 'stars',
        fontFamily: 'Plus Jakarta Sans',
      },
    },
    status: 'ready',
    publicSlug: 'bluesky-cloud-sprint',
    plays: 420,
    downloads: 24,
    averageScore: 290,
    highScore: 780,
    createdAt: '2026-09-12T13:40:00Z',
    updatedAt: '2026-09-15T18:10:00Z',
  },
  {
    id: 'game_pulse_draft',
    userId: 'user_owner_1',
    brandId: 'brand_pulse',
    templateId: 'coin-collector',
    gameName: 'Marathon Energy Rush',
    description: 'Upcoming campaign game for championship marathon season.',
    configuration: { ...GAME_TEMPLATES[1].defaultConfiguration },
    status: 'draft',
    publicSlug: 'marathon-energy-rush',
    plays: 0,
    downloads: 0,
    averageScore: 0,
    highScore: 0,
    createdAt: '2026-09-20T16:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z',
  },
];
