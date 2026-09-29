import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Brand,
  Game,
  GameTemplate,
  User,
  AnalyticsSummary,
} from '../types';
import {
  DEMO_USERS,
  DEMO_BRANDS,
  GAME_TEMPLATES,
  INITIAL_GAMES,
} from '../data/demoData';

export type AppView =
  | 'home'
  | 'landing'
  | 'dashboard'
  | 'brands'
  | 'templates'
  | 'my-games'
  | 'create-game'
  | 'editor'
  | 'analytics'
  | 'admin'
  | 'play'
  | 'login'
  | 'register';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  brands: Brand[];
  games: Game[];
  templates: GameTemplate[];
  activeView: AppView;
  viewParams: Record<string, unknown>;
  toasts: Toast[];

  // Navigation
  navigateTo: (view: AppView, params?: Record<string, unknown>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Auth & Roles
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password: string, role: User['role']) => boolean;
  logout: () => void;
  switchUserRole: (role: User['role']) => void;

  // Brands CRUD
  addBrand: (brandData: Omit<Brand, 'id' | 'createdAt'>) => Brand;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  // Games CRUD
  createGame: (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'plays' | 'downloads' | 'averageScore' | 'highScore'>) => Game;
  updateGame: (id: string, updates: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  duplicateGame: (id: string) => Game;
  publishGame: (id: string) => void;

  // Analytics & Interaction
  recordPlay: (gameId: string, score: number) => void;
  recordDownload: (gameId: string) => void;
  getAnalyticsSummary: () => AnalyticsSummary;

  // Theme (Light / Dark mode)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'brandplay_v3_user',
  BRANDS: 'brandplay_v3_brands',
  GAMES: 'brandplay_v3_games',
  TOKEN: 'brandplay_v3_jwt_token',
  THEME: 'brandplay_theme',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Keep <html> element classes in sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // 1. Initial State Load
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name !== 'Sarah Jenkins' && parsed.name !== 'Marcus Vance') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEMO_USERS[0]; // Default to Gayan Lakmal (Brand Owner)
  });

  const [users, setUsers] = useState<User[]>(DEMO_USERS);

  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].brandName !== 'Aura Brew Roasters') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEMO_BRANDS;
  });

  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].gameName !== 'Aura Morning Dash') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_GAMES;
  });

  const [templates] = useState<GameTemplate[]>(GAME_TEMPLATES);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [viewParams, setViewParams] = useState<Record<string, unknown>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync with localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        localStorage.setItem(STORAGE_KEYS.TOKEN, `jwt_demo_${currentUser.id}_${Date.now()}`);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    } catch {
      // storage error fallback
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    } catch {
      // storage error fallback
    }
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch {
      // storage error fallback
    }
  }, [games]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigateTo = (view: AppView, params: Record<string, unknown> = {}) => {
    // If trying to access dashboard/protected views while logged out, redirect to login
    const protectedViews: AppView[] = [
      'dashboard',
      'brands',
      'templates',
      'my-games',
      'create-game',
      'editor',
      'analytics',
      'admin',
    ];

    if (!currentUser && protectedViews.includes(view)) {
      setActiveView('login');
      setViewParams({ redirectAfterLogin: view, ...params });
      return;
    }

    setActiveView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth
  const login = (email: string) => {
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Welcome back, ${foundUser.name}!`);
      return true;
    }
    // Auto-create as brand owner if not found
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'brand_owner',
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to BrandPlay, ${newUser.name}!`);
    return true;
  };

  const register = (name: string, email: string, _password: string, role: User['role']) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists.', 'error');
      return false;
    }
    const newUser: User = {
      id: 'user_' + Date.now(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created successfully! Welcome, ${name}.`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
    setActiveView('landing');
  };

  const switchUserRole = (role: User['role']) => {
    const match = users.find((u) => u.role === role);
    if (match) {
      setCurrentUser(match);
      showToast(`Switched active profile to ${match.name} (${match.role.replace('_', ' ')})`);
    } else {
      if (currentUser) {
        const updated = { ...currentUser, role };
        setCurrentUser(updated);
        showToast(`Role updated to ${role.replace('_', ' ')}`);
      }
    }
  };

  // Brands CRUD
  const addBrand = (brandData: Omit<Brand, 'id' | 'createdAt'>): Brand => {
    const newBrand: Brand = {
      ...brandData,
      id: 'brand_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setBrands((prev) => [newBrand, ...prev]);
    showToast(`Brand "${newBrand.brandName}" created successfully!`);
    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );
    showToast('Brand profile updated.');
  };

  const deleteBrand = (id: string) => {
    const brand = brands.find((b) => b.id === id);
    setBrands((prev) => prev.filter((b) => b.id !== id));
    showToast(`Brand "${brand?.brandName || ''}" deleted.`, 'info');
  };

  // Games CRUD
  const createGame = (
    gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'plays' | 'downloads' | 'averageScore' | 'highScore'>
  ): Game => {
    const newGame: Game = {
      ...gameData,
      id: 'game_' + Date.now(),
      plays: 0,
      downloads: 0,
      averageScore: 0,
      highScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGames((prev) => [newGame, ...prev]);
    showToast('Game created successfully.');
    return newGame;
  };

  const updateGame = (id: string, updates: Partial<Game>) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      )
    );
    showToast('Game saved successfully.');
  };

  const deleteGame = (id: string) => {
    const game = games.find((g) => g.id === id);
    setGames((prev) => prev.filter((g) => g.id !== id));
    showToast(`Game "${game?.gameName || ''}" deleted.`, 'info');
  };

  const duplicateGame = (id: string): Game => {
    const source = games.find((g) => g.id === id);
    if (!source) throw new Error('Game not found');

    const cloned: Game = {
      ...source,
      id: 'game_' + Date.now(),
      gameName: `${source.gameName} (Copy)`,
      publicSlug: `${source.publicSlug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      plays: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGames((prev) => [cloned, ...prev]);
    showToast(`Cloned game as "${cloned.gameName}"`);
    return cloned;
  };

  const publishGame = (id: string) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: 'published',
              updatedAt: new Date().toISOString(),
            }
          : g
      )
    );
    showToast('Game published! It is now live for public play.');
  };

  const recordPlay = (gameId: string, score: number) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        const newPlays = g.plays + 1;
        const newAvg = Math.round((g.averageScore * g.plays + score) / newPlays);
        const newHigh = Math.max(g.highScore, score);
        return {
          ...g,
          plays: newPlays,
          averageScore: newAvg,
          highScore: newHigh,
        };
      })
    );
  };

  const recordDownload = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, downloads: g.downloads + 1 } : g))
    );
  };

  // Analytics summary calculation
  const getAnalyticsSummary = (): AnalyticsSummary => {
    const totalPlays = games.reduce((acc, g) => acc + (g.plays || 0), 0);
    const totalDownloads = games.reduce((acc, g) => acc + (g.downloads || 0), 0);
    const publishedGames = games.filter((g) => g.status === 'published').length;
    const avgScore =
      games.length > 0
        ? Math.round(games.reduce((acc, g) => acc + (g.averageScore || 0), 0) / games.length)
        : 0;

    const mostPlayedGame = [...games].sort((a, b) => b.plays - a.plays)[0];

    // Mock trend history over past 7 days
    const playsHistory = [
      { date: 'Sep 23', plays: Math.round(totalPlays * 0.1), completions: Math.round(totalPlays * 0.08) },
      { date: 'Sep 24', plays: Math.round(totalPlays * 0.14), completions: Math.round(totalPlays * 0.11) },
      { date: 'Sep 25', plays: Math.round(totalPlays * 0.18), completions: Math.round(totalPlays * 0.15) },
      { date: 'Sep 26', plays: Math.round(totalPlays * 0.12), completions: Math.round(totalPlays * 0.09) },
      { date: 'Sep 27', plays: Math.round(totalPlays * 0.22), completions: Math.round(totalPlays * 0.18) },
      { date: 'Sep 28', plays: Math.round(totalPlays * 0.28), completions: Math.round(totalPlays * 0.24) },
      { date: 'Today', plays: Math.round(totalPlays * 0.32), completions: Math.round(totalPlays * 0.26) },
    ];

    const templateStats = templates.map((tmpl) => {
      const matching = games.filter((g) => g.templateId === tmpl.id);
      const plays = matching.reduce((sum, g) => sum + g.plays, 0);
      return {
        templateName: tmpl.name,
        count: matching.length,
        plays,
      };
    });

    return {
      totalPlays,
      totalGames: games.length,
      publishedGames,
      totalDownloads,
      averageScore: avgScore,
      mostPlayedGame,
      playsHistory,
      templateStats,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        brands,
        games,
        templates,
        activeView,
        viewParams,
        toasts,
        navigateTo,
        showToast,
        removeToast,
        login,
        register,
        logout,
        switchUserRole,
        addBrand,
        updateBrand,
        deleteBrand,
        createGame,
        updateGame,
        deleteGame,
        duplicateGame,
        publishGame,
        recordPlay,
        recordDownload,
        getAnalyticsSummary,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
