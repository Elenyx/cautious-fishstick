import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character } from '../utils/dynasty';

export type GameState = {
  dynasty: Record<string, Character>;
  playerId?: string | null;
  lastSaved?: number | null;
  setDynasty: (d: Record<string, Character>) => void;
  upsertCharacter: (c: Character) => void;
  removeCharacter: (id: string) => void;
  save: () => Promise<void>;
  load: () => Promise<void>;
};

const STORAGE_KEY = 'dynastylife:save:v1';

export const useGameStore = create<GameState>((set, get) => ({
  dynasty: {},
  playerId: null,
  lastSaved: null,
  setDynasty: (d) => set({ dynasty: d }),
  upsertCharacter: (c) => set((s) => ({ dynasty: { ...s.dynasty, [c.id]: c } })),
  removeCharacter: (id) => set((s) => {
    const next = { ...s.dynasty };
    delete next[id];
    return { dynasty: next };
  }),
  save: async () => {
    const s = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ dynasty: s.dynasty, playerId: s.playerId, lastSaved: Date.now() }));
      set({ lastSaved: Date.now() });
    } catch (err) {
      // In a real app surface error to UI
      console.warn('Failed to save', err);
    }
  },
  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({ dynasty: parsed.dynasty || {}, playerId: parsed.playerId || null, lastSaved: parsed.lastSaved || null });
    } catch (err) {
      console.warn('Failed to load save', err);
    }
  }
}));
