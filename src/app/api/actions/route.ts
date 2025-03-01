import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const actionsFilePath = path.join(process.cwd(), "data", "actions.json");

// Helper function to read the actions data file
function readActionsData() {
  if (!fs.existsSync(actionsFilePath)) {
    // Initialize with empty actions array if file doesn't exist
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(actionsFilePath, JSON.stringify({ actions: [] }, null, 2));
    return { actions: [] };
  }

  const data = fs.readFileSync(actionsFilePath, "utf8");
  return JSON.parse(data);
}

// Helper function to write to the actions data file
function writeActionsData(data: any) {
  const dirPath = path.join(process.cwd(), "data");

  // Create the data directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(actionsFilePath, JSON.stringify(data, null, 2));
}

// GET all actions
export async function GET(request: Request) {
  try {
    const data = readActionsData();
    return NextResponse.json(data.actions);
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

    // Generate ID if not provided
    if (!action.id) {
      action.id = Date.now().toString();
    }

    // Read current data and check if there's already an action for this plant/type/date
    const data = readActionsData();
    const today = new Date().toISOString().split("T")[0];
    const existingAction = data.actions.find(
      (a: any) =>
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

    // Add new action and write back
    data.actions.push(action);
    writeActionsData(data);

    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    console.error("Error adding action:", error);
    return NextResponse.json(
      { error: "Failed to add action" },
      { status: 500 }
    );
  }
}
