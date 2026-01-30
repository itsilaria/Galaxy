'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const { progress } = useProgress();
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (progress === 100) {
            const timer = setTimeout(() => setIsFinished(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (isFinished) return null;

    return (
        <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${progress === 100 ? 'opacity-0' : 'opacity-100'}`}>
            {/* Background sparkle effect (CSS only for loading) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="stars-loading"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 p-8 w-full max-w-sm">
                <div className="text-center">
                    <h2 className="text-white font-black text-2xl tracking-[0.2em] mb-2 uppercase animate-pulse">
                        GALAXY OF SECRETS
                    </h2>
                    <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">
                        Initializing Universe...
                    </p>
                </div>

                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className="absolute h-full bg-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="text-white/60 font-mono text-[10px] tabular-nums">
                    {Math.round(progress)}%
                </div>
            </div>

            <style jsx>{`
                .stars-loading {
                    width: 2px;
                    height: 2px;
                    background: transparent;
                    box-shadow: 24vw 35vh #fff, 67vw 21vh #fff, 12vw 88vh #fff, 88vw 34vh #fff, 45vw 12vh #fff, 33vw 67vh #fff, 78vw 90vh #fff, 10vw 45vh #fff;
                    animation: sparkle-anim 4s infinite linear;
                }
                @keyframes sparkle-anim {
                    0% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                    100% { opacity: 0.3; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
