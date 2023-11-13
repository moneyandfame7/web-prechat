export function downloadFile(blob: Blob, fileName: string) {
  const blobUrl = window.URL.createObjectURL(blob)

  const link = window.document.createElement('a')
  link.style.display = 'none'
  link.href = blobUrl
  link.download = fileName
  link.click()

  window.URL.revokeObjectURL(blobUrl)
}
