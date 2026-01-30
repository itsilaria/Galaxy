'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

export default function SupportButton() {
    const currentLanguage = useGalaxyStore((s) => s.currentLanguage);
    const t = translations[currentLanguage as keyof typeof translations] as any;

    return (
        <a
            href="https://www.paypal.me/ilariamattana"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-24 right-4 md:right-8 pointer-events-auto z-20 
                       bg-white/5 hover:bg-white/15 backdrop-blur-md px-4 py-2 rounded-full 
                       border border-white/10 text-white/50 text-[9px] uppercase tracking-[0.2em]
                       transition-all hover:text-white hover:scale-105 shadow-lg"
        >
            {t.support}
        </a>
    );
}
