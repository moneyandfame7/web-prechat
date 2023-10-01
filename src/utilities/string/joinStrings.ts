export function joinStrings(...args: (string | undefined)[]) {
  return args.filter(Boolean).join(' ')
}
