'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

export default function SupportButton() {
    const currentLanguage = useGalaxyStore((s) => s.currentLanguage);
    const t = translations[currentLanguage as keyof typeof translations] as any;

    return (
        <a
            href="https://www.paypal.me/yourusername" // User will need to change this
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20 
                       bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 rounded-full 
                       border border-white/10 text-white/60 text-[10px] uppercase tracking-[0.2em]
                       transition-all hover:text-white hover:scale-110 shadow-lg"
        >
            {t.support}
        </a>
    );
}
