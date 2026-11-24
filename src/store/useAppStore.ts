import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Shield, ShieldAlert, ShieldCheck, Medal, Trophy, Crown, Gem, Rocket } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export const RANK_THRESHOLDS = [
  { name: 'Ferro', minXp: 0, color: '#78909C', bg: '#ECEFF1', icon: ShieldAlert },
  { name: 'Bronze', minXp: 250, color: '#D87A32', bg: '#FFF3E0', icon: Shield },
  { name: 'Prata', minXp: 600, color: '#607D8B', bg: '#F1F5F9', icon: ShieldCheck },
  { name: 'Ouro', minXp: 1100, color: '#D39E00', bg: '#FFF8E1', icon: Medal },
  { name: 'Platina', minXp: 1700, color: '#00897B', bg: '#E0F2F1', icon: Gem },
  { name: 'Diamante', minXp: 2500, color: '#0288D1', bg: '#E1F5FE', icon: Gem },
  { name: 'Mestre', minXp: 3500, color: '#7C4DFF', bg: '#EDE7F6', icon: Trophy },
  { name: 'Desafiante', minXp: 5000, color: '#FF6D00', bg: '#FFF3E0', icon: Crown },
];

export const getUserRank = (xp: number) => {
  return RANK_THRESHOLDS.slice().reverse().find((r) => xp >= r.minXp) || RANK_THRESHOLDS[0];
};

export interface BehavioralMetrics {
  clarity: number;
  empathy: number;
  control: number;
  leadership: number;
  negotiation: number;
}

export interface GatekeeperRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  clarity: number;
  empathy: number;
  control: number;
  stars: number;
  xpEarned: number;
  timestamp: string;
}

export interface WeeklyXpPoint {
  label: string;
  xp: number;
  isCurrent?: boolean;
}

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // ignore storage quota errors
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const DEFAULT_WEEKLY_XP: WeeklyXpPoint[] = [
  { label: 'S-5', xp: 120 },
  { label: 'S-4', xp: 210 },
  { label: 'S-3', xp: 180 },
  { label: 'S-2', xp: 290 },
  { label: 'S-1', xp: 340 },
  { label: 'Atual', xp: 150, isCurrent: true },
];

interface AppState {
  // User profile & onboarding
  hasOnboarded: boolean;
  hasCompletedLeveling: boolean;
  userName: string;
  userAge: string;
  userLevel: 'Júnior' | 'Pleno' | 'Sênior' | null;

  // Core gamification stats
  xp: number;
  streak: number;
  energy: number;
  maxEnergy: number;
  leaves: number; // alias kept for compatibility
  completedLessons: string[];
  selectedUnitId: string;

  // Settings
  soundEnabled: boolean;
  isDarkMode: boolean;
  geminiApiKey: string;

  // Behavioral telemetry & evolution
  metrics: BehavioralMetrics;
  weeklyXp: WeeklyXpPoint[];
  gatekeeperHistory: GatekeeperRecord[];

  // Actions
  completeOnboarding: (name: string, age?: string) => void;
  completeQuickOnboarding: (
    name: string,
    startingXp: number,
    level: 'Júnior' | 'Pleno' | 'Sênior'
  ) => void;
  completeLeveling: (level: 'Júnior' | 'Pleno' | 'Sênior', startingXp: number) => void;
  setSelectedUnit: (unitId: string) => void;
  addXp: (amount: number) => void;
  loseEnergy: () => void;
  loseLeaf: () => void;
  refillEnergy: () => void;
  completeLesson: (lessonId: string, xpReward?: number, skillBoost?: Partial<BehavioralMetrics>) => void;
  recordGatekeeperSession: (record: Omit<GatekeeperRecord, 'id' | 'timestamp'>) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
  setGeminiApiKey: (key: string) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      hasCompletedLeveling: false,
      userName: '',
      userAge: '',
      userLevel: null,

      xp: 150,
      streak: 1,
      energy: 5,
      maxEnergy: 5,
      leaves: 5,
      completedLessons: [],
      selectedUnitId: 'u1',

      soundEnabled: true,
      isDarkMode: false,
      geminiApiKey: '',

      metrics: {
        clarity: 62,
        empathy: 68,
        control: 58,
        leadership: 54,
        negotiation: 50,
      },
      weeklyXp: DEFAULT_WEEKLY_XP,
      gatekeeperHistory: [],

      completeOnboarding: (name, age = '') =>
        set({ hasOnboarded: true, userName: name.trim(), userAge: age }),

      completeQuickOnboarding: (name, startingXp, level) =>
        set((state) => ({
          hasOnboarded: true,
          hasCompletedLeveling: true,
          userName: name.trim(),
          userLevel: level,
          xp: startingXp,
          streak: 1,
          energy: 5,
          leaves: 5,
          weeklyXp: state.weeklyXp.map((w) =>
            w.isCurrent ? { ...w, xp: Math.max(w.xp, startingXp) } : w
          ),
        })),

      completeLeveling: (level, startingXp) =>
        set({ hasCompletedLeveling: true, userLevel: level, xp: startingXp }),

      setSelectedUnit: (unitId) => set({ selectedUnitId: unitId }),

      addXp: (amount) =>
        set((state) => ({
          xp: state.xp + amount,
          weeklyXp: state.weeklyXp.map((w) => (w.isCurrent ? { ...w, xp: w.xp + amount } : w)),
        })),

      loseEnergy: () =>
        set((state) => {
          const next = Math.max(0, state.energy - 1);
          return { energy: next, leaves: next };
        }),

      loseLeaf: () =>
        set((state) => {
          const next = Math.max(0, state.energy - 1);
          return { energy: next, leaves: next };
        }),

      refillEnergy: () => set((state) => ({ energy: state.maxEnergy, leaves: state.maxEnergy })),

      completeLesson: (lessonId, xpReward = 50, skillBoost) =>
        set((state) => {
          const isNew = !state.completedLessons.includes(lessonId);
          const earned = isNew ? xpReward : Math.round(xpReward * 0.4);
          const nextMetrics = { ...state.metrics };

          if (skillBoost) {
            (Object.keys(skillBoost) as (keyof BehavioralMetrics)[]).forEach((k) => {
              const delta = skillBoost[k] || 0;
              nextMetrics[k] = Math.min(100, Math.round(nextMetrics[k] + delta));
            });
          } else {
            nextMetrics.clarity = Math.min(100, nextMetrics.clarity + 3);
            nextMetrics.empathy = Math.min(100, nextMetrics.empathy + 3);
          }

          return {
            completedLessons: isNew
              ? [...state.completedLessons, lessonId]
              : state.completedLessons,
            xp: state.xp + earned,
            streak: isNew ? Math.max(1, state.streak + (state.completedLessons.length === 0 ? 0 : 1)) : state.streak,
            metrics: nextMetrics,
            weeklyXp: state.weeklyXp.map((w) => (w.isCurrent ? { ...w, xp: w.xp + earned } : w)),
          };
        }),

      recordGatekeeperSession: (record) =>
        set((state) => {
          const newEntry: GatekeeperRecord = {
            ...record,
            id: `gk-${Date.now()}`,
            timestamp: new Date().toISOString(),
          };
          const blend = (current: number, incoming: number) =>
            Math.min(100, Math.round(current * 0.75 + incoming * 0.25));

          return {
            xp: state.xp + record.xpEarned,
            weeklyXp: state.weeklyXp.map((w) =>
              w.isCurrent ? { ...w, xp: w.xp + record.xpEarned } : w
            ),
            metrics: {
              ...state.metrics,
              clarity: blend(state.metrics.clarity, record.clarity),
              empathy: blend(state.metrics.empathy, record.empathy),
              control: blend(state.metrics.control, record.control),
            },
            gatekeeperHistory: [newEntry, ...state.gatekeeperHistory].slice(0, 20),
          };
        }),

      toggleSound: () =>
        set((state) => {
          const next = !state.soundEnabled;
          soundFX.setMuted(!next);
          return { soundEnabled: next };
        }),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      setGeminiApiKey: (key) => set({ geminiApiKey: key.trim() }),

      resetProgress: () =>
        set({
          hasOnboarded: false,
          hasCompletedLeveling: false,
          userName: '',
          userAge: '',
          userLevel: null,
          xp: 0,
          streak: 1,
          energy: 5,
          leaves: 5,
          completedLessons: [],
          selectedUnitId: 'u1',
          metrics: {
            clarity: 62,
            empathy: 68,
            control: 58,
            leadership: 54,
            negotiation: 50,
          },
          weeklyXp: DEFAULT_WEEKLY_XP,
          gatekeeperHistory: [],
        }),
    }),
    {
      name: 'evoala-v2-storage',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          soundFX.setMuted(!state.soundEnabled);
        }
      },
    }
  )
);

// Export Rocket for future badge usage
export { Rocket };
