'use client';

import { useState, useEffect, memo } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { translations } from '@/utils/translations';

const VisitorCounter = memo(() => {
    const { visitorCount, currentLanguage } = useGalaxyStore();
    const t = translations[currentLanguage as keyof typeof translations] as Record<string, string>;
    const [liveVisitors, setLiveVisitors] = useState(visitorCount);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveVisitors(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden md:flex items-center gap-2 text-white/40 font-mono text-[10px] md:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {liveVisitors.toLocaleString()} {t.online}
        </div>
    );
});

VisitorCounter.displayName = 'VisitorCounter';

export default VisitorCounter;
