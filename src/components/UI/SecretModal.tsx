'use client';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import React, { useEffect, useState, useRef, useCallback } from 'react';

export default function SecretModal() {
    const { selectedSecret, isModalOpen, closeModal } = useGalaxyStore();
    const [isVisible, setIsVisible] = useState(false);
    const openTime = useRef<number>(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isModalOpen) {
            openTime.current = Date.now();
            setIsVisible(true);
            // Prevent body scroll on mobile
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    const handleClose = useCallback(() => {
        // Prevent accidental closing on mobile immediately after opening
        if (Date.now() - openTime.current < 300) return;
        closeModal();
    }, [closeModal]);

    const handleBackgroundClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    const handleCloseButton = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        closeModal();
    }, [closeModal]);

    if (!isVisible && !isModalOpen) return null;

    return (
        <div
            ref={modalRef}
            className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleBackgroundClick}
            onTouchEnd={handleBackgroundClick}
            style={{ touchAction: 'none' }}
        >
            {/* Background overlay */}
            <div
                className={`absolute inset-0 bg-black/90 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Modal content */}
            <div 
                className={`
                    relative bg-gradient-to-b from-gray-900/95 to-black/95 
                    border border-white/10 p-6 md:p-10 rounded-2xl 
                    max-w-[92vw] md:max-w-lg w-full
                    max-h-[85vh] flex flex-col
                    shadow-2xl transform transition-all duration-300
                    ${isModalOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
                `}
                onClick={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleCloseButton}
                    onTouchEnd={handleCloseButton}
                    className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 active:bg-white/30 transition-all z-20 text-xl"
                    aria-label="Close"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Content */}
                <div className="flex-1 overflow-y-auto pr-2 pt-8 md:pt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6 text-white/40">
                        Incoming Transmission
                    </h3>
                    
                    <p className="text-xl md:text-2xl font-light leading-relaxed italic text-white/90 break-words">
                        "{selectedSecret?.text || ''}"
                    </p>

                    <div className="mt-8 md:mt-10 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[10px] md:text-xs text-white/30 uppercase tracking-wider">
                        <span>Language: {selectedSecret?.language?.toUpperCase() || 'EN'}</span>
                        <span>{selectedSecret?.timestamp ? new Date(selectedSecret.timestamp).toLocaleDateString() : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
