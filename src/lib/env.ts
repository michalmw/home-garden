/**
 * Helper to safely get environment variables
 */

export function getEnv(key: string, defaultValue: string = ""): string {
  const value = process.env[key] || defaultValue;

  // If the value starts and ends with quotes, remove them
  return value.replace(/^["']|["']$/g, "");
}

export const ENV = {
  JSON_BIN_API_URL: getEnv("JSON_BIN_API_URL", "https://api.jsonbin.io/v3/b"),
  JSON_BIN_API_KEY: getEnv("JSON_BIN_API_KEY"),
  PLANTS_BIN_ID: getEnv("PLANTS_BIN_ID"),
  ACTIONS_BIN_ID: getEnv("ACTIONS_BIN_ID"),
};
