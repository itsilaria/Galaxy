"use client";

import { create } from "zustand";

export interface Secret {
  id: string;
  text: string;
  isMock?: boolean;
  position?: [number, number, number];
  color?: string;
  isSupernova?: boolean;
}

interface GalaxyStore {
  secrets: Secret[];
  selectedSecret: Secret | null;
  isModalOpen: boolean;
  isStarted: boolean;
  isAddingSecret: boolean;
  currentLanguage: string;
  visitorCount: number;
  fetchSecrets: () => Promise<void>;
  addSecret: (text: string, color?: string, isSupernova?: boolean) => Promise<void>;
  selectSecret: (secret: Secret) => void;
  closeModal: () => void;
  findMySecret: (id: string) => void;
  startGalaxy: () => void;
  startAddingSecret: () => void;
  cancelAddingSecret: () => void;
  setLanguage: (lang: string) => void;
}

export const useGalaxyStore = create<GalaxyStore>((set, get) => ({
  secrets: [],
  selectedSecret: null,
  isModalOpen: false,
  isStarted: false,
  isAddingSecret: false,
  currentLanguage: "en",
  visitorCount: Math.floor(Math.random() * 500) + 100,

  fetchSecrets: async () => {
    try {
      const res = await fetch("/api/secrets");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Secret[] = await res.json();
      const secretsWithPos = data.map((s) => ({
        ...s,
        position: s.position || [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 30,
        ] as [number, number, number],
      }));
      set({ secrets: secretsWithPos });
    } catch (err) {
      console.error("Error fetchSecrets:", err);
      // Provide mock secrets as fallback so the galaxy isn't empty
      const mockSecrets: Secret[] = Array.from({ length: 20 }, (_, i) => ({
        id: `mock-${i}`,
        text: [
          "I still think about that moment every day...",
          "Nobody knows I cried that night.",
          "I pretend to be happy but I'm not.",
          "I wish I could go back in time.",
          "My biggest fear is being alone.",
          "I never told anyone this before.",
          "Sometimes I just want to disappear.",
          "I forgave them but I didn't forget.",
          "The stars remind me of you.",
          "I talk to the moon when nobody's watching.",
          "I'm braver than I think.",
          "One day I'll make it.",
          "I secretly love rainy days.",
          "I miss who I used to be.",
          "Music saved my life.",
          "I dream in colors.",
          "My heart is heavier than it looks.",
          "I believe in second chances.",
          "The universe hears me.",
          "I'm still learning to let go.",
        ][i],
        isMock: true,
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 30,
        ] as [number, number, number],
      }));
      set({ secrets: mockSecrets });
    }
  },

  addSecret: async (text: string, color?: string, isSupernova?: boolean): Promise<void> => {
    try {
      const newSecret: Secret = {
        id: Date.now().toString(),
        text,
        color,
        isSupernova,
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 30,
        ] as [number, number, number],
      };
      await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSecret),
      });
      set({ secrets: [...get().secrets, newSecret], isAddingSecret: false });
    } catch (err) {
      console.error("Error addSecret:", err);
    }
  },

  selectSecret: (secret: Secret) => {
    set({ selectedSecret: secret, isModalOpen: true });
  },

  closeModal: () => {
    set({ selectedSecret: null, isModalOpen: false });
  },

  findMySecret: (id: string) => {
    const secret = get().secrets.find((s) => s.id === id);
    if (secret) {
      set({ selectedSecret: secret, isModalOpen: true });
    }
  },

  startGalaxy: () => {
    set({ isStarted: true });
  },

  startAddingSecret: () => {
    set({ isAddingSecret: true });
  },

  cancelAddingSecret: () => {
    set({ isAddingSecret: false });
  },

  setLanguage: (lang: string) => {
    set({ currentLanguage: lang });
  },
}));
