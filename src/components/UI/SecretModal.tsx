'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { useEffect, useState } from 'react';

export default function SecretModal() {
    const { selectedSecret, isModalOpen, closeModal } = useGalaxyStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);

    if (!isVisible && !isModalOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeModal}
            />

            <div className={`
        relative bg-black/80 border border-white/20 p-8 rounded-2xl max-w-lg w-full 
        shadow-[0_0_50px_rgba(255,255,255,0.1)] transform transition-all duration-300
        ${isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                    ✕
                </button>

                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                    Incoming Transmission
                </h3>

                <p className="text-xl md:text-2xl font-light text-white leading-relaxed italic">
                    "{selectedSecret?.text}"
                </p>

                <div className="mt-8 flex justify-between items-center text-xs text-white/30">
                    <span>ID: {selectedSecret?.id.split('-')[1]}</span>
                    <span>{new Date(selectedSecret?.timestamp || 0).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
