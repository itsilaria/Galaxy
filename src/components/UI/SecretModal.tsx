'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import React, { useEffect, useState, useRef } from 'react';

export default function SecretModal() {
    const { selectedSecret, isModalOpen, closeModal } = useGalaxyStore();
    const [isVisible, setIsVisible] = useState(false);

    const openTime = useRef<number>(0);

    useEffect(() => {
        if (isModalOpen) {
            openTime.current = Date.now();
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);

    if (!isVisible && !isModalOpen) return null;

    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Prevent accidental closing on mobile immediately after opening
        if (Date.now() - openTime.current < 400) return;
        closeModal();
    };

    const isSupernova = selectedSecret?.starType === 'supernova';

    return (
        <div
            className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onPointerUp={(e) => e.stopPropagation()}
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleBackgroundClick}
            />

            <div className={`
                relative bg-black/95 border p-6 md:p-10 rounded-[2.5rem] max-w-[90vw] md:max-w-lg w-full 
                max-h-[80vh] flex flex-col
                shadow-[0_0_80px_rgba(0,0,0,0.5)] transform transition-all duration-500
                ${isSupernova ? 'border-yellow-500/50' : 'border-white/10'}
                ${isModalOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}
            `}>
                {isSupernova && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse" />
                )}

                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
                >
                    ✕
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-4">
                    <h3 className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-4 md:mb-6 ${isSupernova ? 'text-yellow-500' : 'text-white/30'}`}>
                        {isSupernova ? '✨ Supernova Transmission' : 'Incoming Transmission'}
                    </h3>

                    <p className={`text-lg md:text-3xl font-medium leading-tight italic break-words ${isSupernova ? 'text-white' : 'text-white/80'}`}>
                        "{selectedSecret?.text}"
                    </p>

                    <div className="mt-8 md:mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        <span>Origin: {selectedSecret?.country}</span>
                        <span>{new Date(selectedSecret?.timestamp || 0).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
