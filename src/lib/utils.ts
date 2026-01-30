import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isServer() {
  return typeof window === "undefined";
}


export function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name];
  if (v == null) return defaultValue;
  const normalized = v.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return defaultValue;
}