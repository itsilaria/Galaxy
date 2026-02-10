"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { SecretModal } from "@/components/UI/SecretModal";
import WelcomeScreen from "@/components/UI/WelcomeScreen";
import LoadingScreen from "@/components/UI/LoadingScreen";
import BackgroundAudio from "@/components/UI/BackgroundAudio";
import LanguageSelector from "@/components/UI/LanguageSelector";
import RandomJumpButton from "@/components/UI/RandomJumpButton";
import VisitorCounter from "@/components/UI/VisitorCounter";
import SupportButton from "@/components/UI/SupportButton";
import ComposeSecretOverlay from "@/components/UI/ComposeSecretOverlay";
import { translations } from "@/utils/translations";

const Scene = dynamic(
  () => import("@/components/Scene").then((mod) => ({ default: mod.Scene })),
  { ssr: false }
);

export default function Page() {
  const findMySecret = useGalaxyStore((state) => state.findMySecret);
  const isStarted = useGalaxyStore((state) => state.isStarted);
  const startAddingSecret = useGalaxyStore((state) => state.startAddingSecret);
  const currentLanguage = useGalaxyStore((state) => state.currentLanguage);
  const secrets = useGalaxyStore((state) => state.secrets);
  const t = translations[currentLanguage as keyof typeof translations] as Record<string, string>;

  // Deep-link: open a specific secret if ?secret=ID is in the URL
  useEffect(() => {
    if (typeof window !== "undefined" && secrets.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const secretId = params.get("secret");
      if (secretId) findMySecret(secretId);
    }
  }, [findMySecret, secrets]);

  return (
    <main className="h-dvh w-screen bg-black relative overflow-hidden">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Welcome Screen */}
      <WelcomeScreen />

      {/* 3D Galaxy Canvas */}
      <Scene />

      {/* Secret Modal */}
      <SecretModal />

      {/* Compose Secret Overlay */}
      <ComposeSecretOverlay />

      {/* UI Overlay - only show when galaxy is started */}
      {isStarted && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {/* Top bar */}
          <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex items-start justify-between pointer-events-none">
            {/* Title */}
            <div className="pointer-events-none">
              <h1 className="text-white font-black text-lg md:text-2xl tracking-tighter italic">
                {t.title}
              </h1>
              <p className="text-white/30 text-[8px] md:text-[10px] uppercase tracking-[0.3em]">
                {t.subtitle}
              </p>
            </div>

            {/* Confess button */}
            <button
              onClick={startAddingSecret}
              className="pointer-events-auto bg-white text-black font-bold py-2.5 px-5 md:py-3 md:px-8 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {t.button}
            </button>
          </div>

          {/* Support Button */}
          <SupportButton />

          {/* Random Jump */}
          {secrets.length > 0 && <RandomJumpButton />}

          {/* Background Audio */}
          <BackgroundAudio />

          {/* Visitor Counter */}
          <VisitorCounter />

          {/* Language Selector */}
          <LanguageSelector />
        </div>
      )}
    </main>
  );
}
