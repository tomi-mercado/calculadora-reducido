import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PROMIEDOS_URL = "https://www.promiedos.com.ar";
export const getImageURL = (imageSrc: string) => {
  return `${PROMIEDOS_URL}/${imageSrc}`;
};
