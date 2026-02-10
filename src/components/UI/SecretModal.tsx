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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isModalOpen || !selectedSecret) {
      setTranslatedText("");
      setCopied(false);
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

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          {t.modalTitle}
        </div>

        <p className="text-white text-lg md:text-xl italic tracking-tight leading-relaxed mb-2">
          {isTranslating ? (
            <span className="text-white/40 animate-pulse">{"..."}</span>
          ) : (
            translatedText || selectedSecret.text
          )}
        </p>

        {!isTranslating &&
          translatedText &&
          translatedText !== selectedSecret.text && (
            <p className="text-white/20 text-xs italic mb-4">
              {selectedSecret.text}
            </p>
          )}

        {selectedSecret.isMock && (
          <div className="text-[10px] text-white/15 uppercase tracking-widest mb-4">
            Sample secret
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs uppercase tracking-widest font-bold active:scale-95"
            onClick={closeModal}
          >
            {t.close}
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
              copied
                ? "bg-green-500 text-black"
                : "bg-white text-black hover:bg-white/90"
            }`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : t.copyLink}
          </button>
        </div>
      </div>
    </div>
  );
};
