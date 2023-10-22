import {type FC, useEffect, useState} from 'preact/compat'

import clsx from 'clsx'
import {Blurhash} from 'react-blurhash'

// import {useForceUpdate} from 'hooks/useForceUpdate'
import './Photo.scss'

interface PhotoProps {
  url: string
  blurHash: string
  width?: number | string
  height?: number | string
  alt: string
  lazy?: boolean
  mountBlurhash?: boolean
}
const photoCache = new Set<string>()
/**
 * @todo cache urls, usestate init true if url in cache?
 */
const Photo: FC<PhotoProps> = ({url, blurHash, width, height, alt, lazy = false}) => {
  const [imgIsLoad, setImgIsLoad] = useState(photoCache.has(url))
  useEffect(() => {
    photoCache.add(url)
  }, [url])
  // const forceUpdate = useForceUpdate()
  const handleImageLoad = () => {
    setImgIsLoad(true)
    // forceUpdate()
  }

  const buildedClass = clsx('media-photo-container', {
    'is-load': imgIsLoad,
  })
  // useEffect(()=>{},[])
  return (
    <div class={buildedClass} style={{width, height}}>
      {blurHash /* && !imgIsLoad */ && (
        // @ts-expect-error Preact types are confused
        <Blurhash className="media-blurhash" hash={blurHash} width="100%" height="100%" />
      )}

      <img
        loading={lazy ? 'lazy' : 'eager'}
        alt={alt}
        class="media-photo"
        width="100%"
        height="100%"
        style={{
          opacity: imgIsLoad ? 1 : 0,
        }}
        src={url}
        onLoad={handleImageLoad}
      />
    </div>
  )
}
export {Photo}
