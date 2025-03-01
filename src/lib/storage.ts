import { Plant, PlantWithId } from "@/types/Plant";
import { readData, writeData } from "./jsonDataService";

export async function getPlants(): Promise<PlantWithId[]> {
  try {
    const data = await readData<{ plants: PlantWithId[] }>("plants");
    return data.plants || [];
  } catch (error) {
    console.error("Error getting plants from JSON storage:", error);
    return [];
  }
}

export async function getPlant(id: string): Promise<PlantWithId | null> {
  try {
    const plants = await getPlants();
    return plants.find((plant) => plant.id === id) || null;
  } catch (error) {
    console.error(`Error getting plant ${id} from JSON storage:`, error);
    return null;
  }
}

export async function createPlant(plant: Plant): Promise<PlantWithId> {
  try {
    const plants = await getPlants();

    // Generate a unique ID
    const id = crypto.randomUUID();

    // Create new plant with ID
    const plantWithId: PlantWithId = { ...plant, id };

    // Add to existing plants
    const updatedPlants = [...plants, plantWithId];

    // Save to JSON file
    await writeData("plants", { plants: updatedPlants });

    return plantWithId;
  } catch (error) {
    console.error("Error creating plant in JSON storage:", error);
    throw error;
  }
}

export async function updatePlant(
  id: string,
  plant: Partial<Plant>
): Promise<PlantWithId | null> {
  try {
    const plants = await getPlants();
    const index = plants.findIndex((p) => p.id === id);

    if (index === -1) return null;

    // Update the plant
    const updatedPlant = { ...plants[index], ...plant };
    plants[index] = updatedPlant;

    // Save to JSON file
    await writeData("plants", { plants });

    return updatedPlant;
  } catch (error) {
    console.error(`Error updating plant ${id} in JSON storage:`, error);
    throw error;
  }
}

export async function deletePlant(id: string): Promise<boolean> {
  try {
    const plants = await getPlants();
    const updatedPlants = plants.filter((plant) => plant.id !== id);

    // If no plant was filtered out, the ID doesn't exist
    if (updatedPlants.length === plants.length) {
      return false;
    }

    // Save to JSON file
    await writeData("plants", { plants: updatedPlants });

    return true;
  } catch (error) {
    console.error(`Error deleting plant ${id} from JSON storage:`, error);
    throw error;
  }
}
