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

  useEffect(() => {
    if (typeof window !== "undefined" && secrets.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const secretId = params.get("secret");
      if (secretId) findMySecret(secretId);
    }
  }, [findMySecret, secrets]);

  return (
    <main className="h-dvh w-screen bg-black relative overflow-hidden">
      <LoadingScreen />
      <WelcomeScreen />

      {/* 3D Galaxy Canvas */}
      <Scene />

      {/* Modals render on their own z-layers */}
      <SecretModal />
      <ComposeSecretOverlay />

      {/* UI Overlay */}
      {isStarted && (
        <>
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between p-4 md:p-8 pointer-events-none">
            <div>
              <h1 className="text-white font-black text-base md:text-2xl tracking-tighter italic text-balance">
                {t.title}
              </h1>
              <p className="text-white/30 text-[8px] md:text-[10px] uppercase tracking-[0.3em]">
                {t.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto shrink-0">
              <SupportButton />
              <button
                onClick={startAddingSecret}
                className="bg-white text-black font-bold py-2 px-4 md:py-3 md:px-8 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {t.button}
              </button>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-50 p-4 md:p-8 flex items-end justify-between pointer-events-none">
            {/* Left: visitor counter + audio */}
            <div className="flex items-center gap-3 pointer-events-auto">
              <BackgroundAudio />
              <VisitorCounter />
            </div>

            {/* Center: random jump */}
            {secrets.length > 0 && (
              <div className="pointer-events-auto">
                <RandomJumpButton />
              </div>
            )}

            {/* Right: language selector */}
            <div className="pointer-events-auto">
              <LanguageSelector />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
