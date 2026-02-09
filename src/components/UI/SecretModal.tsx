import React from "react";
import { useGalaxyStore } from "./useGalaxyStore";

export const SecretModal: React.FC = () => {
  const { selectedSecret, isModalOpen, closeModal } = useGalaxyStore();

  if (!isModalOpen || !selectedSecret) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-800">{selectedSecret.text}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={closeModal}
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};
