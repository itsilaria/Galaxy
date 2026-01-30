'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

export default function SupportButton() {
    const currentLanguage = useGalaxyStore((s) => s.currentLanguage);
    const t = translations[currentLanguage as keyof typeof translations] as any;

    return (
        <a
            href="https://www.paypal.com/paypalme/perunbro"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-8 right-6 md:right-10 pointer-events-auto z-[60] 
                       bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30
                       backdrop-blur-xl px-5 py-2 rounded-full 
                       border border-white/20 text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]
                       transition-all hover:text-white hover:scale-110 shadow-[0_0_20px_rgba(255,200,0,0.2)] anim-glow"
        >
            {t.support}
        </a>
    );
}
