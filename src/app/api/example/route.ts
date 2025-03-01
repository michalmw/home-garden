import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/jsonDataService";

// Example interface for your data
interface ExampleData {
  items: Array<{ id: string; name: string }>;
}

export async function GET() {
  try {
    // Read data from JSON file
    const data = await readData<ExampleData>("example");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Read existing data
    const existingData = await readData<ExampleData>("example");

    // Merge with new data
    const newData = {
      items: [...(existingData.items || []), ...(body.items || [])],
    };

    // Write to JSON file
    await writeData<ExampleData>("example", newData);

    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
