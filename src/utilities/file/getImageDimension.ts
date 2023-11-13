import type {Dimension} from 'types/ui'

export function getImageDimension(blobUrl: string): Promise<Dimension> {
  const img = new Image()
  const promise = new Promise<Dimension>((resolve, reject) => {
    img.onload = () => {
      resolve({width: img.width, height: img.height})
    }

    img.onerror = reject
  })
  img.src = blobUrl

  return promise
}
