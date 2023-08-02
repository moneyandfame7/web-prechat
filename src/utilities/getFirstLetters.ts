export function getInitials(str: string) {
  const matches = str.match(/\b(\w)/g)
  return matches![0] + matches![1]
}
