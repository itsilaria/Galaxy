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

function generatePosition(): [number, number, number] {
  return [
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 30,
  ];
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

      // Ensure all secrets have positions
      const secretsWithPos = data.map((s) => ({
        ...s,
        position: (s.position && Array.isArray(s.position) && s.position.length === 3)
          ? s.position as [number, number, number]
          : generatePosition(),
      }));

      set({ secrets: secretsWithPos });
    } catch (err) {
      console.error("Error fetchSecrets:", err);
      // Only use mock fallback if there are no secrets already loaded
      if (get().secrets.length === 0) {
        const mockTexts = [
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
        ];
        const mockSecrets: Secret[] = mockTexts.map((text, i) => ({
          id: `mock-${i}`,
          text,
          isMock: true,
          position: generatePosition(),
        }));
        set({ secrets: mockSecrets });
      }
    }
  },

  addSecret: async (text: string, color?: string, isSupernova?: boolean): Promise<void> => {
    const newSecret: Secret = {
      id: Date.now().toString(),
      text,
      color,
      isSupernova,
      position: generatePosition(),
    };

    try {
      const res = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSecret),
      });

      if (res.ok) {
        const saved = await res.json();
        // Use server-returned data (which has the saved position)
        const savedSecret: Secret = {
          ...newSecret,
          ...saved,
          position: (saved.position && Array.isArray(saved.position) && saved.position.length === 3)
            ? saved.position as [number, number, number]
            : newSecret.position,
        };
        set({
          secrets: [...get().secrets, savedSecret],
          isAddingSecret: false,
        });
      } else {
        // Even if API fails, add locally so user sees their star
        set({
          secrets: [...get().secrets, newSecret],
          isAddingSecret: false,
        });
      }
    } catch (err) {
      console.error("Error addSecret:", err);
      // Add locally as fallback
      set({
        secrets: [...get().secrets, newSecret],
        isAddingSecret: false,
      });
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
