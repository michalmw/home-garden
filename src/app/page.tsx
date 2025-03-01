"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "react-toastify";
import { plantService } from "@/services/plantService";
import { addDays, isSameDay } from "date-fns";
import { Plant } from "@/types/Plant";
import { DropIcon, LeafIcon, CalendarIcon } from "@/components/Icons";
// Removed TailwindTest import

export default function Home() {
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plants = await plantService.getPlants();
        setPlants(plants);
        const today = new Date();

        const tasks = plants.flatMap((plant: Plant) => {
          const tasks = [];

          const lastWatered = new Date(plant.lastWatered);
          const wateringDue = addDays(lastWatered, plant.wateringInterval);

          const lastMisted = new Date(plant.lastMisted);
          const mistingDue = addDays(lastMisted, plant.mistingInterval);

          if (isSameDay(wateringDue, today)) {
            tasks.push({
              id: `water-${plant.id}`,
              plantId: plant.id,
              plantName: plant.name,
              type: "watering",
            });
          }

          if (isSameDay(mistingDue, today)) {
            tasks.push({
              id: `mist-${plant.id}`,
              plantId: plant.id,
              plantName: plant.name,
              type: "misting",
            });
          }

          return tasks;
        });

        setTodayTasks(tasks);

        // Show notification if there are tasks today
        if (tasks.length > 0) {
          toast.info(`Masz ${tasks.length} zadań do wykonania dzisiaj!`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Nie udało się załadować danych");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const completeTask = async (task: any) => {
    try {
      if (task.type === "watering") {
        await plantService.waterPlant(task.plantId);
      } else {
        await plantService.mistPlant(task.plantId);
      }

      setTodayTasks(todayTasks.filter((t) => t.id !== task.id));

      toast.success(
        `Roślina ${task.plantName} ${
          task.type === "watering" ? "podlana" : "zroszona"
        }!`
      );
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Nie udało się zaktualizować rośliny");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Removed TailwindTest component */}

      <header className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">PlantCare</h1>
        <p className="opacity-90">
          {format(new Date(), "EEEE, d MMMM", { locale: pl })}
        </p>
      </header>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Dzisiejsze zadania
        </h2>

        {loading ? (
          <div className="animate-pulse bg-white rounded-xl p-4 shadow-card">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : todayTasks.length > 0 ? (
          <ul className="space-y-3">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-4 bg-white rounded-xl shadow-card"
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center rounded-full w-10 h-10 mr-4 ${
                      task.type === "watering"
                        ? "bg-blue-100 text-secondary"
                        : "bg-green-100 text-primary"
                    }`}
                  >
                    {task.type === "watering" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v4m0 0a4 4 0 0 1-4 4H8a8 8 0 0 1-8-8v12a8 8 0 0 0 8 8h8a8 8 0 0 0 8-8V7.57c0-1.1-.9-2-2-2h0A4 4 0 0 1 12 7Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {task.plantName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {task.type === "watering" ? "Podlewanie" : "Zraszanie"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => completeTask(task)}
                  className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg shadow-button"
                >
                  Zrobione
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-card text-center">
            <p className="text-gray-500 mb-1">Dziś nic do zrobienia</p>
            <p className="text-sm text-gray-400">
              Twoje rośliny są szczęśliwe 🌱
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Szybki przegląd
        </h2>

        {plants.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-blue p-5 rounded-xl shadow-card text-center">
              <div className="bg-secondary/10 text-secondary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {plants.length}
              </h3>
              <p className="text-sm text-gray-500">Twoje rośliny</p>
            </div>

            <div className="bg-background p-5 rounded-xl shadow-card text-center">
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {todayTasks.length}
              </h3>
              <p className="text-sm text-gray-500">Dzisiejsze zadania</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-card text-center">
            <p className="text-gray-500">Nie masz jeszcze żadnych roślin</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl shadow-card">
        <h3 className="font-medium mb-2 text-gray-800">Wskazówka</h3>
        <p className="text-sm text-gray-600">
          Większość roślin doniczkowych preferuje podlewanie gdy górna warstwa
          gleby jest sucha. Sprawdź palcem przed podlaniem!
        </p>
      </div>
    </div>
  );
}
