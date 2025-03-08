"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plant } from "@/types/Plant";
import { format, addDays, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "react-toastify";
import { plantService } from "@/services/plantService";
import DebugData from "@/components/DebugData";
import Image from "next/image";

export default function PlantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [canWater, setCanWater] = useState(true);
  const [canMist, setCanMist] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading plant with ID:", id);
        const foundPlant = await plantService.getPlant(id);

        if (foundPlant) {
          console.log("Plant found:", foundPlant);
          setPlant(foundPlant);

          // Check if plant can be watered/misted today
          const waterCheck = await plantService.canPerformAction(
            id,
            "watering"
          );
          const mistCheck = await plantService.canPerformAction(id, "misting");

          setCanWater(waterCheck);
          setCanMist(mistCheck);
        } else {
          console.error("Plant not found for ID:", id);
          setError("Plant not found");
          toast.error("Roślina nie została znaleziona");
        }
      } catch (error) {
        console.error("Error loading plant:", error);
        setError("Error loading plant");
        toast.error("Wystąpił błąd podczas ładowania rośliny");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleWatering = async () => {
    if (!plant || !canWater || isProcessing) return;

    setIsProcessing(true);

    try {
      const updatedPlant = await plantService.waterPlant(plant.id);
      setPlant(updatedPlant);
      setCanWater(false);
      toast.success("Podlewanie zapisane!");
    } catch (error) {
      console.error("Error watering plant:", error);
      if (
        error instanceof Error &&
        error.message === "Plant already watered today"
      ) {
        toast.info("Ta roślina była już dzisiaj podlana");
        setCanWater(false);
      } else {
        toast.error("Nie udało się zapisać podlewania");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMisting = async () => {
    if (!plant || !canMist || isProcessing) return;

    setIsProcessing(true);

    try {
      const updatedPlant = await plantService.mistPlant(plant.id);
      setPlant(updatedPlant);
      setCanMist(false);
      toast.success("Zraszanie zapisane!");
    } catch (error) {
      console.error("Error misting plant:", error);
      if (
        error instanceof Error &&
        error.message === "Plant already misted today"
      ) {
        toast.info("Ta roślina była już dzisiaj zraszana");
        setCanMist(false);
      } else {
        toast.error("Nie udało się zapisać zraszania");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Czy na pewno chcesz usunąć tę roślinę?")) {
      try {
        await plantService.deletePlant(id);
        toast.success("Roślina usunięta");
        router.push("/plants");
      } catch (error) {
        console.error("Error deleting plant:", error);
        toast.error("Nie udało się usunąć rośliny");
      }
    }
  };

  // Function to check if the last watered/misted date is today
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return isSameDay(date, today);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Add debugging section
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/plants" className="text-primary hover:underline">
              &larr; Powrót do roślin
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-card">
            <h1 className="text-xl font-bold text-red-500 mb-4">
              Błąd: {error}
            </h1>
            <p className="text-gray-500 mb-6">
              Nie można znaleźć rośliny o ID: {id}
            </p>

            <DebugData data={{ requestedId: id }} title="Requested Plant ID" />

            <div className="mt-6 text-center">
              <Link href="/plants/add" className="btn-primary">
                Dodaj nową roślinę
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Type guard to ensure plant is not null
  if (!plant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-card">
          <p className="text-gray-500">Roślina nie znaleziona</p>
        </div>
      </div>
    );
  }

  // Now plant is definitely not null, so TypeScript won't complain
  const nextWateringDate = addDays(
    new Date(plant.lastWatered),
    plant.wateringInterval
  );
  const nextMistingDate = addDays(
    new Date(plant.lastMisted),
    plant.mistingInterval
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Add debug data component */}
      <DebugData data={{ id, plant }} title="Plant Detail Data" />

      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/plants" className="text-primary hover:underline">
            &larr; Powrót do roślin
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          {/* Plant image */}
          {plant.imageName && (
            <div className="mb-6">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={`/flowers/${plant.imageName}.jpg`}
                  alt={plant.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2">{plant.name}</h1>
          {plant.species && (
            <p className="text-gray-600 mb-6">{plant.species}</p>
          )}

          <div className="space-y-6 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Podlewanie</h3>
              <p className="text-sm">Co {plant.wateringInterval} dni</p>
              <p className="text-sm">
                Ostatnie:{" "}
                {format(new Date(plant.lastWatered), "d MMMM yyyy", {
                  locale: pl,
                })}
                {isToday(plant.lastWatered) && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                    Dzisiaj
                  </span>
                )}
              </p>
              <p className="text-sm font-medium mt-1">
                Następne:{" "}
                {format(nextWateringDate, "d MMMM yyyy", { locale: pl })}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Zraszanie</h3>
              <p className="text-sm">Co {plant.mistingInterval} dni</p>
              <p className="text-sm">
                Ostatnie:{" "}
                {format(new Date(plant.lastMisted), "d MMMM yyyy", {
                  locale: pl,
                })}
                {isToday(plant.lastMisted) && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                    Dzisiaj
                  </span>
                )}
              </p>
              <p className="text-sm font-medium mt-1">
                Następne:{" "}
                {format(nextMistingDate, "d MMMM yyyy", { locale: pl })}
              </p>
            </div>

            {plant.notes && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Notatki</h3>
                <p className="text-sm text-gray-700">{plant.notes}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleWatering}
              className={`py-2 px-4 rounded-lg text-white text-center transition-colors ${
                canWater
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!canWater || isProcessing}
            >
              {isProcessing ? (
                <span className="inline-block animate-pulse">
                  Zapisywanie...
                </span>
              ) : canWater ? (
                "Podlano dzisiaj"
              ) : (
                "Już podlano"
              )}
            </button>

            <button
              onClick={handleMisting}
              className={`py-2 px-4 rounded-lg text-white text-center transition-colors ${
                canMist
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!canMist || isProcessing}
            >
              {isProcessing ? (
                <span className="inline-block animate-pulse">
                  Zapisywanie...
                </span>
              ) : canMist ? (
                "Zroszono dzisiaj"
              ) : (
                "Już zroszono"
              )}
            </button>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between items-center">
            <button
              onClick={handleDelete}
              className="text-red-500 hover:underline"
            >
              Usuń roślinę
            </button>

            <Link
              href={`/plants/${id}/edit`}
              className="text-primary hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edytuj roślinę
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
