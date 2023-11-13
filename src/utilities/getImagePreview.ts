/**
 * https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react#comment94991328_54060913 ????
 */
export function getImagePreview(file: File) {
  return URL.createObjectURL(file)
}
