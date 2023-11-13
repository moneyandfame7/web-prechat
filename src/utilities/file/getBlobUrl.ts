export function getBlobUrl(file: File) {
  return URL.createObjectURL(file)
}
