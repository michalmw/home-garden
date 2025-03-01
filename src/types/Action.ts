export interface PlantAction {
  id: string;
  plantId: string;
  type: "watering" | "misting";
  date: string; // ISO date string
}
