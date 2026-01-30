'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const { progress, active } = useProgress();
    const [isFinished, setIsFinished] = useState(false);
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        // Failsafe: if loading takes too long or doesn't start, continue anyway after 5s
        const failsafe = setTimeout(() => {
            setIsEntering(false);
            setTimeout(() => setIsFinished(true), 1000);
        }, 5000);

        if (progress === 100) {
            clearTimeout(failsafe);
            setIsEntering(false);
            const timer = setTimeout(() => setIsFinished(true), 1000);
            return () => clearTimeout(timer);
        }

        return () => clearTimeout(failsafe);
    }, [progress]);

    if (isFinished) return null;

    // Display 100% even if it's 0 but not active (no assets loading)
    const displayProgress = !active && progress === 0 ? 100 : progress;

    return (
        <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${!isEntering ? 'opacity-0' : 'opacity-100'}`}>
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
                        style={{ width: `${displayProgress}%` }}
                    />
                </div>

                <div className="text-white/60 font-mono text-[10px] tabular-nums">
                    {Math.round(displayProgress)}%
                </div>
            </div>
        </div>
    );
}
