import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numToTime(num: number) {
  const hours = Math.floor(num / 60)
  let minutes: string | number = num % 60
  if (minutes < 10) {
    minutes = minutes.toString().padStart(2, "0")
  }
  return hours + "h" + minutes
}
