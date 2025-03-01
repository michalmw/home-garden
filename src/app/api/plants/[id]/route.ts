import { NextResponse } from "next/server";
import { getPlant, updatePlant, deletePlant } from "@/lib/storage";
import { Plant } from "@/types/Plant";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/plants/[id]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const plant = await getPlant(params.id);

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plant" },
      { status: 500 }
    );
  }
}

// PUT /api/plants/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const plantUpdate: Partial<Plant> = await request.json();
    const updatedPlant = await updatePlant(params.id, plantUpdate);

    if (!updatedPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlant);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update plant" },
      { status: 500 }
    );
  }
}

// DELETE /api/plants/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const success = await deletePlant(params.id);

    if (!success) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete plant" },
      { status: 500 }
    );
  }
}
