export const upsRegex = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i;

export function capitalize(string) {
  return string && string.replace && string.replace(/\b\w/g, l => l.toUpperCase());
}