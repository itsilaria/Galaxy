'use client';

import dynamic from 'next/dynamic';
import SecretModal from "@/components/UI/SecretModal";
import ComposeSecretOverlay from "@/components/UI/ComposeSecretOverlay";
import LanguageSelector from "@/components/UI/LanguageSelector";
import RandomJumpButton from "@/components/UI/RandomJumpButton";
import SupportButton from "@/components/UI/SupportButton";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { translations } from "@/utils/translations";

import WelcomeScreen from "@/components/UI/WelcomeScreen";
import BackgroundAudio from "@/components/UI/BackgroundAudio";
import VisitorCounter from "@/components/UI/VisitorCounter";

// Dynamically import Scene to prevent SSR issues and heavy initial load
const Scene = dynamic(() => import("@/components/Scene"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />
});

export default function Home() {
    const { startAddingSecret, currentLanguage, isStarted } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations];

    return (
        <main className="w-screen h-screen bg-black overflow-hidden relative font-sans">
            <WelcomeScreen />

            {/* Solo render se la galassia è partita - previene crash iniziali */}
            {isStarted && (
                <>
                    <div className="fixed inset-0 z-0">
                        <Scene />
                    </div>

                    <BackgroundAudio />
                    <SecretModal />
                    <ComposeSecretOverlay />
                    <LanguageSelector />
                    <RandomJumpButton />
                    <SupportButton />
                    <VisitorCounter />

                    {/* Versione Tag per verifica deployment */}
                    <div className="fixed top-2 right-2 text-[8px] text-white/5 z-[9999] pointer-events-none">
                        v1.4.2-final
                    </div>

                    {/* UI Overlay - Z-index alto per garantire cliccabilità */}
                    <div className="absolute top-0 left-0 p-4 md:p-8 pointer-events-none z-[500] w-full flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0 animate-fade-in">
                        <div className="bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0 rounded-lg">
                            <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-200 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none">
                                {t.title}
                            </h1>
                            <p className="text-white/60 text-[10px] md:text-base mt-1 md:mt-2 max-w-[200px] md:max-w-md leading-relaxed">
                                {t.subtitle}
                            </p>
                        </div>

                        <button
                            onClick={() => startAddingSecret()}
                            className="pointer-events-auto bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-xl text-white px-6 md:px-8 py-2 md:py-3 rounded-full border border-white/20 transition-all text-xs md:text-base font-medium glow-hover shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            {t.button}
                        </button>
                    </div>

                    <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 pointer-events-none text-white/10 text-[8px] md:text-xs tracking-widest uppercase">
                        {t.footer}
                    </div>
                </>
            )}
        </main>
    );
}
