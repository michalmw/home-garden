import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Plant } from "@/types/Plant";

// Path to the plants data file
const dataFilePath = path.join(process.cwd(), "data", "plants.json");

// Helper function to read from the data file
function readPlantsData() {
  if (!fs.existsSync(dataFilePath)) {
    return { plants: [] };
  }

  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
}

// Helper function to write to the data file
function writePlantsData(data: any) {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// GET a plant by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = readPlantsData();

    const plant = data.plants.find((p: Plant) => p.id === id);

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error(`Error fetching plant with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch plant" },
      { status: 500 }
    );
  }
}

// PUT (update) a plant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updatedPlant: Plant = await request.json();

    // Validate the ID matches
    if (updatedPlant.id !== id) {
      return NextResponse.json({ error: "ID mismatch" }, { status: 400 });
    }

    // Read current data
    const data = readPlantsData();

    // Find the plant index
    const index = data.plants.findIndex((p: Plant) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    // Update the plant
    data.plants[index] = updatedPlant;

    // Write back to the file
    writePlantsData(data);

    return NextResponse.json(updatedPlant);
  } catch (error) {
    console.error(`Error updating plant with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update plant" },
      { status: 500 }
    );
  }
}

// DELETE a plant
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Read current data
    const data = readPlantsData();

    // Filter out the plant to delete
    const filteredPlants = data.plants.filter((p: Plant) => p.id !== id);

    // If no change in length, the plant wasn't found
    if (filteredPlants.length === data.plants.length) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    // Update data and write back
    data.plants = filteredPlants;
    writePlantsData(data);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error(`Error deleting plant with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete plant" },
      { status: 500 }
    );
  }
}
