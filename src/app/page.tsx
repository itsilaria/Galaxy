"use client";

import React, { useEffect, useState } from "react";
import { Scene } from "../components/Scene";
import { SecretModal } from "../components/SecretModal";
import { useGalaxyStore } from "../components/useGalaxyStore";

const Page: React.FC = () => {
  const fetchSecrets = useGalaxyStore((state) => state.fetchSecrets);
  const addSecret = useGalaxyStore((state) => state.addSecret);
  const findMySecret = useGalaxyStore((state) => state.findMySecret);

  const [newSecret, setNewSecret] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSecretId, setCurrentSecretId] = useState<string | null>(null);

  useEffect(() => {
    fetchSecrets();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const secretId = params.get("secret");
      if (secretId) {
        findMySecret(secretId);
        setIsModalOpen(true); // apri il modale se trovi il segreto
        setCurrentSecretId(secretId);
      }
    }
  }, [fetchSecrets, findMySecret]);

  // Funzione per aprire il modale
  const handleOpenModal = (secretId: string) => {
    findMySecret(secretId);
    setIsModalOpen(true);
    setCurrentSecretId(secretId);
  };

  // Funzione per chiudere il modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSecretId(null);
  };

  return (
    <div className="h-screen w-screen bg-black relative font-sans">
      <Scene />

      {/* Gestione del modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SecretModal secretId={currentSecretId!} onClose={handleCloseModal} />
        </div>
      )}

      {/* Pannello di input */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-3 bg-gray-900 p-4 rounded-lg shadow-lg max-w-sm w-full">
        <input
          type="text"
          placeholder="Scrivi un nuovo segreto"
          className="px-4 py-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={newSecret}
          onChange={(e) => setNewSecret(e.target.value)}
        />
        <button
          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition duration-200"
          onClick={() => {
            if (newSecret.trim() !== "") {
              addSecret(newSecret);
              setNewSecret("");
            }
          }}
        >
          Aggiungi Segreto
        </button>

        <input
          type="text"
          placeholder="ID segreto da ritrovare"
          className="px-4 py-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-2"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-lg transition duration-200"
          onClick={() => {
            if (searchId.trim() !== "") handleOpenModal(searchId);
          }}
        >
          Ritrova Segreto
        </button>
      </div>
    </div>
  );
};

export default Page;
