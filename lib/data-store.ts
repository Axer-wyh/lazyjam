import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

const isBrowser = typeof window !== "undefined";

const LOCAL_PREFIX = "lazyjam_";

export async function readJsonFile<T>(fileName: string): Promise<T> {
  // Try server-side read first
  try {
    const filePath = path.join(dataDir, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // Fallback: try localStorage (browser environment)
    if (isBrowser) {
      const stored = localStorage.getItem(LOCAL_PREFIX + fileName);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    }
    throw new Error(`Cannot read ${fileName}`);
  }
}

export async function writeJsonFile<T>(fileName: string, data: T): Promise<T> {
  // Try server-side write first
  try {
    const filePath = path.join(dataDir, fileName);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    return data;
  } catch {
    // Fallback: write to localStorage (e.g. Vercel serverless)
    if (isBrowser) {
      localStorage.setItem(LOCAL_PREFIX + fileName, JSON.stringify(data));
    }
    return data;
  }
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
