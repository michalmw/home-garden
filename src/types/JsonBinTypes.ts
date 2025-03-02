import { Plant } from "./Plant";
import { PlantAction } from "./Action";

export interface PlantsData {
  plants: Plant[];
}

export interface ActionsData {
  actions: PlantAction[];
}

export interface JsonBinResponse<T> {
  metadata?: {
    id: string;
    createdAt: string;
    private: boolean;
  };
  record: T;
}
