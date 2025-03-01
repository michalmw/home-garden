import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Plant } from "@/types/Plant";
import { PlantAction } from "@/types/Action";

// Path to the plants and actions data files
const plantsFilePath = path.join(process.cwd(), "data", "plants.json");
const actionsFilePath = path.join(process.cwd(), "data", "actions.json");

// Helper functions for plants data
function readPlantsData() {
  if (!fs.existsSync(plantsFilePath)) {
    return { plants: [] };
  }

  const data = fs.readFileSync(plantsFilePath, "utf8");
  return JSON.parse(data);
}

function writePlantsData(data: any) {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(plantsFilePath, JSON.stringify(data, null, 2));
}

// Helper functions for actions data
function readActionsData() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(actionsFilePath)) {
    fs.writeFileSync(actionsFilePath, JSON.stringify({ actions: [] }, null, 2));
    return { actions: [] };
  }

  const data = fs.readFileSync(actionsFilePath, "utf8");
  return JSON.parse(data);
}

function writeActionsData(data: any) {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(actionsFilePath, JSON.stringify(data, null, 2));
}

// POST water or mist a plant
export async function POST(request: Request) {
  try {
    const { plantId, actionType } = await request.json();

    if (
      !plantId ||
      !actionType ||
      !["watering", "misting"].includes(actionType)
    ) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Read plants data
    const plantsData = readPlantsData();

    // Find the plant
    const plantIndex = plantsData.plants.findIndex(
      (p: Plant) => p.id === plantId
    );

    if (plantIndex === -1) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    // Get the current plant
    const plant = plantsData.plants[plantIndex];

    // Read actions data to check if already performed today
    const actionsData = readActionsData();
    const today = new Date().toISOString().split("T")[0];

    const alreadyPerformed = actionsData.actions.some(
      (a: PlantAction) =>
        a.plantId === plantId &&
        a.type === actionType &&
        a.date.split("T")[0] === today
    );

    if (alreadyPerformed) {
      return NextResponse.json(
        {
          error: `Plant already ${
            actionType === "watering" ? "watered" : "misted"
          } today`,
        },
        { status: 409 }
      );
    }

    // Update the plant's last watered/misted date
    const now = new Date().toISOString();

    if (actionType === "watering") {
      plant.lastWatered = now;
    } else {
      plant.lastMisted = now;
    }

    // Update plants data
    plantsData.plants[plantIndex] = plant;
    writePlantsData(plantsData);

    // Log the action
    const action: PlantAction = {
      id: Date.now().toString(),
      plantId,
      type: actionType as "watering" | "misting",
      date: now,
    };

    actionsData.actions.push(action);
    writeActionsData(actionsData);

    return NextResponse.json({ success: true, plant, action });
  } catch (error) {
    console.error("Error performing plant action:", error);
    return NextResponse.json(
      { error: "Failed to perform plant action" },
      { status: 500 }
    );
  }
}

// GET actions for a specific plant or all actions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get("plantId");
    const dateParam = searchParams.get("date");

    const actionsData = readActionsData();
    let actions = actionsData.actions;

    // Filter by plant ID if provided
    if (plantId) {
      actions = actions.filter((a: PlantAction) => a.plantId === plantId);
    }

    // Filter by date if provided
    if (dateParam) {
      const date = dateParam.split("T")[0];
      actions = actions.filter(
        (a: PlantAction) => a.date.split("T")[0] === date
      );
    }

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Error fetching plant actions:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant actions" },
      { status: 500 }
    );
  }
}
