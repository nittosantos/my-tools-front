import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte price_per_day para número e formata como moeda brasileira
 * @param price - Pode ser string ou number (ex: "120.00" ou 120.00)
 * @returns String formatada (ex: "120.00")
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}

