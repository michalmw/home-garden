"use server";

import { Plant } from "@/types/Plant";
import {
  getPlants,
  createPlant,
  updatePlant,
  deletePlant,
  getPlant,
} from "@/lib/storage";

// Re-export all storage functions as server actions
export { getPlants, getPlant, createPlant, updatePlant, deletePlant };

// Add any additional server-only logic here
