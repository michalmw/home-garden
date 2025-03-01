import { Plant } from "@/types/Plant";
import { PlantAction } from "@/types/Action";

export const plantService = {
  // Get all plants
  getPlants: async (): Promise<Plant[]> => {
    try {
      const res = await fetch("/api/plants");
      if (!res.ok) {
        throw new Error("Failed to fetch plants");
      }
      return res.json();
    } catch (error) {
      console.error("API Error:", error);
      // Fall back to localStorage for backward compatibility
      const plants = localStorage.getItem("plants");
      return plants ? JSON.parse(plants) : [];
    }
  },

  // Get a single plant by id
  getPlant: async (id: string): Promise<Plant | null> => {
    try {
      const res = await fetch(`/api/plants/${id}`);
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch plant");
      }
      return res.json();
    } catch (error) {
      console.error("API Error:", error);

      // Fall back to localStorage for backward compatibility
      const plants = localStorage.getItem("plants");
      if (!plants) return null;

      const parsedPlants: Plant[] = JSON.parse(plants);
      return parsedPlants.find((p) => p.id === id) || null;
    }
  },

  // Add a new plant
  addPlant: async (plant: Plant): Promise<Plant> => {
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });

      if (!res.ok) {
        throw new Error("Failed to add plant");
      }

      return res.json();
    } catch (error) {
      console.error("API Error:", error);

      // Fall back to localStorage
      const plants = localStorage.getItem("plants");
      const parsedPlants: Plant[] = plants ? JSON.parse(plants) : [];

      const newPlant = {
        ...plant,
        id: plant.id || Date.now().toString(),
      };

      const updatedPlants = [...parsedPlants, newPlant];
      localStorage.setItem("plants", JSON.stringify(updatedPlants));

      return newPlant;
    }
  },

  // Update an existing plant
  updatePlant: async (plant: Plant): Promise<Plant> => {
    try {
      const res = await fetch(`/api/plants/${plant.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });

      if (!res.ok) {
        throw new Error("Failed to update plant");
      }

      return res.json();
    } catch (error) {
      console.error("API Error:", error);

      // Fall back to localStorage
      const plants = localStorage.getItem("plants");
      if (!plants) throw new Error("No plants found");

      const parsedPlants: Plant[] = JSON.parse(plants);
      const updatedPlants = parsedPlants.map((p) =>
        p.id === plant.id ? plant : p
      );

      localStorage.setItem("plants", JSON.stringify(updatedPlants));
      return plant;
    }
  },

  // Delete a plant
  deletePlant: async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete plant");
      }
    } catch (error) {
      console.error("API Error:", error);

      // Fall back to localStorage
      const plants = localStorage.getItem("plants");
      if (!plants) return;

      const parsedPlants: Plant[] = JSON.parse(plants);
      const updatedPlants = parsedPlants.filter((p) => p.id !== id);

      localStorage.setItem("plants", JSON.stringify(updatedPlants));
    }
  },

  // Mark a plant as watered today
  waterPlant: async (id: string): Promise<Plant> => {
    try {
      const res = await fetch("/api/plants/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plantId: id, actionType: "watering" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to water plant");
      }

      const { plant } = await res.json();
      return plant;
    } catch (error) {
      console.error("API Error:", error);

      // Fall back to original method
      const plant = await plantService.getPlant(id);
      if (!plant) throw new Error("Plant not found");

      const updatedPlant = {
        ...plant,
        lastWatered: new Date().toISOString(),
      };

      await plantService.updatePlant(updatedPlant);
      await plantService.logAction({
        id: Date.now().toString(),
        plantId: id,
        type: "watering",
        date: new Date().toISOString(),
      });

      return updatedPlant;
    }
  },

  // Mark a plant as misted today
  mistPlant: async (id: string): Promise<Plant> => {
    try {
      const res = await fetch("/api/plants/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plantId: id, actionType: "misting" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to mist plant");
      }

      const { plant } = await res.json();
      return plant;
    } catch (error) {
      console.error("API Error:", error);

      // Fall back to original method
      const plant = await plantService.getPlant(id);
      if (!plant) throw new Error("Plant not found");

      const updatedPlant = {
        ...plant,
        lastMisted: new Date().toISOString(),
      };

      await plantService.updatePlant(updatedPlant);
      await plantService.logAction({
        id: Date.now().toString(),
        plantId: id,
        type: "misting",
        date: new Date().toISOString(),
      });

      return updatedPlant;
    }
  },

  // Check if an action can be performed on a plant today
  canPerformAction: async (
    plantId: string,
    actionType: "watering" | "misting"
  ): Promise<boolean> => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(
        `/api/plants/actions?plantId=${plantId}&date=${today}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch plant actions");
      }

      const actions: PlantAction[] = await res.json();
      return !actions.some((action) => action.type === actionType);
    } catch (error) {
      console.error("Error checking action status:", error);

      // Fall back to localStorage
      const actionsJSON = localStorage.getItem("plantActions");
      const actions = actionsJSON ? JSON.parse(actionsJSON) : [];
      const today = new Date().toISOString().split("T")[0];

      return !actions.some(
        (action: PlantAction) =>
          action.plantId === plantId &&
          action.type === actionType &&
          action.date.split("T")[0] === today
      );
    }
  },

  // Log an action
  logAction: async (action: PlantAction): Promise<PlantAction> => {
    // This is now handled by the waterPlant and mistPlant methods
    // Keeping this method for backward compatibility
    const actionsJSON = localStorage.getItem("plantActions");
    const actions = actionsJSON ? JSON.parse(actionsJSON) : [];

    actions.push(action);
    localStorage.setItem("plantActions", JSON.stringify(actions));

    return action;
  },

  // Get today's actions for a plant
  getTodaysActions: async (plantId: string): Promise<PlantAction[]> => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(
        `/api/plants/actions?plantId=${plantId}&date=${today}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch plant actions");
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching today's actions:", error);

      // Fall back to localStorage
      const actionsJSON = localStorage.getItem("plantActions");
      const actions = actionsJSON ? JSON.parse(actionsJSON) : [];
      const today = new Date().toISOString().split("T")[0];

      return actions.filter(
        (action: PlantAction) =>
          action.plantId === plantId && action.date.split("T")[0] === today
      );
    }
  },
};
