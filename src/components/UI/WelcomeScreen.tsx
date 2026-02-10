'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';
import { useState } from 'react';
import LanguageSelector from '@/components/UI/LanguageSelector';

export default function WelcomeScreen() {
    const { isStarted, startGalaxy, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations] as Record<string, string>;
    const [isClosing, setIsClosing] = useState(false);

    if (isStarted) return null;

    const handleEnter = () => {
        setIsClosing(true);
        setTimeout(() => {
            startGalaxy();
        }, 800);
    };

    return (
        <div className={`fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-black transition-all duration-1000 ${isClosing ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 pointer-events-auto'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <h1 className="text-4xl md:text-8xl font-black text-white mb-4 tracking-tighter italic animate-slide-up text-balance">
                    {t.title}
                </h1>
                <p className="text-white/40 text-xs md:text-lg mb-10 md:mb-12 uppercase tracking-[0.3em] md:tracking-[0.5em] font-light animate-slide-up [animation-delay:0.2s] text-balance">
                    {t.subtitle}
                </p>

                <button
                    onClick={handleEnter}
                    className="group relative px-10 py-4 md:px-12 md:py-5 rounded-full bg-white text-black font-bold uppercase text-[10px] md:text-xs tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 animate-slide-up [animation-delay:0.4s]"
                >
                    <span className="relative z-10">{t.enterGalaxy}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <div className="mt-6 text-[10px] text-white/20 uppercase tracking-widest animate-pulse">
                    {t.initAudio}
                </div>

                {/* Language selector on welcome screen */}
                <div className="mt-8 animate-slide-up [animation-delay:0.6s]">
                    <LanguageSelector />
                </div>
            </div>

            <div className="absolute bottom-8 md:bottom-12 text-[10px] text-white/10 uppercase tracking-[0.4em]">
                {t.footer}
            </div>
        </div>
    );
}
