"use client";

import { useState } from "react";
import { migrateDataToKV } from "@/lib/storage";

export default function MigrationPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMigration = async () => {
    setLoading(true);
    setStatus("Migracja w toku...");

    try {
      await migrateDataToKV();
      setStatus("Migracja zakończona pomyślnie!");
    } catch (error: unknown) {
      console.error("Migration error:", error);
      // Fix the error by properly type checking
      if (error instanceof Error) {
        setStatus(`Błąd migracji: ${error.message}`);
      } else {
        setStatus(`Błąd migracji: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Migracja danych do Vercel KV</h1>

      <button
        onClick={handleMigration}
        disabled={loading}
        className="bg-primary text-white py-2 px-4 rounded disabled:bg-gray-400"
      >
        {loading ? "Migracja w toku..." : "Rozpocznij migrację"}
      </button>

      {status && (
        <div className="mt-4 p-4 border rounded">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
