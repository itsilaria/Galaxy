'use client';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { useEffect, useState } from 'react';

export default function MobileStarField() {
  const secrets = useGalaxyStore(s => s.secrets);
  const selectSecret = useGalaxyStore(s => s.selectSecret);
  const [visibleSecrets, setVisibleSecrets] = useState<typeof secrets>([]);

  useEffect(() => {
    // Mostra solo 50 stelle su mobile per performance
    setVisibleSecrets(secrets.slice(0, 50));
  }, [secrets]);

  const handleStarClick = (secret: typeof secrets[0]) => {
    selectSecret(secret);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Background stars (decorative) */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`bg-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive secret stars */}
      {visibleSecrets.map((secret, i) => (
        <button
          key={secret.id}
          onClick={() => handleStarClick(secret)}
          className="absolute w-8 h-8 flex items-center justify-center group"
          style={{
            left: `${20 + (i % 8) * 10}%`,
            top: `${20 + Math.floor(i / 8) * 12}%`,
          }}
        >
          <div 
            className="w-4 h-4 rounded-full transition-all group-active:scale-150"
            style={{
              backgroundColor: secret.color,
              boxShadow: `0 0 20px ${secret.color}`,
            }}
          />
        </button>
      ))}
    </div>
  );
}
