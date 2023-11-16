interface FetchWithProgressOptions {
  url: string
  onProgress: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void
  onReady?: (response: Blob) => void
  onAbort?: (abortHandler: VoidFunction) => void
  onStart?: () => void
}
export async function fetchWithProgress(options: FetchWithProgressOptions) {
  const {url, onProgress, onReady, onAbort, onStart} = options

  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'

  xhr.addEventListener('progress', onProgress)
  if (onStart) {
    xhr.onloadstart = () => {
      // console.log('LOAD START HAHAH')
      onStart()
    }
  }
  if (onReady) {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        onReady(xhr.response)
      }
    }
  }
  if (onAbort) {
    onAbort(() => {
      xhr.abort()
    })
  }

  xhr.send()
}
