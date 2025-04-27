/**
 * Custom implementation of clsx utility
 * This allows for conditional class name joining without external dependencies
 */

type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flatMap(input => {
      if (Array.isArray(input)) {
        return cn(...input);
      } else if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return input;
    })
    .filter(Boolean)
    .join(' ')
    .trim();
} 