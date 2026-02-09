"use client";

import { create } from "zustand";

export interface Secret {
  id: string;
  text: string;
  isMock?: boolean;
  position?: [number, number, number];
}

interface GalaxyStore {
  secrets: Secret[];
  selectedSecret: Secret | null;
  isModalOpen: boolean;
  fetchSecrets: () => Promise<void>;
  addSecret: (text: string) => Promise<void>;
  selectSecret: (secret: Secret) => void;
  closeModal: () => void;
  findMySecret: (id: string) => void;
}

export const useGalaxyStore = create<GalaxyStore>((set, get) => ({
  secrets: [],
  selectedSecret: null,
  isModalOpen: false,

  fetchSecrets: async () => {
    try {
      const res = await fetch("/api/secrets");
      const data: Secret[] = await res.json();
      const secretsWithPos = data.map((s) => ({
        ...s,
        position: s.position || [
          Math.random() * 10 - 5,
          Math.random() * 5,
          Math.random() * 10 - 5,
        ],
      }));
      set({ secrets: secretsWithPos });
    } catch (err) {
      console.error("Errore fetchSecrets:", err);
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
      set({ secrets: [...get().secrets, newSecret] });
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
}));
