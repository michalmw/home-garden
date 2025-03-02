import { Plant } from "@/types/Plant";
import { PlantAction } from "@/types/Action";
import {
  getPlantsData,
  updatePlantsData,
  getActionsData,
  updateActionsData,
} from "@/services/jsonBinService";

// Get all plants
export async function getPlants(): Promise<Plant[]> {
  try {
    const data = await getPlantsData();
    return data.plants || [];
  } catch (error) {
    console.error("Error getting plants:", error);
    return [];
  }
}

// Get a single plant by ID
export async function getPlant(id: string): Promise<Plant | null> {
  try {
    const data = await getPlantsData();
    const plant = data.plants?.find((p: Plant) => p.id === id);
    return plant || null;
  } catch (error) {
    console.error(`Error getting plant ${id}:`, error);
    return null;
  }
}

// Create a new plant
export async function createPlant(plant: Plant): Promise<Plant> {
  try {
    // Generate ID if not provided
    if (!plant.id) {
      plant.id = Date.now().toString();
    }

    // Set default dates if not provided
    if (!plant.lastWatered) {
      plant.lastWatered = new Date().toISOString();
    }
    if (!plant.lastMisted) {
      plant.lastMisted = new Date().toISOString();
    }

    const data = await getPlantsData();
    const plants = data.plants || [];

    // Add the new plant
    const updatedPlants = { plants: [...plants, plant] };
    await updatePlantsData(updatedPlants);

    return plant;
  } catch (error) {
    console.error("Error creating plant:", error);
    throw error;
  }
}

// Update an existing plant
export async function updatePlant(
  id: string,
  plantUpdate: Partial<Plant>
): Promise<Plant | null> {
  try {
    const data = await getPlantsData();
    const plants = data.plants || [];

    const index = plants.findIndex((p: Plant) => p.id === id);
    if (index === -1) return null;

    // Update the plant
    const updatedPlant = { ...plants[index], ...plantUpdate };
    plants[index] = updatedPlant;

    await updatePlantsData({ plants });
    return updatedPlant;
  } catch (error) {
    console.error(`Error updating plant ${id}:`, error);
    throw error;
  }
}

// Delete a plant
export async function deletePlant(id: string): Promise<boolean> {
  try {
    const data = await getPlantsData();
    const plants = data.plants || [];

    const filteredPlants = plants.filter((p: Plant) => p.id !== id);

    // If no plant was removed
    if (filteredPlants.length === plants.length) return false;

    await updatePlantsData({ plants: filteredPlants });
    return true;
  } catch (error) {
    console.error(`Error deleting plant ${id}:`, error);
    throw error;
  }
}

// Get all actions
export async function getActions(): Promise<PlantAction[]> {
  try {
    const data = await getActionsData();
    return data.actions || [];
  } catch (error) {
    console.error("Error getting actions:", error);
    return [];
  }
}

// Add a new action
export async function addAction(action: PlantAction): Promise<PlantAction> {
  try {
    // Generate ID if not provided
    if (!action.id) {
      action.id = Date.now().toString();
    }

    const data = await getActionsData();
    const actions = data.actions || [];

    // Add the new action
    const updatedActions = { actions: [...actions, action] };
    await updateActionsData(updatedActions);

    return action;
  } catch (error) {
    console.error("Error adding action:", error);
    throw error;
  }
}
