"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plant } from "@/types/Plant";
import { toast } from "react-toastify";
import { plantService } from "@/services/plantService";

export default function AddPlantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [wateringInterval, setWateringInterval] = useState(7);
  const [mistingInterval, setMistingInterval] = useState(3);
  const [notes, setNotes] = useState(""); // Add notes state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageName, setImageName] = useState("");

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
      // Create new plant object
      const newPlant: Plant = {
        id: Date.now().toString(),
        name,
        species: species || undefined,
        imageName: imageName || undefined,
        wateringInterval,
        mistingInterval,
        lastWatered: new Date().toISOString(),
        lastMisted: new Date().toISOString(),
        notes: notes || undefined,
      };

      await plantService.addPlant(newPlant);
      toast.success("Roślina dodana pomyślnie!");
      router.push("/plants");
    } catch (error) {
      console.error("Error adding plant:", error);
      toast.error("Wystąpił błąd podczas dodawania rośliny");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/plants" className="text-primary hover:underline">
            &larr; Powrót do roślin
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Dodaj nową roślinę</h1>

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

          {/* Add notes field after misting interval */}
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
            {isSubmitting ? "Dodawanie..." : "Dodaj roślinę"}
          </button>
        </form>
      </div>
    </main>
  );
}
