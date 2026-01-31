'use client';

import { useState, useEffect, memo } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

const VisitorCounter = memo(() => {
    const { visitorCount, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations];
    const [liveVisitors, setLiveVisitors] = useState(visitorCount);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveVisitors(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0));
        }, 5000); // Slower updates for stability
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white/40 font-mono text-[10px] md:text-xs flex items-center gap-2 pointer-events-none z-10 transition-opacity duration-1000">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {liveVisitors.toLocaleString()} {t.online}
        </div>
    );
});

VisitorCounter.displayName = 'VisitorCounter';

export default VisitorCounter;
