'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

export default function SupportButton() {
    const currentLanguage = useGalaxyStore((s) => s.currentLanguage);
    const t = translations[currentLanguage as keyof typeof translations] as Record<string, string>;

    return (
        <a
            href="https://buymeacoffee.com/perunbro"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-16 md:top-20 right-4 md:right-8 pointer-events-auto z-[100] 
                       bg-yellow-500/10 hover:bg-yellow-500/20
                       backdrop-blur-xl px-4 py-2 md:px-5 md:py-3 rounded-full 
                       border border-white/20 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]
                       transition-all active:scale-95 shadow-[0_0_20px_rgba(255,200,0,0.15)]
                       flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            <span className="hidden md:inline">{t.support || 'Support'}</span>
        </a>
    );
}
