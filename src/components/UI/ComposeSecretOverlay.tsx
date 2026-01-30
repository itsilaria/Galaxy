'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';
import { useState } from 'react';

export default function ComposeSecretOverlay() {
    const { isAddingSecret, cancelAddingSecret, addSecret, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations];
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            addSecret(text);
            setText('');
        }
    };

    if (!isAddingSecret) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">{t.modalTitle}</h2>
                <p className="text-center text-white/50 mb-4 text-sm">{t.composeSubtitle}</p>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 mb-6 group cursor-pointer hover:border-purple-400/50 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl animate-pulse">
                            🌟
                        </div>
                        <div>
                            <h4 className="text-white text-xs font-bold uppercase tracking-wider">{t.premiumTitle}</h4>
                            <p className="text-white/40 text-[10px]">{t.premiumDesc}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 resize-none transition-colors"
                        placeholder={t.modalPlaceholder}
                        autoFocus
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={cancelAddingSecret}
                            className="flex-1 py-3 px-6 rounded-lg bg-transparent border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="flex-1 py-3 px-6 rounded-lg bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t.send}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
