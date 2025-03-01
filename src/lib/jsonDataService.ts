import fs from "fs";
import path from "path";

// Path to the data directory
const DATA_DIR = path.join(process.cwd(), "data");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read data from a JSON file
 * @param filename Name of the JSON file (without extension)
 * @returns The parsed JSON data
 */
export async function readData<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, `${filename}.json`);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {} as T;
    }

    // Read and parse the file
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`Error reading ${filename}.json:`, error);
    return {} as T;
  }
}

/**
 * Write data to a JSON file
 * @param filename Name of the JSON file (without extension)
 * @param data The data to write
 */
export async function writeData<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, `${filename}.json`);

  try {
    // Convert data to JSON string and write to file
    const jsonData = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(filePath, jsonData, "utf-8");
  } catch (error) {
    console.error(`Error writing to ${filename}.json:`, error);
    throw error;
  }
}

/**
 * Update specific fields in a JSON file
 * @param filename Name of the JSON file (without extension)
 * @param updateData Partial data to update
 */
export async function updateData<T>(
  filename: string,
  updateData: Partial<T>
): Promise<T> {
  // Read current data
  const currentData = await readData<T>(filename);

  // Merge with update data
  const updatedData = { ...currentData, ...updateData } as T;

  // Write back to file
  await writeData(filename, updatedData);

  return updatedData;
}
