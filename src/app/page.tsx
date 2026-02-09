import React, { useEffect } from "react";
import { Scene } from "../components/Scene";
import { SecretModal } from "../components/SecretModal";
import { useGalaxyStore } from "../components/useGalaxyStore";

const Page: React.FC = () => {
  const fetchSecrets = useGalaxyStore((state) => state.fetchSecrets);

  useEffect(() => {
    fetchSecrets(); // carica i segreti appena la pagina monta
  }, [fetchSecrets]);

  return (
    <div className="h-screen w-screen bg-black relative">
      {/* Canvas 3D */}
      <Scene />

      {/* Modale dei segreti */}
      <SecretModal />

      {/* Qui puoi aggiungere altri tasti UI sopra il canvas */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => alert("Tasto esempio funzionante!")}
        >
          Test tasto
        </button>
      </div>
    </div>
  );
};

export default Page;
