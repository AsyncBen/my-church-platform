export function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value)
}

export function isPhoneNumber(value: string) {
  return /^\+?\d{7,15}$/.test(value.trim())
}

export function isEmailOrPhone(value: string) {
  return isEmail(value) || isPhoneNumber(value)
}

export function isStrongPassword(value: string) {
  return value.trim().length >= 6
}
