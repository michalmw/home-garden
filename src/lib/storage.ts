import { kv } from "@vercel/kv";
import { Plant } from "@/types/Plant";
import { PlantAction } from "@/types/Action";

export async function getPlants(): Promise<Plant[]> {
  try {
    // Pobierz rośliny z Vercel KV
    const plants = (await kv.get<Plant[]>("plants")) || [];
    return plants;
  } catch (error) {
    console.error("Error getting plants from KV:", error);
    return [];
  }
}

export async function savePlants(plants: Plant[]): Promise<void> {
  try {
    // Zapisz rośliny do Vercel KV
    await kv.set("plants", plants);
  } catch (error) {
    console.error("Error saving plants to KV:", error);
    throw error;
  }
}

export async function getActions(): Promise<PlantAction[]> {
  try {
    // Pobierz akcje z Vercel KV
    const actions = (await kv.get<PlantAction[]>("actions")) || [];
    return actions;
  } catch (error) {
    console.error("Error getting actions from KV:", error);
    return [];
  }
}

export async function saveActions(actions: PlantAction[]): Promise<void> {
  try {
    // Zapisz akcje do Vercel KV
    await kv.set("actions", actions);
  } catch (error) {
    console.error("Error saving actions to KV:", error);
    throw error;
  }
}

// Funkcja migracji danych z plików do KV storage
export async function migrateDataToKV(): Promise<void> {
  try {
    // W rzeczywistej aplikacji mógłbyś tutaj zaimportować dane z plików JSON
    // i zapisać je do KV storage podczas pierwszego wdrożenia
  } catch (error) {
    console.error("Error during migration to KV:", error);
  }
}
