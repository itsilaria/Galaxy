import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Secret {
    id: string;
    text: string;
    position: [number, number, number];
    color: string;
    timestamp: number;
    language: string;
}

type SupportedLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'jp';

interface GalaxyState {
    secrets: Secret[];
    selectedSecret: Secret | null;
    isModalOpen: boolean;
    isAddingSecret: boolean;
    visitorCount: number;
    currentLanguage: SupportedLanguage;
    isWarping: boolean;
    isStarted: boolean;
    _hasHydrated: boolean;
    isLoading: boolean;

    // Actions
    setLanguage: (lang: SupportedLanguage) => void;
    selectSecret: (secret: Secret | null) => void;
    openModal: () => void;
    closeModal: () => void;
    startAddingSecret: () => void;
    cancelAddingSecret: () => void;
    addSecret: (text: string) => Promise<void>;
    fetchSecrets: () => Promise<void>;
    startGalaxy: () => void;
    setHasHydrated: (state: boolean) => void;
}

let languageChangeTimeout: NodeJS.Timeout | null = null;

export const useGalaxyStore = create<GalaxyState>()(
    persist(
        (set, get) => ({
            secrets: [],
            selectedSecret: null,
            isModalOpen: false,
            isAddingSecret: false,
            visitorCount: 1243,
            currentLanguage: 'en',
            isWarping: false,
            isStarted: false,
            _hasHydrated: false,
            isLoading: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            setLanguage: (lang) => {
                if (languageChangeTimeout) clearTimeout(languageChangeTimeout);
                set({ isWarping: true, currentLanguage: lang });
                languageChangeTimeout = setTimeout(() => {
                    set({ isWarping: false });
                    languageChangeTimeout = null;
                }, 1000);
            },

            selectSecret: (secret) => set({ selectedSecret: secret, isModalOpen: !!secret }),
            openModal: () => set({ isModalOpen: true }),
            closeModal: () => set({ isModalOpen: false, selectedSecret: null }),
            startAddingSecret: () => set({ isAddingSecret: true }),
            cancelAddingSecret: () => set({ isAddingSecret: false }),
            startGalaxy: () => {
                set({ isStarted: true });
                get().fetchSecrets();
            },

            fetchSecrets: async () => {
                try {
                    set({ isLoading: true });
                    const response = await fetch('/api/secrets');
                    const data = await response.json();
                    if (data.secrets) {
                        set({ secrets: data.secrets, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching secrets:', error);
                    set({ isLoading: false });
                }
            },

            addSecret: async (text: string) => {
                try {
                    const newSecret = {
                        text,
                        position: [
                            (Math.random() - 0.5) * 40,
                            (Math.random() - 0.5) * 40,
                            (Math.random() - 0.5) * 40
                        ] as [number, number, number],
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        language: get().currentLanguage,
                    };

                    const response = await fetch('/api/secrets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newSecret),
                    });

                    const data = await response.json();
                    if (data.success && data.secret) {
                        set((state) => ({
                            secrets: [...state.secrets, data.secret],
                            isAddingSecret: false
                        }));
                    }
                } catch (error) {
                    console.error('Error adding secret:', error);
                    set({ isAddingSecret: false });
                }
            },
        }),
        {
            name: 'galaxy-secrets-storage-v2',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            partialize: (state) => ({
                currentLanguage: state.currentLanguage
            }),
        }
    )
);
