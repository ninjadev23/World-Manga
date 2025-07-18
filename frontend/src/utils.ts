import type { TypeManga, TypeVolume } from "./types";
export function isManga(data: unknown): data is TypeManga {
  const obj = data as TypeManga;

  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.categories) &&
    typeof obj.language === 'string' &&
    typeof obj.cover === 'string' &&
    typeof obj.username === 'string' &&
    Array.isArray(obj.volumes) &&
    obj.volumes.every(isVolume)
  );
}

export function isVolume(vol: unknown): vol is TypeVolume {
  const v = vol as TypeVolume;
  return (
    typeof v.file === 'string' &&
    typeof v.cover === 'string' &&
    typeof v.number === 'number'
  );
}