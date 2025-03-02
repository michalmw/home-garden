"use client";

import { useEffect } from "react";
import { LeafIcon } from "@/components/Icons";

export default function OfflinePage() {
  useEffect(() => {
    // Check if we're back online and reload if we are
    const handleOnline = () => {
      window.location.href = "/";
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 -mt-16">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <LeafIcon className="w-10 h-10 text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-2 text-center">Brak połączenia</h1>

      <p className="text-center text-gray-600 mb-6">
        Nie możesz połączyć się z PlantCare. Sprawdź swoje połączenie
        internetowe.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
