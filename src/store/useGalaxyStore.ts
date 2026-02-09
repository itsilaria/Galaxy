import { create } from "zustand";

export interface Secret {
  id: string;
  text: string;
  isMock?: boolean;
}

interface GalaxyStore {
  secrets: Secret[];
  selectedSecret: Secret | null;
  isModalOpen: boolean;
  fetchSecrets: () => Promise<void>;
  addSecret: (text: string) => Promise<void>;
  selectSecret: (secret: Secret) => void;
  closeModal: () => void;
}

export const useGalaxyStore = create<GalaxyStore>((set, get) => ({
  secrets: [],
  selectedSecret: null,
  isModalOpen: false,

  fetchSecrets: async () => {
    try {
      const res = await fetch("/api/secrets");
      const data: Secret[] = await res.json();
      set({ secrets: data });
    } catch (err) {
      console.error("Errore fetchSecrets:", err);
    }
  },

  addSecret: async (text: string) => {
    try {
      const res = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const newSecret: Secret = await res.json();
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
}));
