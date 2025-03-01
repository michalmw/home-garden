"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plant } from "@/types/Plant";
import { toast } from "react-toastify";
import { plantService } from "@/services/plantService";
import Image from "next/image";

export default function AddPlantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [wateringInterval, setWateringInterval] = useState(7);
  const [mistingInterval, setMistingInterval] = useState(3);
  const [notes, setNotes] = useState(""); // Add notes state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    // Check file size (limit to 8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Obraz jest za duży. Maksymalny rozmiar to 8MB.");
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const convertImageToBase64 = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  };

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
      // Convert image to base64 if exists
      const imageBase64 = await convertImageToBase64();

      // Create new plant object
      const newPlant: Plant = {
        id: Date.now().toString(),
        name,
        species: species || undefined,
        image: imageBase64,
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
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Zdjęcie rośliny
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4 file:rounded-md
                file:border-0 file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-secondary"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Max 8MB</p>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Podgląd:</p>
                <div className="relative h-40 w-full">
                  <Image
                    src={imagePreview}
                    alt="Podgląd zdjęcia"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="text-xs text-red-500 mt-2"
                >
                  Usuń zdjęcie
                </button>
              </div>
            )}
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
