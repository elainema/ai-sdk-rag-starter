// NanoID 是一个轻量级、安全且高效的唯一 ID 生成器，主要用于生成短小、紧凑且唯一的字符串 ID
import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");
