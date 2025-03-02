import { NextResponse } from "next/server";
import { getActions, addAction } from "@/lib/storage";
import { PlantAction } from "@/types/Action";

// GET all actions
export async function GET(request: Request) {
  try {
    const actions = await getActions();
    return NextResponse.json(actions);
  } catch (error) {
    console.error("Error reading actions data:", error);
    return NextResponse.json(
      { error: "Failed to fetch actions" },
      { status: 500 }
    );
  }
}

// POST a new action
export async function POST(request: Request) {
  try {
    const action = await request.json();

    // Validate required fields
    if (!action.plantId || !action.type || !action.date) {
      return NextResponse.json(
        { error: "Missing required action data" },
        { status: 400 }
      );
    }

    // Check for existing action today
    const actions = await getActions();
    const today = new Date().toISOString().split("T")[0];
    const existingAction = actions.find(
      (a: PlantAction) =>
        a.plantId === action.plantId &&
        a.type === action.type &&
        a.date.split("T")[0] === today
    );

    if (existingAction) {
      return NextResponse.json(
        { error: "Action already performed today", existingAction },
        { status: 409 }
      );
    }

    // Add new action
    const newAction = await addAction(action);
    return NextResponse.json(newAction, { status: 201 });
  } catch (error) {
    console.error("Error adding action:", error);
    return NextResponse.json(
      { error: "Failed to add action" },
      { status: 500 }
    );
  }
}
