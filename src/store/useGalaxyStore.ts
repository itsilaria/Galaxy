import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as THREE from 'three';

export interface Secret {
    id: string;
    text: string;
    position: [number, number, number];
    color: string;
    timestamp: number;
    country: string;
    language: string;
    isPremium?: boolean;
    starType?: 'standard' | 'supernova';
    glowColor?: string;
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

    // Actions
    setLanguage: (lang: SupportedLanguage) => void;
    selectSecret: (secret: Secret | null) => void;
    openModal: () => void;
    closeModal: () => void;
    startAddingSecret: () => void;
    cancelAddingSecret: () => void;
    addSecret: (text: string, isPremium?: boolean, starType?: 'standard' | 'supernova', glowColor?: string) => void;
    startGalaxy: () => void;
}

// Mock data generator - Deterministic for hydration stability
const generateMockSecrets = (count: number, lang: SupportedLanguage): Secret[] => {
    const secrets: Secret[] = [];
    const colors = ['#ffddcc', '#ccddff', '#ffccdd', '#ddffcc', '#ffffff'];

    let seed = 42; // Fixed seed for mock stars
    const pseudoRandom = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    const contentPool = {
        en: ["I haven't told my parents I lost my job.", "I'm in love with my best friend.", "I want to move to Mars.", "I stole a balloon when I was 5.", "Sometimes I just want to disappear.", "I'm afraid of the dark."],
        it: ["Non ho detto ai miei che ho perso il lavoro.", "Sono innamorato della mia migliore amica.", "Voglio trasferirmi su Marte.", "Ho rubato un palloncino a 5 anni.", "A volte vorrei solo sparire.", "Ho paura del buio.", "La pizza con l'ananas mi piace.", "Odio il mio capo ma sorrido sempre."],
        es: ["No le he dicho a mis padres que perdí mi trabajo.", "Estoy enamorado de mi mejor amigo.", "Quiero mudarme a Marte.", "Robé un globo cuando tenía 5 años.", "A veces solo quiero desaparecer.", "Tengo miedo a la oscuridad."],
        fr: ["Je n'ai pas dit à mes parents que j'ai perdu mon emploi.", "Je suis amoureux de mon meilleur ami.", "Je veux déménager sur Mars.", "J'ai volé un ballon quand j'ai 5 ans.", "Parfois, je veux juste disparaître.", "J'ai peur du noir."],
        de: ["Ich habe meinen Eltern nicht gesagt, dass ich meinen Job verloren habe.", "Ich bin in meinen besten Freund verliebt.", "Ich möchte zum Mars ziehen.", "Ich habe als Kind einen Ballon gestohlen.", "Manchmal möchte ich einfach verschwinden.", "Ich habe Angst im Dunkeln."],
        jp: ["両親に仕事を失ったことを言っていません。", "親友に恋しています。", "火星に移住したいです。", "5歳の時に風船を盗みました。", "時々消えてしまいたいと思います。", "暗闇が怖いです。"]
    };

    const pool = contentPool[lang as SupportedLanguage] || contentPool['en'];

    for (let i = 0; i < count; i++) {
        const r = 10 + pseudoRandom() * 40;
        const theta = pseudoRandom() * Math.PI * 2;
        const phi = Math.acos(2 * pseudoRandom() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        secrets.push({
            id: `secret-${lang}-${i}`,
            text: pool[Math.floor(pseudoRandom() * pool.length)],
            position: [x, y, z],
            color: colors[Math.floor(pseudoRandom() * colors.length)],
            timestamp: 1640995200000 + i * 10000, // Fixed historical time
            language: lang,
            country: lang.toUpperCase(),
        });
    }
    return secrets;
};

export const useGalaxyStore = create<GalaxyState>()(
    persist(
        (set) => ({
            secrets: generateMockSecrets(150, 'en'),
            selectedSecret: null,
            isModalOpen: false,
            isAddingSecret: false,
            visitorCount: 1243,
            currentLanguage: 'en',
            isWarping: false,
            isStarted: false,

            setLanguage: (lang) => {
                set({ isWarping: true });
                setTimeout(() => {
                    set({
                        currentLanguage: lang,
                        secrets: generateMockSecrets(150, lang),
                        isWarping: false
                    });
                }, 1000);
            },
            selectSecret: (secret) => set({ selectedSecret: secret, isModalOpen: !!secret }),
            openModal: () => set({ isModalOpen: true }),
            closeModal: () => set({ isModalOpen: false, selectedSecret: null }),
            startAddingSecret: () => set({ isAddingSecret: true }),
            cancelAddingSecret: () => set({ isAddingSecret: false }),
            startGalaxy: () => set({ isStarted: true }),
            addSecret: (text, isPremium, starType, glowColor) => set((state) => {
                const newSecret: Secret = {
                    id: `new-${Date.now()}`,
                    text,
                    position: [
                        (Math.random() - 0.5) * 40,
                        (Math.random() - 0.5) * 40,
                        (Math.random() - 0.5) * 40
                    ],
                    color: isPremium ? (glowColor || '#ffd700') : '#ff00aa',
                    timestamp: Date.now(),
                    language: state.currentLanguage,
                    country: state.currentLanguage.toUpperCase(),
                    starType: starType || 'standard',
                    isPremium
                };
                return { secrets: [...state.secrets, newSecret], isAddingSecret: false };
            }),
        }),
        {
            name: 'galaxy-secrets-storage',
            partialize: (state) => ({ secrets: state.secrets }),
        }
    )
);
