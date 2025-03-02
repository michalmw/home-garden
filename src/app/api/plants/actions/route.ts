import { NextResponse } from "next/server";
import { updatePlant, getPlant, addAction } from "@/lib/storage";
import { PlantAction } from "@/types/Action";

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

    // Find the plant
    const plant = await getPlant(plantId);

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    // Check if action already performed today
    const today = new Date().toISOString().split("T")[0];

    // Log the action
    const now = new Date().toISOString();
    const action: PlantAction = {
      id: Date.now().toString(),
      plantId,
      type: actionType as "watering" | "misting",
      date: now,
    };

    // Update the plant's last watered/misted date
    let plantUpdate = {};
    if (actionType === "watering") {
      plantUpdate = { lastWatered: now };
    } else {
      plantUpdate = { lastMisted: now };
    }

    // Update the plant
    const updatedPlant = await updatePlant(plantId, plantUpdate);

    // Add the action record
    await addAction(action);

    return NextResponse.json({ success: true, plant: updatedPlant, action });
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

    // Import getActions here to avoid circular dependencies
    const { getActions } = require("@/lib/storage");
    let actions = await getActions();

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
