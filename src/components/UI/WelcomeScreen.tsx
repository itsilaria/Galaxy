'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';
import { useState } from 'react';

export default function WelcomeScreen() {
    const { isStarted, startGalaxy, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations] as any;
    const [isClosing, setIsClosing] = useState(false);

    if (isStarted && !isClosing) return null;

    const handleEnter = () => {
        setIsClosing(true);
        // Small delay for animation
        setTimeout(() => {
            startGalaxy();
        }, 1000);
    };

    return (
        <div className={`fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black transition-all duration-1000 ${isClosing ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter italic animate-slide-up">
                    {t.title}
                </h1>
                <p className="text-white/40 text-sm md:text-lg mb-12 uppercase tracking-[0.5em] font-light animate-slide-up [animation-delay:0.2s]">
                    {t.subtitle}
                </p>

                <button
                    onClick={handleEnter}
                    className="group relative px-12 py-5 rounded-full bg-white text-black font-bold uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 animate-slide-up [animation-delay:0.4s]"
                >
                    <span className="relative z-10">Enter the Galaxy</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <div className="mt-8 text-[10px] text-white/20 uppercase tracking-widest animate-pulse">
                    Click to initialize spatial audio
                </div>
            </div>

            <div className="absolute bottom-12 text-[10px] text-white/10 uppercase tracking-[0.4em]">
                {t.footer}
            </div>
        </div>
    );
}
