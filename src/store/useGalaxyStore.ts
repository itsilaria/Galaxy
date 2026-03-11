"use client";

import { create } from "zustand";

export interface Secret {
  id: string;
  text: string;
  isMock?: boolean;
  position?: [number, number, number];
}

type Language = "en" | "it" | "es" | "fr" | "de" | "jp";

interface GalaxyStore {
  secrets: Secret[];
  selectedSecret: Secret | null;
  isModalOpen: boolean;
  isStarted: boolean;
  isAddingSecret: boolean;
  isWarping: boolean;
  currentLanguage: Language;
  visitorCount: number;
  fetchSecrets: () => Promise<void>;
  addSecret: (text: string) => Promise<void>;
  selectSecret: (secret: Secret) => void;
  closeModal: () => void;
  findMySecret: (id: string) => void;
  startGalaxy: () => void;
  setLanguage: (lang: Language) => void;
  startAddingSecret: () => void;
  cancelAddingSecret: () => void;
}

export const useGalaxyStore = create<GalaxyStore>((set, get) => ({
  secrets: [],
  selectedSecret: null,
  isModalOpen: false,
  isStarted: false,
  isAddingSecret: false,
  isWarping: false,
  currentLanguage: "en",
  visitorCount: Math.floor(Math.random() * 500) + 100,

  fetchSecrets: async () => {
    try {
      const res = await fetch("/api/secrets");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      
      // Handle both array and error responses
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return;
      }
      
      const secretsWithPos = data.map((s: Secret) => ({
        ...s,
        position: s.position || [
          Math.random() * 10 - 5,
          Math.random() * 5,
          Math.random() * 10 - 5,
        ],
      }));
      set({ secrets: secretsWithPos });
    } catch (err) {
      console.error("Error fetching secrets:", err);
      // Set some default secrets so the app works
      set({
        secrets: [
          { id: "1", text: "The stars hold our deepest secrets...", position: [-2, 2, 1] },
          { id: "2", text: "Every light in the sky is a wish waiting to be heard.", position: [3, 1, -2] },
          { id: "3", text: "In the darkness, we find our truest selves.", position: [0, 3, 0] },
        ]
      });
    }
  },

  addSecret: async (text: string): Promise<void> => {
    try {
      const newSecret: Secret = {
        id: Date.now().toString(),
        text,
        position: [
          Math.random() * 10 - 5,
          Math.random() * 5,
          Math.random() * 10 - 5,
        ],
      };
      await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSecret),
      });
      set({ secrets: [...get().secrets, newSecret], isAddingSecret: false });
    } catch (err) {
      console.error("Errore addSecret:", err);
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
    } else {
      alert("Segreto non trovato");
    }
  },

  startGalaxy: () => {
    set({ isStarted: true });
  },

  setLanguage: (lang: Language) => {
    set({ currentLanguage: lang });
  },

  startAddingSecret: () => {
    set({ isAddingSecret: true });
  },

  cancelAddingSecret: () => {
    set({ isAddingSecret: false });
  },
}));
