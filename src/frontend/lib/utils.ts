import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
	return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}
