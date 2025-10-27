export function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}
export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}
