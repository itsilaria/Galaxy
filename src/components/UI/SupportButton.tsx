'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

export default function SupportButton() {
    const currentLanguage = useGalaxyStore((s) => s.currentLanguage);
    const t = translations[currentLanguage as keyof typeof translations] as any;

    return (
        <a
            href="https://www.buymeacoffee.com/perunbro"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-28 right-4 md:right-8 pointer-events-auto z-[100] 
                       bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30
                       backdrop-blur-xl px-5 py-3 rounded-full 
                       border border-white/30 text-white text-[10px] font-bold uppercase tracking-[0.2em]
                       transition-all active:scale-95 shadow-[0_0_20px_rgba(255,200,0,0.3)]
                       flex items-center gap-2"
        >
            <span className="text-sm">☕</span>
            {t.support}
        </a>
    );
}
