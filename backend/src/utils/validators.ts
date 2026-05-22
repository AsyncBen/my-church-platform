export function isEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

export function isRequired(value: any) {
  return value !== undefined && value !== null && value !== '';
}
