'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'it', label: 'IT' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' },
    { code: 'jp', label: 'JP' },
];

export default function LanguageSelector() {
    const { currentLanguage, setLanguage } = useGalaxyStore();

    return (
        <div className="flex gap-1 flex-wrap justify-end max-w-[180px]">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`
                        px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all
                        ${currentLanguage === lang.code
                            ? 'bg-white text-black scale-110 shadow-lg'
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'}
                    `}
                    aria-label={`Switch to ${lang.label}`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
