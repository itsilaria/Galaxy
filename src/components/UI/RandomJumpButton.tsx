'use client';

import { useGalaxyStore } from '@/store/useGalaxyStore';
import { useState } from 'react';

export default function RandomJumpButton() {
    const { secrets, selectSecret } = useGalaxyStore();
    const [isJumping, setIsJumping] = useState(false);

    const handleJump = () => {
        setIsJumping(true);
        // Pick random secret
        const random = secrets[Math.floor(Math.random() * secrets.length)];
        selectSecret(random);

        // Reset jumping state animation after delay
        setTimeout(() => setIsJumping(false), 1000);
    };

    return (
        <button
            onClick={handleJump}
            className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-30
            bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20
            text-white font-bold py-3 px-8 rounded-full transition-all duration-300
            flex items-center gap-2 group
            ${isJumping ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}
            hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
        `}
        >
            <span className="text-lg group-hover:rotate-12 transition-transform">🎲</span>
            <span className="tracking-widest text-xs uppercase">Random Jump</span>
        </button>
    );
}
