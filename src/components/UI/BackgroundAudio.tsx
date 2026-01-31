'use client';

import { useEffect, useRef, useState } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';

export default function BackgroundAudio() {
    const [isMuted, setIsMuted] = useState(true);
    const audioContext = useRef<AudioContext | null>(null);
    const oscillators = useRef<OscillatorNode[]>([]);
    const gainNode = useRef<GainNode | null>(null);

    const startAudio = () => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            gainNode.current = audioContext.current.createGain();
            gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);
            gainNode.current.connect(audioContext.current.destination);

            // Create a deep drone with multiple oscillators
            const frequencies = [40, 60, 80, 120];
            frequencies.forEach((freq) => {
                const osc = audioContext.current!.createOscillator();
                const localGain = audioContext.current!.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioContext.current!.currentTime);

                localGain.gain.setValueAtTime(0.05, audioContext.current!.currentTime);

                // Add some LFO for movement
                const lfo = audioContext.current!.createOscillator();
                const lfoGain = audioContext.current!.createGain();
                lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.1, audioContext.current!.currentTime);
                lfoGain.gain.setValueAtTime(2, audioContext.current!.currentTime);
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();

                osc.connect(localGain);
                localGain.connect(gainNode.current!);
                osc.start();
                oscillators.current.push(osc);
            });
        }

        if (audioContext.current.state === 'suspended') {
            audioContext.current.resume();
        }

        const targetGain = isMuted ? 0.3 : 0;
        gainNode.current!.gain.exponentialRampToValueAtTime(targetGain + 0.001, audioContext.current.currentTime + 2);
        setIsMuted(!isMuted);
    };

    return (
        <button
            onClick={startAudio}
            className="fixed bottom-8 left-8 z-[200] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
            title={isMuted ? "Enable Sound" : "Mute Sound"}
        >
            {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
            )}
        </button>
    );
}
