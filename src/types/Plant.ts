export interface Plant {
  id: string;
  name: string;
  species?: string;
  image?: string; // Base64 encoded image or URL
  imageName?: string;
  wateringInterval: number; // days between watering
  mistingInterval: number; // days between misting
  lastWatered: string; // ISO date string
  lastMisted: string; // ISO date string
  notes?: string;
}

export interface PlantWithId extends Plant {
  id: string;
}

export interface PlantTask {
  id: string;
  plantId: string;
  type: "watering" | "misting";
  dueDate: string; // ISO date string
  completed: boolean;
}
