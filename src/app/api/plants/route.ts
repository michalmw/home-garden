import { NextResponse } from "next/server";
import { getPlants, savePlants } from "@/lib/storage";
import { Plant } from "@/types/Plant";

// GET all plants
export async function GET() {
  try {
    const plants = await getPlants();
    return NextResponse.json(plants);
  } catch (error) {
    console.error("Error reading plants data:", error);
    return NextResponse.json(
      { error: "Failed to fetch plants" },
      { status: 500 }
    );
  }
}

// POST a new plant
export async function POST(request: Request) {
  try {
    const plant: Plant = await request.json();

    // Validate required fields
    if (!plant.name || !plant.wateringInterval || !plant.mistingInterval) {
      return NextResponse.json(
        { error: "Missing required plant data" },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!plant.id) {
      plant.id = Date.now().toString();
    }

    // Add timestamps if not provided
    if (!plant.lastWatered) {
      plant.lastWatered = new Date().toISOString();
    }

    if (!plant.lastMisted) {
      plant.lastMisted = new Date().toISOString();
    }

    // Pobierz obecne rośliny, dodaj nową, zapisz
    const plants = await getPlants();
    plants.push(plant);
    await savePlants(plants);

    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error("Error adding plant:", error);
    return NextResponse.json({ error: "Failed to add plant" }, { status: 500 });
  }
}
