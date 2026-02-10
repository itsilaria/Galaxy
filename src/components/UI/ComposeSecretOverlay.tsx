'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';
import React, { useState } from 'react';
import { containsProfanity } from '@/utils/profanityFilter';

export default function ComposeSecretOverlay() {
    const { isAddingSecret, cancelAddingSecret, addSecret, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations] as Record<string, string>;
    const [text, setText] = useState('');
    const [starType, setStarType] = useState<'standard' | 'supernova'>('standard');
    const [selectedColor, setSelectedColor] = useState('#ffd700');

    const premiumColors = [
        { id: 'gold', color: '#ffd700', label: t.colorGold || 'Gold' },
        { id: 'blue', color: '#00ccff', label: t.colorBlue || 'Blue' },
        { id: 'pink', color: '#ff00aa', label: t.colorPink || 'Pink' },
        { id: 'green', color: '#00fca8', label: t.colorGreen || 'Green' },
    ];

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (text.trim()) {
            if (containsProfanity(text)) {
                setError(t.errorProfanity || 'Profanity detected.');
                return;
            }

            if (starType === 'supernova') {
                window.open('https://buymeacoffee.com/perunbro', '_blank');
            }
            addSecret(
                text,
                starType === 'supernova' ? selectedColor : undefined,
                starType === 'supernova'
            );
            setText('');
            setStarType('standard');
            setError(null);
        }
    };

    if (!isAddingSecret) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-black/80 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden p-6 md:p-8">
                <h2 className="text-2xl md:text-4xl font-black text-white mb-2 text-center tracking-tighter italic text-balance">
                    {t.modalTitle || 'Incoming Transmission'}
                </h2>
                <p className="text-center text-white/40 mb-6 md:mb-8 text-[10px] md:text-xs uppercase tracking-[0.3em]">
                    {t.composeSubtitle || 'It will be lost in the galaxy forever.'}
                </p>

                {/* Star Type Selection */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                    <button
                        type="button"
                        onClick={() => setStarType('standard')}
                        className={`p-3 md:p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${starType === 'standard'
                            ? 'bg-white/10 border-white/40 ring-1 ring-white/20'
                            : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'
                            }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t.standardColor || 'Standard'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStarType('supernova')}
                        className={`p-3 md:p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${starType === 'supernova'
                            ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]'
                            : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'
                            }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">{t.supernova || 'Supernova (Premium)'}</span>
                    </button>
                </div>

                {starType === 'supernova' && (
                    <div className="mb-6 md:mb-8 animate-slide-up">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4 text-center">
                            {t.selectColor || 'Select Color'}
                        </label>
                        <div className="flex justify-center gap-4">
                            {premiumColors.map((pc) => (
                                <button
                                    key={pc.id}
                                    type="button"
                                    onClick={() => setSelectedColor(pc.color)}
                                    className={`w-10 h-10 rounded-full transition-all border-2 flex items-center justify-center ${selectedColor === pc.color ? 'border-white scale-125' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    style={{ backgroundColor: pc.color }}
                                    title={pc.label}
                                >
                                    {selectedColor === pc.color && <div className="w-2 h-2 rounded-full bg-white shadow-xl"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-36 md:h-48 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none transition-all text-base md:text-lg italic tracking-tight"
                            placeholder={t.modalPlaceholder || 'Type your secret here...'}
                            autoFocus
                        />
                        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 text-[10px] font-mono text-white/20">
                            {text.length} chars
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 md:gap-4">
                        <button
                            type="button"
                            onClick={cancelAddingSecret}
                            className="flex-1 py-3 md:py-4 px-4 md:px-6 rounded-2xl bg-black/40 border border-white/5 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all uppercase text-[10px] font-bold tracking-widest"
                        >
                            {t.cancel || 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${starType === 'supernova'
                                ? 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'
                                : 'bg-white text-black hover:bg-white/90 active:scale-95'
                                } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                            {starType === 'supernova' ? (t.sendPremium || 'Launch Supernova') : (t.send || 'Send to Space')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
