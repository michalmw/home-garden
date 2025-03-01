"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plant } from "@/types/Plant";
import { toast } from "react-toastify";
import { plantService } from "@/services/plantService";
import Image from "next/image";

export default function EditPlantPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  // Plant data state
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [wateringInterval, setWateringInterval] = useState(7);
  const [mistingInterval, setMistingInterval] = useState(3);
  const [notes, setNotes] = useState("");
  const [originalImage, setOriginalImage] = useState<string | undefined>(
    undefined
  );

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

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

          // Handle existing image
          if (plant.image) {
            setOriginalImage(plant.image);
            setImagePreview(plant.image);
          }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
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
    setImageChanged(true);
  };

  const resetImage = () => {
    if (originalImage) {
      setImagePreview(originalImage);
      setImageFile(null);
      setImageChanged(false);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setOriginalImage(undefined);
    setImageChanged(true);
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
      // Only process the image if it was changed
      let imageBase64 = originalImage;

      if (imageChanged) {
        if (imageFile) {
          imageBase64 = await convertImageToBase64();
        } else {
          imageBase64 = undefined; // User removed the image
        }
      }

      // Create updated plant object
      const updatedPlant: Plant = {
        id,
        name,
        species: species || undefined,
        image: imageBase64,
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
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Zdjęcie rośliny
            </label>

            <div className="mb-2">
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
            </div>

            {imagePreview ? (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Zdjęcie:</p>
                <div className="relative h-40 w-full">
                  <Image
                    src={imagePreview}
                    alt="Zdjęcie rośliny"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  {imageChanged && originalImage && (
                    <button
                      type="button"
                      onClick={resetImage}
                      className="text-xs text-blue-500"
                    >
                      Przywróć oryginalne
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-500"
                  >
                    Usuń zdjęcie
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Brak zdjęcia</p>
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
