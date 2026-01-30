'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';

const languages = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'it', label: '🇮🇹 IT' },
    { code: 'es', label: '🇪🇸 ES' },
    { code: 'fr', label: '🇫🇷 FR' },
    { code: 'de', label: '🇩🇪 DE' },
    { code: 'jp', label: '🇯🇵 JP' },
];

export default function LanguageSelector() {
    const { currentLanguage, setLanguage } = useGalaxyStore();

    return (
        <div className="absolute bottom-16 right-8 pointer-events-auto z-20 flex gap-2 flex-wrap justify-end max-w-[200px]">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`
            px-3 py-1 rounded-full text-xs font-bold transition-all
            ${currentLanguage === lang.code
                            ? 'bg-white text-black scale-110 shadow-lg'
                            : 'bg-black/30 text-white/50 hover:bg-white/10 hover:text-white'}
          `}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
