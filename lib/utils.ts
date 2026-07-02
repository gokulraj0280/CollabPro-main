import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Concatenates and merges Tailwind CSS classes using clsx and tailwind-merge.
 * @param {ClassValue[]} inputs - An array of class values to be merged.
 * @returns {string} The merged class string.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
