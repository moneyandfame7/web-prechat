export function convertFileSize(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))

  const fixedSize = ((size / Math.pow(1024, i)) * 1).toFixed(2)

  const units = ['B', 'KB', 'MB', 'GB', 'TB']

  return `${fixedSize} ${units[i]}`
}
