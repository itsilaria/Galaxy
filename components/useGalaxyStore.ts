import create from 'zustand';

export const useGalaxyStore = create((set) => ({
  secrets: [] as string[],
  fetchSecrets: () => {
    // esempio: potresti caricare i segreti da API o locale
    set({ secrets: ['segreto1', 'segreto2'] });
  },
  addSecret: (secret: string) => {
    set((state) => ({ secrets: [...state.secrets, secret] }));
  },
  findMySecret: (id: string) => {
    // esempio: logic per trovare un segreto
    console.log('Cerco segreto con id:', id);
  },
}));
