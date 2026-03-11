'use client';
import dynamic from 'next/dynamic';
import SecretModal from "@/components/UI/SecretModal";
import ComposeSecretOverlay from "@/components/UI/ComposeSecretOverlay";
import LanguageSelector from "@/components/UI/LanguageSelector";
import RandomJumpButton from "@/components/UI/RandomJumpButton";
import SupportButton from "@/components/UI/SupportButton";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { translations } from "@/utils/translations";
import WelcomeScreen from "@/components/UI/WelcomeScreen";
import BackgroundAudio from "@/components/UI/BackgroundAudio";
import VisitorCounter from "@/components/UI/VisitorCounter";
import { useState, useEffect } from "react";

// Dynamic import for Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
const MobileStarField = dynamic(() => import("@/components/MobileStarField"), { ssr: false });

export default function Home() {
    const { startAddingSecret, currentLanguage, isStarted, fetchSecrets } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations] || translations.en;
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Fetch secrets on mount
        fetchSecrets();
        
        return () => window.removeEventListener('resize', checkMobile);
    }, [fetchSecrets]);
    
    if (!mounted) {
        return (
            <main className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="text-white/50 text-sm">Loading...</div>
            </main>
        );
    }
    
    return (
        <main className="w-screen h-screen bg-black overflow-hidden relative font-sans">
            {/* Background layer - z-0 */}
            <div className="absolute inset-0 z-0">
                {!isMobile ? <Scene /> : <MobileStarField />}
            </div>
            
            {/* Welcome Screen - z-50 */}
            <WelcomeScreen />
            <BackgroundAudio />
            
            {isStarted && (
                <>
                    {/* Modals - highest z-index */}
                    <SecretModal />
                    <ComposeSecretOverlay />
                    
                    {/* UI Controls - z-20 */}
                    <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            {/* Title Section */}
                            <div className="bg-black/30 backdrop-blur-sm p-3 md:p-0 md:bg-transparent md:backdrop-blur-none rounded-lg">
                                <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-200 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none">
                                    {t.title}
                                </h1>
                                <p className="text-white/60 text-[10px] md:text-base mt-1 md:mt-2 max-w-[200px] md:max-w-md leading-relaxed">
                                    {t.subtitle}
                                </p>
                            </div>
                            
                            {/* Add Secret Button */}
                            <button
                                onClick={() => startAddingSecret()}
                                className="bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95 backdrop-blur-xl text-white px-6 md:px-8 py-3 md:py-3 rounded-full border border-white/20 transition-all text-sm md:text-base font-medium shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer select-none"
                            >
                                {t.button}
                            </button>
                        </div>
                    </div>
                    
                    {/* Other UI Components - z-20 */}
                    <div className="absolute z-20">
                        <LanguageSelector />
                        <RandomJumpButton />
                        <SupportButton />
                        <VisitorCounter />
                    </div>
                    
                    {/* Footer - z-10 */}
                    <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-10 text-white/10 text-[8px] md:text-xs tracking-widest uppercase pointer-events-none">
                        {t.footer}
                    </div>
                </>
            )}
        </main>
    );
}
