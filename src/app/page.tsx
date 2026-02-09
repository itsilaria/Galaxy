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

  useEffect(() => {
    fetchSecrets();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const secretId = params.get("secret");
      if (secretId) findMySecret(secretId);
    }
  }, [fetchSecrets, findMySecret]);

  return (
    <div className="h-screen w-screen bg-black relative">
      <Scene />
      <SecretModal />

      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Scrivi un nuovo segreto"
          className="px-2 py-1 rounded"
          value={newSecret}
          onChange={(e) => setNewSecret(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
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
          className="px-2 py-1 rounded mt-2"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded"
          onClick={() => {
            if (searchId.trim() !== "") findMySecret(searchId);
          }}
        >
          Ritrova Segreto
        </button>
      </div>
    </div>
  );
};

export default Page;
