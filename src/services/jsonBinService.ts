/**
 * Service for interacting with jsonBin.io API
 */
import { PlantsData, ActionsData } from "@/types/JsonBinTypes";

const JSON_BIN_API_URL =
  process.env.JSON_BIN_API_URL || "https://api.jsonbin.io/v3/b";
const JSON_BIN_API_KEY =
  "$2a$10$ieDkrsQxLGORqbsjyYfRHe0E.dhERKBKfAQba0wLnOdiPK43cAHEe";
const PLANTS_BIN_ID = process.env.PLANTS_BIN_ID;
const ACTIONS_BIN_ID = process.env.ACTIONS_BIN_ID; // Fixed typo here

if (!JSON_BIN_API_KEY) {
  console.warn("JSON_BIN_API_KEY not set in environment variables");
}

if (!PLANTS_BIN_ID || !ACTIONS_BIN_ID) {
  console.warn(
    "PLANTS_BIN_ID or ACTIONS_BIN_ID not set in environment variables"
  );
}

export interface JsonBinResponse<T> {
  metadata: {
    id: string;
    createdAt: string;
    private: boolean;
  };
  record: T;
}

/**
 * Read data from a specific bin
 */
export async function readBin<T>(binId: string): Promise<T> {
  console.log("key", JSON_BIN_API_KEY);
  const response = await fetch(`${JSON_BIN_API_URL}/${binId}/latest`, {
    method: "GET",
    headers: {
      "X-Master-Key": JSON_BIN_API_KEY || "",
      "X-Bin-Meta": "false",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to read jsonBin: ${response.status} ${response.statusText}`
    );
  }

  // For latest endpoint with X-Bin-Meta: false, the response is just the record
  const data = await response.json();
  return data;
}

/**
 * Update data in a specific bin
 */
export async function updateBin<T>(binId: string, data: T): Promise<T> {
  const response = await fetch(`${JSON_BIN_API_URL}/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSON_BIN_API_KEY || "",
      "X-Bin-Meta": "false",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update jsonBin: ${response.status} ${response.statusText}`
    );
  }

  // For update endpoint with X-Bin-Meta: false, the response is just the updated record
  const updatedData = await response.json();
  return updatedData;
}

/**
 * Get plants data from the plants bin
 */
export async function getPlantsData(): Promise<PlantsData> {
  if (!PLANTS_BIN_ID) {
    throw new Error("PLANTS_BIN_ID not configured");
  }
  return readBin<PlantsData>(PLANTS_BIN_ID);
}

/**
 * Update plants data in the plants bin
 */
export async function updatePlantsData(data: PlantsData): Promise<PlantsData> {
  if (!PLANTS_BIN_ID) {
    throw new Error("PLANTS_BIN_ID not configured");
  }
  return updateBin<PlantsData>(PLANTS_BIN_ID, data);
}

/**
 * Get actions data from the actions bin
 */
export async function getActionsData(): Promise<ActionsData> {
  if (!ACTIONS_BIN_ID) {
    throw new Error("ACTIONS_BIN_ID not configured");
  }
  return readBin<ActionsData>(ACTIONS_BIN_ID);
}

/**
 * Update actions data in the actions bin
 */
export async function updateActionsData(
  data: ActionsData
): Promise<ActionsData> {
  if (!ACTIONS_BIN_ID) {
    throw new Error("ACTIONS_BIN_ID not configured");
  }
  return updateBin<ActionsData>(ACTIONS_BIN_ID, data);
}
