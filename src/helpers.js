export const upsRegex = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/gi;
//export const upsRegex = /(\b1Z[0-9A-Z]{16}\b)|(\b\d{12}\b)|(\bT\d{10}\b)|(\b\d{9}\b)/i;

export function capitalize(string) {
  return string && string.replace && string.replace(/\b\w/g, l => l.toUpperCase());
}