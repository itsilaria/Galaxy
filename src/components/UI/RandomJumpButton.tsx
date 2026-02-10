'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { useState } from 'react';
import { translations } from '@/utils/translations';

export default function RandomJumpButton() {
    const { secrets, selectSecret, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations] as Record<string, string>;
    const [isJumping, setIsJumping] = useState(false);

    const handleJump = () => {
        if (secrets.length === 0) return;
        setIsJumping(true);
        const random = secrets[Math.floor(Math.random() * secrets.length)];
        selectSecret(random);
        setTimeout(() => setIsJumping(false), 1000);
    };

    return (
        <button
            onClick={handleJump}
            className={`
                bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20
                text-white font-bold py-2 px-5 md:py-3 md:px-8 rounded-full transition-all duration-300
                flex items-center gap-2
                ${isJumping ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}
                hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
            `}
            aria-label="Random Jump"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="2"/></svg>
            <span className="tracking-widest text-[10px] md:text-xs uppercase hidden md:inline">
                {t.randomJump || 'Random'}
            </span>
        </button>
    );
}
