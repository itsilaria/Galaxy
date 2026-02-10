"use client";

import React, { useEffect, useState } from "react";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { translations } from "@/utils/translations";

export const SecretModal: React.FC = () => {
  const { selectedSecret, isModalOpen, closeModal, currentLanguage } =
    useGalaxyStore();
  const t = translations[
    currentLanguage as keyof typeof translations
  ] as Record<string, string>;

  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Translate the secret text whenever the modal opens or the language changes
  useEffect(() => {
    if (!isModalOpen || !selectedSecret) {
      setTranslatedText("");
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: selectedSecret.text,
        targetLang: currentLanguage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setTranslatedText(data.translated || selectedSecret.text);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTranslatedText(selectedSecret.text);
        }
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isModalOpen, selectedSecret, currentLanguage]);

  if (!isModalOpen || !selectedSecret) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?secret=${selectedSecret.id}`
      : "";

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in"
      onClick={closeModal}
    >
      <div
        className="bg-black/90 border border-white/10 p-6 md:p-8 rounded-2xl max-w-md w-full relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">
          {t.modalTitle || "Incoming Transmission"}
        </div>

        <p className="text-white text-lg italic tracking-tight leading-relaxed mb-2">
          {isTranslating ? (
            <span className="text-white/40 animate-pulse">{"..."}</span>
          ) : (
            translatedText || selectedSecret.text
          )}
        </p>

        {/* Show original text if it differs from the translated version */}
        {!isTranslating &&
          translatedText &&
          translatedText !== selectedSecret.text && (
            <p className="text-white/25 text-xs italic mb-4">
              {selectedSecret.text}
            </p>
          )}

        {selectedSecret.isMock && (
          <div className="text-[10px] text-white/20 uppercase tracking-widest mb-4">
            Sample secret
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs uppercase tracking-widest font-bold"
            onClick={closeModal}
          >
            {t.cancel || "Close"}
          </button>
          <button
            className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all"
            onClick={() => {
              if (typeof navigator !== "undefined")
                navigator.clipboard.writeText(shareUrl);
            }}
          >
            {t.copyLink || "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};
