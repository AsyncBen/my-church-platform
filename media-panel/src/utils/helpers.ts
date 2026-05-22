export function classNames(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ')
}

export function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}
