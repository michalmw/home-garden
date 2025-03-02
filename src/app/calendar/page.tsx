"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CalendarComponent from "@/components/CalendarComponent";
import {
  addDays,
  format,
  isSameDay,
  isAfter,
  isBefore,
  endOfDay,
} from "date-fns";
import { pl } from "date-fns/locale";
import { Plant } from "@/types/Plant";
import { plantService } from "@/services/plantService";
import { toast } from "react-toastify";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
  const [date, setDate] = useState<Value>(new Date());
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const plantsData = await plantService.getPlants();
        setPlants(plantsData);

        // Generate tasks for the next 30 days
        const generatedTasks = generateTasks(plantsData);
        setTasks(generatedTasks);

        // Set tasks for currently selected date
        if (date instanceof Date) {
          updateSelectedDateTasks(date, generatedTasks);
        }
      } catch (error) {
        console.error("Error loading plants:", error);
        toast.error("Nie udało się załadować roślin");
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, []);

  useEffect(() => {
    if (date instanceof Date) {
      updateSelectedDateTasks(date, tasks);
    }
  }, [date, tasks]);

  const generateTasks = (plants: Plant[]) => {
    const tasks = [];
    const today = new Date();
    const endDate = addDays(today, 30); // 30 days window

    for (const plant of plants) {
      // Generate all watering tasks within the next 30 days
      let lastWatered = new Date(plant.lastWatered);
      let nextWatering = new Date(lastWatered);

      // Find the first watering date on or after today
      while (isBefore(nextWatering, today)) {
        nextWatering = addDays(nextWatering, plant.wateringInterval);
      }

      // Add all watering tasks within our window
      while (isBefore(nextWatering, endDate)) {
        tasks.push({
          date: format(nextWatering, "yyyy-MM-dd"),
          plantId: plant.id,
          plantName: plant.name,
          type: "watering",
        });
        nextWatering = addDays(nextWatering, plant.wateringInterval);
      }

      // Generate all misting tasks within the next 30 days
      let lastMisted = new Date(plant.lastMisted);
      let nextMisting = new Date(lastMisted);

      // Find the first misting date on or after today
      while (isBefore(nextMisting, today)) {
        nextMisting = addDays(nextMisting, plant.mistingInterval);
      }

      // Add all misting tasks within our window
      while (isBefore(nextMisting, endDate)) {
        tasks.push({
          date: format(nextMisting, "yyyy-MM-dd"),
          plantId: plant.id,
          plantName: plant.name,
          type: "misting",
        });
        nextMisting = addDays(nextMisting, plant.mistingInterval);
      }
    }

    return tasks;
  };

  const updateSelectedDateTasks = (selectedDate: Date, allTasks: any[]) => {
    const tasksForDate = allTasks.filter((task) =>
      isSameDay(new Date(task.date), selectedDate)
    );

    setSelectedDateTasks(tasksForDate);
  };

  const handleDateChange = (newDate: Value) => {
    setDate(newDate);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    // Only add content to day tiles
    if (view !== "month") return null;

    const tasksForDay = tasks.filter((task) =>
      isSameDay(new Date(task.date), date)
    );

    if (tasksForDay.length === 0) return null;

    // Count watering and misting tasks
    const wateringTasks = tasksForDay.filter(
      (task) => task.type === "watering"
    ).length;
    const mistingTasks = tasksForDay.filter(
      (task) => task.type === "misting"
    ).length;

    return (
      <div className="flex justify-center items-center space-x-1 mt-1">
        {wateringTasks > 0 && (
          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
        )}
        {mistingTasks > 0 && (
          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Ładowanie kalendarza...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary hover:underline">
          &larr; Powrót
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">
        Kalendarz pielęgnacji
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="calendar-container">
            <CalendarComponent
              value={date}
              onChange={handleDateChange}
              tileContent={tileContent}
            />
            <div className="mt-4 flex justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
                <span>Podlewanie</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                <span>Zraszanie</span>
              </div>
            </div>
            <style jsx global>{`
              .react-calendar {
                width: 100%;
                border: none;
              }
              .react-calendar__tile--active {
                background: #4ade80;
                color: white;
              }
              .react-calendar__tile--active:enabled:hover,
              .react-calendar__tile--active:enabled:focus {
                background: #22c55e;
              }
            `}</style>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-4 text-lg">
              {date instanceof Date &&
                format(date, "d MMMM yyyy", { locale: pl })}
            </h2>

            {selectedDateTasks.length > 0 ? (
              <ul className="space-y-2">
                {selectedDateTasks.map((task, index) => (
                  <li
                    key={index}
                    className="p-3 border border-gray-100 rounded-md"
                  >
                    <span className="font-medium">{task.plantName}</span>
                    <p className="text-sm text-gray-600">
                      {task.type === "watering"
                        ? "💧 Podlewanie"
                        : "💨 Zraszanie"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Brak zadań na wybrany dzień
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
