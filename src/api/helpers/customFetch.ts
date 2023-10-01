const parseHeaders = (rawHeaders: any) => {
  const headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(':')
    const key = parts.shift().trim()
    if (key) {
      const value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

export const uploadFetch = (url: string, options: any) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      const opts: any = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
      }
      opts.url = 'responseURL' in xhr ? xhr.responseURL : opts.headers.get('X-Request-URL')
      const body = 'response' in xhr ? xhr.response : (xhr as any).responseText
      resolve(new Response(body, opts))
    }
    xhr.onerror = () => {
      reject(new TypeError('Network request failed'))
    }
    xhr.ontimeout = () => {
      reject(new TypeError('Network request failed'))
    }
    xhr.open(options.method, url, true)

    Object.keys(options.headers).forEach((key) => {
      xhr.setRequestHeader(key, options.headers[key])
    })

    if (xhr.upload) {
      xhr.upload.onprogress = options.onProgress
    }

    options.onAbortPossible(() => {
      xhr.abort()
    })

    xhr.send(options.body)
  })

export const customFetch = (uri: any, options: any) => {
  if (options.useUpload) {
    return uploadFetch(uri, options)
  }
  return fetch(uri, options)
}

export function customFetch2(url: string, opts: any = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open(opts.method || 'get', url)

    for (const k in opts.headers || {}) xhr.setRequestHeader(k, opts.headers[k])

    xhr.onload = (e) =>
      resolve({
        ok: true,
        text: () => Promise.resolve((e?.target as any)?.responseText),
        json: () => Promise.resolve(JSON.parse((e?.target as any)?.responseText)),
      })

    xhr.onerror = reject

    if (xhr.upload)
      xhr.upload.onprogress = (event) =>
        console.log(`${(event.loaded / event.total) * 100}% uploaded`)

    xhr.send(opts.body)
  })
}
