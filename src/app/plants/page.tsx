"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plant } from "@/types/Plant";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";
import { plantService } from "@/services/plantService";
import { toast } from "react-toastify";
import DebugData from "@/components/DebugData";
import Image from "next/image";

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const plantsData = await plantService.getPlants();
        console.log("Plants loaded:", plantsData); // Debug
        setPlants(plantsData);
      } catch (error) {
        console.error("Error loading plants:", error);
        toast.error("Nie udało się załadować roślin");
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, []);

  const getNextWateringDate = (plant: Plant) => {
    const lastWatered = new Date(plant.lastWatered);
    return addDays(lastWatered, plant.wateringInterval);
  };

  const getNextMistingDate = (plant: Plant) => {
    const lastMisted = new Date(plant.lastMisted);
    return addDays(lastMisted, plant.mistingInterval);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Moje rośliny</h1>
      </header>

      {/* Debug component to check plant data */}
      <DebugData data={plants} title="Available Plants" />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="animate-pulse bg-white rounded-xl p-4 shadow-card"
            >
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-card p-6">
          <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1-18 0Z"
              />
            </svg>
          </div>
          <p className="text-xl text-gray-700 mb-4">
            Nie masz jeszcze żadnych roślin
          </p>
          <p className="text-gray-500 mb-6">
            Dodaj swoją pierwszą roślinę, aby rozpocząć
          </p>
          <Link href="/plants/add" className="btn-primary inline-block">
            Dodaj pierwszą roślinę
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plants.map((plant) => (
            <Link key={plant.id} href={`/plants/${plant.id}`} className="block">
              <div className="bg-white rounded-xl p-5 shadow-card flex justify-between items-center hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 flex-1">
                  {plant.image ? (
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={plant.image}
                        alt={plant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {plant.name}
                    </h2>
                    {plant.species && (
                      <p className="text-gray-600 text-sm mb-2">
                        {plant.species}
                      </p>
                    )}

                    <div className="flex space-x-4 mt-2">
                      <div className="flex items-center text-secondary">
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
                            d="M12 3v4m0 0a4 4 0 0 1-4 4H8a8 8 0 0 1-8-8v12a8 8 0 0 0 8 8h8a8 8 0 0 0 8-8V7.57c0-1.1-.9-2-2-2h0A4 4 0 0 1 12 7Z"
                          />
                        </svg>
                        <span className="text-xs">
                          {format(getNextWateringDate(plant), "d MMM", {
                            locale: pl,
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-primary">
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
                            d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 011.927-.184"
                          />
                        </svg>
                        <span className="text-xs">
                          {format(getNextMistingDate(plant), "d MMM", {
                            locale: pl,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
