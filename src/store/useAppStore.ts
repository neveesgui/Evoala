import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Shield, ShieldAlert, ShieldCheck, Medal, Trophy, Crown, Gem, Star, Rocket } from 'lucide-react';

export const RANK_THRESHOLDS = [
  { name: 'Ferro', minXp: 0, color: 'text-slate-500 bg-slate-500/10 border-slate-500', icon: ShieldAlert },
  { name: 'Bronze', minXp: 300, color: 'text-orange-700 dark:text-orange-500 bg-orange-500/10 border-orange-500', icon: Shield },
  { name: 'Prata', minXp: 700, color: 'text-slate-400 bg-slate-400/10 border-slate-400', icon: ShieldCheck },
  { name: 'Ouro', minXp: 1200, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500', icon: Medal },
  { name: 'Platina', minXp: 1800, color: 'text-teal-500 bg-teal-500/10 border-teal-500', icon: Star },
  { name: 'Diamante', minXp: 2500, color: 'text-blue-500 bg-blue-500/10 border-blue-500', icon: Gem },
  { name: 'Mestre', minXp: 3500, color: 'text-purple-500 bg-purple-500/10 border-purple-500', icon: Trophy },
  { name: 'Grão-Mestre', minXp: 4800, color: 'text-red-500 bg-red-500/10 border-red-500', icon: Crown },
  { name: 'Desafiante', minXp: 6500, color: 'text-sky-400 bg-sky-400/10 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.6)]', icon: Rocket },
];

export const getUserRank = (xp: number) => {
  return RANK_THRESHOLDS.slice().reverse().find(r => xp >= r.minXp) || RANK_THRESHOLDS[0];
};

const safeStorage = {
  getItem: (name: string): string | null => { try { return localStorage.getItem(name); } catch { return null; } },
  setItem: (name: string, value: string): void => { try { localStorage.setItem(name, value); } catch { } },
  removeItem: (name: string): void => { try { localStorage.removeItem(name); } catch { } }
};

interface AppState {
  hasOnboarded: boolean;
  userName: string;
  userAge: string;
  xp: number;
  streak: number;
  leaves: number;
  completedLessons: string[];
  isDarkMode: boolean;
  hasCompletedLeveling: boolean;
  userLevel: 'Júnior' | 'Pleno' | 'Sênior' | null;
  completeOnboarding: (name: string, age: string) => void;
  toggleDarkMode: () => void;
  completeLeveling: (level: 'Júnior' | 'Pleno' | 'Sênior', startingXp: number) => void;
  addXp: (amount: number) => void;
  loseLeaf: () => void;
  completeLesson: (lessonId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      userName: '',
      userAge: '',
      xp: 0,
      streak: 1,
      leaves: 10,
      completedLessons: [],
      isDarkMode: true,
      hasCompletedLeveling: false,
      userLevel: null,
      completeOnboarding: (name, age) => set({ hasOnboarded: true, userName: name, userAge: age }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      completeLeveling: (level, startingXp) => set({ hasCompletedLeveling: true, userLevel: level, xp: startingXp }),
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      loseLeaf: () => set((state) => ({ leaves: Math.max(0, state.leaves - 1) })),
      completeLesson: (lessonId) => set((state) => ({
        completedLessons: state.completedLessons.includes(lessonId) ? state.completedLessons : [...state.completedLessons, lessonId]
      }))
    }),
    { name: 'evoala-storage', storage: createJSONStorage(() => safeStorage) }
  )
);
