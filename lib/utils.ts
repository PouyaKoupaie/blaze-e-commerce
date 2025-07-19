import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convers a prisma object to normal js object
export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}