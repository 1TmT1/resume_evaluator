import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function trimUntilBraces(str: string) {
  let startIndex = -1;
  let endIndex = -1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "{") {
      startIndex = i;
      break;
    }
  }

  for (let i = str.length - 1; i > -1; i--) {
    if (str[i] === "}") {
      endIndex = i;
      break;
    }
  }

  return str.slice(startIndex, endIndex + 1);
}
