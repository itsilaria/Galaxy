'use client';

import Scene from "@/components/Scene";
import SecretModal from "@/components/UI/SecretModal";
import ComposeSecretOverlay from "@/components/UI/ComposeSecretOverlay";
import LanguageSelector from "@/components/UI/LanguageSelector";
import RandomJumpButton from "@/components/UI/RandomJumpButton";
import SupportButton from "@/components/UI/SupportButton";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { translations } from "@/utils/translations";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

export default function Home() {
    const startAddingSecret = useGalaxyStore((state) => state.startAddingSecret);
    const visitorCount = useGalaxyStore((state) => state.visitorCount);
    const currentLanguage = useGalaxyStore((state) => state.currentLanguage);
    const t = translations[currentLanguage as keyof typeof translations];
    const [liveVisitors, setLiveVisitors] = useState(visitorCount);

    // Simulation of live visitors
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveVisitors(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="w-screen h-screen bg-black overflow-hidden relative font-sans">
            <Scene />

            <SecretModal />
            <ComposeSecretOverlay />
            <LanguageSelector />
            <RandomJumpButton />
            <SupportButton />

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 p-4 md:p-8 pointer-events-none z-10 w-full flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
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

            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white/40 font-mono text-[10px] md:text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {liveVisitors.toLocaleString()} {t.online}
            </div>

            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 pointer-events-none text-white/10 text-[8px] md:text-xs tracking-widest uppercase">
                {t.footer}
            </div>
        </main>
    );
}
