import { NextResponse } from "next/server";
import { createPlant, getPlants } from "@/lib/storage";
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
    const newPlant = await createPlant(plant);
    return NextResponse.json(newPlant, { status: 201 });
  } catch (error) {
    console.error("Error adding plant:", error);
    return NextResponse.json(
      { error: "Failed to create plant" },
      { status: 500 }
    );
  }
}
