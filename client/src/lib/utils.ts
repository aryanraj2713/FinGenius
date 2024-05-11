import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Razorpay from "razorpay"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
