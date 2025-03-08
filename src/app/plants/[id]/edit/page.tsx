"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plant } from "@/types/Plant";
import { toast } from "react-toastify";
import { plantService } from "@/services/plantService";

export default function EditPlantPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  // Plant data state
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [wateringInterval, setWateringInterval] = useState(7);
  const [mistingInterval, setMistingInterval] = useState(3);
  const [notes, setNotes] = useState("");
  const [imageName, setImageName] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current plant data
  useEffect(() => {
    const loadPlant = async () => {
      try {
        const plant = await plantService.getPlant(id);

        if (plant) {
          // Populate form with existing data
          setName(plant.name);
          setSpecies(plant.species || "");
          setWateringInterval(plant.wateringInterval);
          setMistingInterval(plant.mistingInterval);
          setNotes(plant.notes || "");
          setImageName(plant.imageName || "");
        } else {
          toast.error("Nie znaleziono rośliny");
          router.push("/plants");
        }
      } catch (error) {
        console.error("Error loading plant:", error);
        toast.error("Nie udało się załadować danych rośliny");
        router.push("/plants");
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Nazwa rośliny jest wymagana");
      return;
    }

    if (wateringInterval < 1 || mistingInterval < 1) {
      toast.error("Interwały muszą być większe niż 0");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create updated plant object
      const updatedPlant: Plant = {
        id,
        name,
        species: species || undefined,
        imageName: imageName || undefined,
        wateringInterval,
        mistingInterval,
        // Keep the original watering/misting timestamps
        lastWatered:
          (await plantService.getPlant(id))?.lastWatered ||
          new Date().toISOString(),
        lastMisted:
          (await plantService.getPlant(id))?.lastMisted ||
          new Date().toISOString(),
        notes: notes || undefined,
      };

      await plantService.updatePlant(updatedPlant);
      toast.success("Roślina zaktualizowana!");
      router.push(`/plants/${id}`);
    } catch (error) {
      console.error("Error updating plant:", error);
      toast.error("Wystąpił błąd podczas aktualizacji rośliny");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link href={`/plants/${id}`} className="text-primary hover:underline">
            &larr; Wróć do szczegółów rośliny
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Edytuj roślinę</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nazwa rośliny *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="species" className="block text-sm font-medium mb-1">
              Gatunek
            </label>
            <input
              type="text"
              id="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="input-field"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="imageName" className="block text-sm font-medium mb-1">
              Nazwa pliku zdjęcia
            </label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              className="input-field"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="wateringInterval"
              className="block text-sm font-medium mb-1"
            >
              Co ile dni podlewać? *
            </label>
            <input
              type="number"
              id="wateringInterval"
              value={wateringInterval}
              min={1}
              onChange={(e) => setWateringInterval(parseInt(e.target.value))}
              className="input-field"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="mistingInterval"
              className="block text-sm font-medium mb-1"
            >
              Co ile dni zraszać? *
            </label>
            <input
              type="number"
              id="mistingInterval"
              value={mistingInterval}
              min={1}
              onChange={(e) => setMistingInterval(parseInt(e.target.value))}
              className="input-field"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Notatki
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field h-24"
              placeholder="Dodatkowe informacje o roślinie..."
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </form>
      </div>
    </main>
  );
}
