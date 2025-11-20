

//All lowercase
export function normalizeUsername(s: string): string {
  const trimmed = s.trim().toLowerCase();
  return trimmed.replaceAll(/[.\s]+/g, "_");
}
